const { onObjectFinalized } = require("firebase-functions/v2/storage");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

admin.initializeApp();
const db = admin.firestore();

const genAI = new GoogleGenerativeAI(process.env.GENAI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: "object",
      properties: {
        ai_probability: { type: "number" },
        summary: { type: "string" },
        modifications_detected: { type: "boolean" },
        originality_score: { type: "number" },
      },
      required: ["ai_probability", "summary", "modifications_detected", "originality_score"],
    },
  },
});

exports.analyzeMedia = onObjectFinalized(
  {
    region: "asia-south1",
    timeoutSeconds: 120,
    memory: "512MiB",
  },
  async (event) => {
    const file = event.data;
    if (!file || !file.name || !file.contentType?.startsWith("image/")) return;

    const safeDocId = file.name.replace(/\//g, "_");
    const docRef = db.collection("media_scans").doc(safeDocId);

    try {
      // 1. GENERATE PUBLIC IMAGE URL
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${file.bucket}/o/${encodeURIComponent(file.name)}?alt=media`;

      // 2. EXTRACT USER ID (Crucial for frontend display)
      const userId = file.metadata?.userId || "anonymous";

      // 3. PROCESS IMAGE
      const bucket = admin.storage().bucket(file.bucket);
      const [buffer] = await bucket.file(file.name).download();

      const result = await model.generateContent([
        { inlineData: { mimeType: file.contentType, data: buffer.toString("base64") } },
        { text: "Analyze image for AI and modifications." },
      ]);

      const analysis = JSON.parse(result.response.text());

      // 4. SAVE TO FIRESTORE (Linking user and image)
      await docRef.set({
        fileName: file.name,
        imageUrl: publicUrl, 
        userId: userId,     // This allows ReportDashboard to find YOUR files
        ...analysis,
        status: "success",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Success: ${file.name}`);

    } catch (error) {
      console.error(`❌ Failure: ${file.name}`, error.message);
      await db.collection("media_scans_failed").add({
        fileName: file.name,
        error: error.message,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }
);