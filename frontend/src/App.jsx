import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import UploadZone from './components/UploadZone';
import ReportDashboard from './components/ReportDashboard';
import AccountView from './components/AccountView';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = () => signInWithPopup(auth, googleProvider);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-blue-500 font-mono uppercase">Initializing_System...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-mono">
        <div className="w-full max-w-md p-8 border border-white/10 bg-white/5">
          <h1 className="text-xl font-bold mb-6 tracking-tighter uppercase text-white">Digital Asset Terminal</h1>
          <button onClick={handleSignIn} className="w-full bg-white text-black font-bold py-3 hover:bg-slate-200 transition-colors uppercase text-sm">
            Login_With_Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-slate-300 font-mono overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/10 bg-white/5 flex flex-col p-6">
        <div className="mb-10">
          <div className="text-blue-500 font-bold text-[10px] tracking-widest uppercase mb-1">Status: Active</div>
          <div className="text-white font-black text-lg tracking-tighter uppercase">Asset_Tracker</div>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full text-left p-3 text-[11px] font-bold uppercase transition-all border-l-2 ${activeTab === 'dashboard' ? 'bg-white/5 border-blue-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            01_Ingest_&_Scan
          </button>
          <button 
            onClick={() => setActiveTab('reports')} 
            className={`w-full text-left p-3 text-[11px] font-bold uppercase transition-all border-l-2 ${activeTab === 'reports' ? 'bg-white/5 border-blue-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            02_Report_History
          </button>
          <button 
            onClick={() => setActiveTab('account')} 
            className={`w-full text-left p-3 text-[11px] font-bold uppercase transition-all border-l-2 ${activeTab === 'account' ? 'bg-white/5 border-blue-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            03_User_Settings
          </button>
        </nav>

        <button onClick={() => signOut(auth)} className="text-left text-[10px] text-red-500 hover:text-red-400 font-bold uppercase py-4 border-t border-white/5">
          Terminate_Session
        </button>
      </aside>

      {/* VIEWPORT */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 max-w-7xl">
            <div className="xl:col-span-4"><UploadZone user={user} /></div>
            <div className="xl:col-span-8"><ReportDashboard user={user} /></div>
          </div>
        )}
        
        {activeTab === 'reports' && (
          <div className="max-w-4xl">
            <ReportDashboard user={user} />
          </div>
        )}

        {activeTab === 'account' && <AccountView user={user} />}
      </main>
    </div>
  );
}

export default App;