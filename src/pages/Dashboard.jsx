import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import HealthAssistant from "../components/HealthAssistant";
import {
  LogOut,
  User,
  FileText,
  MessageSquare,
  Home,
  Menu,
  HeartPulse,
  Thermometer,
  Gauge,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Top Navbar for Mobile */}
      <header className="flex justify-between items-center md:hidden bg-white px-6 py-4 border-b border-gray-100">
        <img src="/logo.svg" alt="CareBridge Logo" className="h-8" />
        <button
          onClick={() => setShowMobileNav(!showMobileNav)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={24} className="text-gray-600" />
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`${
          showMobileNav ? "flex" : "hidden"
        } md:flex flex-col w-full md:w-64 bg-white border-r border-gray-100 p-6 md:static fixed z-50 top-16 left-0 h-[calc(100vh-64px)] md:h-auto`}
      >
        <img
          src="/logo.svg"
          alt="CareBridge Logo"
          className="h-8 mb-10 hidden md:block"
        />
        <nav className="flex flex-col gap-2 font-medium flex-1">
          <button
            className="flex items-center gap-3 text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-blue-600 transition-colors"
            disabled
          >
            <Home size={20} className="opacity-70" />
            <span>Dashboard</span>
          </button>
          <button className="flex items-center gap-3 text-left px-4 py-3 rounded-xl bg-blue-50 text-blue-600">
            <MessageSquare size={20} className="opacity-70" />
            <span>Health Assistant</span>
          </button>
          <button
            onClick={() => navigate("/health-logger")}
            className="flex items-center gap-3 text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <FileText size={20} className="opacity-70" />
            <span>Health Logger</span>
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <User size={20} className="opacity-70" />
            <span>Profile</span>
          </button>

          <div className="mt-auto pt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-red-500 transition-colors w-full"
            >
              <LogOut size={20} className="opacity-70" />
              <span>Log Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl p-6 mb-8 shadow-lg flex items-center gap-5">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm">
            <User size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              Welcome, {user?.user_metadata?.name || "User"}
            </h1>
            <p className="text-sm text-blue-100">{user?.email}</p>
          </div>
        </div>

        {/* Health Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-red-50 text-red-500">
                <HeartPulse size={20} />
              </div>
              <p className="text-sm font-medium text-gray-500">Heart Rate</p>
            </div>
            <h3 className="text-2xl font-semibold mb-1">72 bpm</h3>
            <p className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full inline-block">
              Normal
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
                <Gauge size={20} />
              </div>
              <p className="text-sm font-medium text-gray-500">
                Blood Pressure
              </p>
            </div>
            <h3 className="text-2xl font-semibold mb-1">118 / 78 mmHg</h3>
            <p className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full inline-block">
              Normal
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-500">
                <Thermometer size={20} />
              </div>
              <p className="text-sm font-medium text-gray-500">Temperature</p>
            </div>
            <h3 className="text-2xl font-semibold mb-1">98.6°F</h3>
            <p className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full inline-block">
              Normal
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-500">
                <Activity size={20} />
              </div>
              <p className="text-sm font-medium text-gray-500">Activity</p>
            </div>
            <h3 className="text-2xl font-semibold mb-1">8,240 steps</h3>
            <p className="text-xs font-medium text-blue-500 bg-blue-50 px-2 py-1 rounded-full inline-block">
              Today
            </p>
          </div>
        </div>

        {/* Health Assistant Section */}
        <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Health Assistant
              </h2>
              <p className="text-sm text-gray-500">
                Ask health-related questions and get personalized guidance
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <MessageSquare size={20} className="text-blue-500" />
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl p-0 bg-gray-50">
            <HealthAssistant />
          </div>
        </section>
      </main>
    </div>
  );
}
