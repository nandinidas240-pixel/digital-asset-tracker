export default function AccountView({ user }) {
  return (
    <div className="max-w-2xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-bold text-white uppercase tracking-tighter">System_User_Profile</h2>
        <p className="text-xs text-slate-500 mt-1 uppercase">Active security credentials for session</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-white/10 p-4 bg-white/5">
          <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">Unique_ID</div>
          <div className="text-xs text-slate-200 font-mono truncate">{user.uid}</div>
        </div>
        <div className="border border-white/10 p-4 bg-white/5">
          <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">Access_Email</div>
          <div className="text-xs text-slate-200 font-mono">{user.email}</div>
        </div>
        <div className="border border-white/10 p-4 bg-white/5">
          <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">Auth_Provider</div>
          <div className="text-xs text-slate-200 font-mono">GOOGLE_OAUTH_2.0</div>
        </div>
        <div className="border border-white/10 p-4 bg-white/5">
          <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">Last_Verified</div>
          <div className="text-xs text-slate-200 font-mono">{new Date(user.metadata.lastSignInTime).toLocaleDateString()}</div>
        </div>
      </div>

      <div className="pt-8 border-t border-white/10">
        <h3 className="text-xs font-bold text-red-500 uppercase mb-4 tracking-widest">Danger_Zone</h3>
        <p className="text-[10px] text-slate-500 mb-4">Requesting full database purge will remove all scan reports associated with this UID.</p>
        <button className="px-6 py-2 border border-red-500/50 text-red-500 text-[10px] font-bold hover:bg-red-500/10 transition-all uppercase">
          Purge_Account_Data
        </button>
      </div>
    </div>
  );
}