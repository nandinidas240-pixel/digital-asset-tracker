Digital Asset Tracker - Solution Challenge 2026
AI-powered asset management system for the automated ingestion, analysis, and verification of digital files. This prototype satisfies the mandatory requirement for cloud deployment and the use of Google AI models.  

Project Links
Live MVP: https://digital-asset-tracker-c7f2f.web.app

GitHub Repository: https://github.com/nandinidas240-pixel/digital-asset-tracker

Core Features
AI-Driven Ingestion: Automated scanning of digital assets to extract metadata and identify content.

Intelligent Reporting: Instant report generation providing detailed asset insights and verification status.

Secure Authentication: User sessions managed via Firebase Google Auth.

Real-time Synchronization: Asset history and reports synced instantly using Cloud Firestore.

Cloud-Native Infrastructure: Globally accessible via Firebase Hosting.

Tech Stack

Google Gemini API: Primary AI engine for asset intelligence and scanning.  

Firebase Cloud Functions: Backend logic for event-driven AI triggers.

Cloud Firestore: Real-time NoSQL database for asset persistence.


Firebase Hosting: Secure cloud deployment platform.  

React.js & Tailwind CSS: Modern frontend architecture for the terminal-style UI.

System Architecture
The application utilizes an event-driven architecture:

Ingest: User uploads file via React frontend.

Trigger: Upload event initiates a Firebase Cloud Function.

Analyze: File data is processed by Google Gemini for intelligence extraction.

Sync: Results are stored in Firestore and pushed to the UI dashboard in real
