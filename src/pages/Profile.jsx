import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  FileText,
  MessageSquare,
  Home,
  Menu,
  ChevronRight,
  Settings,
  Mail,
  Loader2,
} from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [showMobileNav, setShowMobileNav] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        setFullName(user.user_metadata?.fullName || "");
      } else {
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    try {
      const updates = {
        fullName,
      };

      const { error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;

      setMsg({ text: "Profile updated successfully!", type: "success" });
    } catch (error) {
      setMsg({
        text: "Failed to update profile: " + error.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

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

      {/* Sidebar - Consistent with Dashboard */}
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
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Home size={20} className="opacity-70" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => navigate("/health-assistant")}
            className="flex items-center gap-3 text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-blue-600 transition-colors"
          >
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
          <button className="flex items-center gap-3 text-left px-4 py-3 rounded-xl bg-blue-50 text-blue-600">
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
        <div className="max-w-3xl mx-auto">
          {/* Profile Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Profile Settings
              </h1>
              <p className="text-gray-500">Manage your account information</p>
            </div>
          </div>

          {/* Message Alert */}
          {msg.text && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                msg.type === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {msg.text}
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Personal Info Section */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Personal Information
              </h2>

              <form onSubmit={handleUpdate} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={fullName.split(" ")[0] || ""}
                      onChange={(e) => {
                        const lastName = fullName.split(" ")[1] || "";
                        setFullName(`${e.target.value} ${lastName}`.trim());
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="First name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={fullName.split(" ")[1] || ""}
                      onChange={(e) => {
                        const firstName = fullName.split(" ")[0] || "";
                        setFullName(`${firstName} ${e.target.value}`.trim());
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-2.5 text-gray-400">
                      <Mail size={18} />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Account Settings Section */}
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Settings size={20} className="text-blue-600" />
                Account Settings
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Change Password
                    </h3>
                    <p className="text-sm text-gray-500">
                      Update your account password
                    </p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 p-1">
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Notification Preferences
                    </h3>
                    <p className="text-sm text-gray-500">
                      Manage email notifications
                    </p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 p-1">
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Delete Account
                    </h3>
                    <p className="text-sm text-gray-500">
                      Permanently remove your account
                    </p>
                  </div>
                  <button className="text-red-600 hover:text-red-700 p-1">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
