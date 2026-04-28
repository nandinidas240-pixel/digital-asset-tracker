import { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytesResumable } from 'firebase/storage';

// 1. Receive the 'user' prop passed from App.jsx
export default function UploadZone({ user }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // 2. Ensure both a file and a logged-in user exist
    if (!file || !user) {
      alert("Please ensure a file is selected and you are signed in.");
      return;
    }

    setUploading(true);
    const timestamp = Date.now();
    const storageRef = ref(storage, `assets/${timestamp}_${file.name}`);

    // 3. CREATE METADATA: This is the critical fix
    // This connects the file upload to your User ID
    const metadata = {
      customMetadata: {
        'userId': user.uid
      }
    };

    // 4. ADD METADATA TO UPLOAD: Pass metadata as the third argument
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.error('Upload failed:', error);
        setUploading(false);
      },
      () => {
        console.log('Upload successful with userId metadata!');
        setUploading(false);
        setFile(null);
        
        const input = document.getElementById('industrial-file-input');
        if (input) input.value = '';
      }
    );
  };

  return (
    <div className="panel-industrial flex flex-col gap-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold font-sans uppercase tracking-widest border-b border-black pb-2">Asset Ingest</h2>
      
      <input 
        id="industrial-file-input"
        type="file" 
        accept="image/*" 
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm cursor-pointer file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:border file:border-black file:rounded-none file:text-sm file:font-bold file:bg-white file:text-black hover:file:bg-black hover:file:text-white file:transition-colors"
      />
      
      {file && (
        <div className="text-sm border border-black p-2 truncate">
          <span className="font-bold">TARGET:</span> {file.name}
        </div>
      )}

      <button 
        onClick={handleUpload}
        disabled={!file || uploading || !user}
        className="btn-industrial mt-2 disabled:opacity-50 disabled:pointer-events-none w-full font-bold tracking-wider uppercase"
      >
        {uploading ? 'TRANSMITTING...' : 'INITIATE UPLOAD'}
      </button>
      
      {!user && <p className="text-xs text-red-500 font-bold uppercase mt-1 text-center">Auth Required: Sign in to upload</p>}
    </div>
  );
}