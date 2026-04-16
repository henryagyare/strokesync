import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Activity, LogOut, Users, FileText } from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar - Inspired by your sidebar logic */}
      <aside className="w-64 bg-slate-800 text-white p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-10">
          <Activity className="text-blue-400" size={32} />
          <span className="text-2xl font-bold tracking-tight">StrokeSync</span>
        </div>
        
        <nav className="space-y-4">
          <Link to="/tech-dash" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition">
            <Activity size={20} /> Dashboard
          </Link>
          <Link to="/patients" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition">
            <Users size={20} /> Patient List
          </Link>
          <Link to="/reports" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition">
            <FileText size={20} /> Reports
          </Link>
        </nav>

        <button 
          onClick={() => navigate('/login')}
          className="mt-auto flex items-center gap-3 p-3 text-red-400 hover:text-red-300 transition"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <Outlet /> {/* This is where the specific page content renders */}
      </main>
    </div>
  );
};

export default Layout;