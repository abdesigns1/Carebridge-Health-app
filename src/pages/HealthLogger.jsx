import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import VitalsChart from "../components/VitalsChart";
import {
  Home,
  User,
  LogOut,
  Menu,
  X,
  Plus,
  ChevronDown,
  ChevronUp,
  Frown,
  Meh,
  Smile,
  Thermometer,
  HeartPulse,
  Clipboard,
  Activity,
} from "lucide-react";

export default function HealthLogger() {
  const [user, setUser] = useState(null);
  const [symptom, setSymptom] = useState("");
  const [temperature, setTemperature] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [notes, setNotes] = useState("");
  const [logs, setLogs] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [severity, setSeverity] = useState("mild");
  const [subscription, setSubscription] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndSetup = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        navigate("/login");
        return;
      }

      setUser(user);
      await fetchLogs(user.id);
      setupRealtimeUpdates(user.id);
    };

    fetchUserAndSetup();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [navigate]);

  const setupRealtimeUpdates = (userId) => {
    const channel = supabase
      .channel("health-logs-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "health_logs",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setLogs((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setLogs((prev) => prev.filter((log) => log.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    setSubscription(channel);
  };

  const fetchLogs = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("health_logs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setMsg("Failed to load logs. Please refresh the page.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptom.trim()) return setMsg("Please enter a symptom.");
    if (!user) return setMsg("You must be logged in to save logs.");

    setLoading(true);
    setMsg("");

    try {
      const { error } = await supabase.from("health_logs").insert([
        {
          user_id: user.id,
          symptom,
          temperature: temperature ? parseFloat(temperature) : null,
          heart_rate: heartRate ? parseInt(heartRate, 10) : null,
          notes: notes || null,
          severity,
        },
      ]);

      if (error) throw error;

      setSymptom("");
      setTemperature("");
      setHeartRate("");
      setNotes("");
      setSeverity("mild");
      setMsg("Health log saved successfully!");
    } catch (error) {
      console.error("Error saving log:", error);
      setMsg(`Failed to save log: ${error.message}`);

      if (error.message.includes("permission denied")) {
        setMsg((prev) => `${prev} (Check RLS policies in Supabase)`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const toggleLogExpand = (logId) => {
    setExpandedLogId(expandedLogId === logId ? null : logId);
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "mild":
        return <Smile className="text-green-500" size={16} />;
      case "moderate":
        return <Meh className="text-yellow-500" size={16} />;
      case "severe":
        return <Frown className="text-red-500" size={16} />;
      default:
        return <Smile className="text-green-500" size={16} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}

      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-6">
        <img
          src="/logo.svg"
          alt="CareBridge Logo"
          className="h-8 mb-10 hidden md:block"
        />
        <nav className="space-y-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-3 rounded-lg transition-all"
          >
            <Home size={18} /> Dashboard
          </button>
          <button
            onClick={() => navigate("/health-logger")}
            className="flex items-center gap-3 text-blue-600 bg-blue-50 font-medium p-3 rounded-lg"
          >
            <Activity size={18} /> Health Logger
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-3 rounded-lg transition-all"
          >
            <User size={18} /> Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-700 hover:text-red-600 hover:bg-red-50 p-3 rounded-lg transition-all mt-8"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden w-full sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <img src="/logo.svg" alt="CareBridge Logo" className="h-8" />
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2">
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => {
                navigate("/dashboard");
                setMenuOpen(false);
              }}
              className="text-left p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                navigate("/health-logger");
                setMenuOpen(false);
              }}
              className="text-left p-3 rounded-lg bg-blue-50 text-blue-600 font-medium"
            >
              Health Logger
            </button>
            <button
              onClick={() => {
                navigate("/profile");
                setMenuOpen(false);
              }}
              className="text-left p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              Profile
            </button>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="text-left p-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors mt-2"
            >
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Health Logger
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="md:hidden text-sm text-blue-600 hover:text-blue-800"
          >
            Back to Dashboard
          </button>
        </div>

        {msg && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              msg.includes("Failed")
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {msg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Log Entry Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Plus size={18} /> New Health Log
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Symptom *
                  </label>
                  <input
                    type="text"
                    value={symptom}
                    onChange={(e) => setSymptom(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Headache, fever, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["mild", "moderate", "severe"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSeverity(level)}
                        className={`flex items-center justify-center gap-2 p-2 rounded-lg border ${
                          severity === level
                            ? "border-blue-500 bg-blue-50 text-blue-600"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {getSeverityIcon(level)}
                        <span className="capitalize">{level}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Thermometer size={16} className="inline mr-1" />
                      Temp (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="36.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <HeartPulse size={16} className="inline mr-1" />
                      Heart Rate
                    </label>
                    <input
                      type="number"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="72"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clipboard size={16} className="inline mr-1" />
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                    rows={3}
                    placeholder="Additional details..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Log"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Logs Display */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Vitals Overview
              </h2>
              <div className="h-100">
                <VitalsChart logs={logs} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Health Logs
              </h2>

              {logs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No health logs yet. Add your first log above.
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
                    >
                      <div
                        className="p-4 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleLogExpand(log.id)}
                      >
                        <div className="flex items-center gap-3">
                          {getSeverityIcon(log.severity || "mild")}
                          <div>
                            <h3 className="font-medium text-gray-800 capitalize">
                              {log.symptom}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {formatDate(log.created_at)}
                            </p>
                          </div>
                        </div>
                        <div>
                          {expandedLogId === log.id ? (
                            <ChevronUp size={18} className="text-gray-500" />
                          ) : (
                            <ChevronDown size={18} className="text-gray-500" />
                          )}
                        </div>
                      </div>

                      {expandedLogId === log.id && (
                        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-xs text-blue-600 font-medium">
                                Temperature
                              </p>
                              <p className="text-lg font-semibold">
                                {log.temperature
                                  ? `${log.temperature}°C`
                                  : "N/A"}
                              </p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg">
                              <p className="text-xs text-purple-600 font-medium">
                                Heart Rate
                              </p>
                              <p className="text-lg font-semibold">
                                {log.heart_rate
                                  ? `${log.heart_rate} bpm`
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                          {log.notes && (
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-1">
                                Notes
                              </p>
                              <p className="text-sm text-gray-700">
                                {log.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
