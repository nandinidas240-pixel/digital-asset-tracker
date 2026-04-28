import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';

// 1. RECEIVE USER PROP: Required to filter reports for your account
export default function ReportDashboard({ user }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // 2. UPDATED QUERY: Uses 'userId' filter and 'updatedAt' sorting
    // These must match your Firestore field names exactly
    const q = query(
      collection(db, 'media_scans'), 
      where("userId", "==", user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReports(reportsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) return <div className="p-4 text-center font-mono text-sm animate-pulse">SYNCHRONIZING_DATA...</div>;

  return (
    <div className="flex flex-col gap-4 mt-8 max-w-4xl mx-auto w-full font-mono">
      <h2 className="text-xl font-bold uppercase tracking-widest border-b-2 border-black pb-2 mb-2">
        Scan Reports
      </h2>
      
      {reports.length === 0 ? (
        <div className="p-10 border border-black italic text-center tracking-widest bg-gray-50">
          NO REPORTS DETECTED FOR_SESSION: {user.uid.substring(0, 8)}
        </div>
      ) : (
        <ul className="flex flex-col gap-6">
          {reports.map((report) => (
            <li key={report.id} className="panel-industrial border border-black p-4 bg-white flex flex-col gap-4">
              
              {/* ASSET PREVIEW: Now displays the image using imageUrl */}
              <div className="w-full aspect-video bg-black border border-black overflow-hidden relative">
                <img 
                  src={report.imageUrl} 
                  alt="Asset Preview" 
                  className="w-full h-full object-contain opacity-90" 
                />
                <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 text-[10px] font-bold border-l border-b border-black">
                  STATUS: {report.status?.toUpperCase()}
                </div>
              </div>

              <div className="flex justify-between items-center border-b border-black pb-2">
                <span className="font-bold truncate text-sm uppercase tracking-tighter" title={report.fileName}>
                  {report.fileName || 'UNKNOWN_TARGET'}
                </span>
                <span className="text-[10px] border border-black px-2 py-1 uppercase bg-black text-white">
                  {report.updatedAt ? new Date(report.updatedAt.toMillis()).toLocaleDateString() : 'NO_DATE'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="flex flex-col border border-black p-2 bg-gray-100">
                  <span className="font-bold border-b border-black mb-1 pb-1">AI PROBABILITY</span>
                  <span className={`text-lg font-bold ${report.ai_probability > 0.5 ? 'text-red-600' : 'text-green-600'}`}>
                    {report.ai_probability !== undefined ? `${(report.ai_probability * 100).toFixed(0)}%` : 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col border border-black p-2 bg-gray-100">
                  <span className="font-bold border-b border-black mb-1 pb-1">ORIGINALITY</span>
                  <span className="text-lg font-bold text-blue-600">
                    {report.originality_score !== undefined ? `${(report.originality_score * 100).toFixed(0)}%` : 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="p-3 border border-black bg-gray-50 text-[11px] leading-relaxed">
                <p className="font-bold mb-1 uppercase tracking-widest border-b border-black border-dashed pb-1">Analysis Log:</p>
                <p className="mt-2 text-slate-700">{report.summary || 'No data available.'}</p>
              </div>

              <div className="flex justify-between items-center text-[9px] text-gray-500 uppercase font-bold">
                <span>ID: {report.id.substring(0, 16)}...</span>
                <span>MOD_DETECTED: {report.modifications_detected ? 'TRUE' : 'FALSE'}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}