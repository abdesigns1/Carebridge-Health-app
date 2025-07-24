import { useState, useEffect, useRef } from "react";
import { supabase } from "../services/supabaseClient";
import { marked } from "marked";
import {
  Send,
  Mic,
  MicOff,
  Loader2,
  Volume2,
  VolumeX,
  User,
  Bot,
  Sparkles,
  Heart,
  Activity,
  ChevronRight,
} from "lucide-react";

export default function HealthAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your health assistant. I'm here to help you with health questions and analyze your symptoms. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [useDemoResponses, setUseDemoResponses] = useState(false);
  const [suggestions] = useState([
    "What should I do if I have a headache?",
    "How can I improve my sleep quality?",
    "What are the symptoms of dehydration?",
    "When should I see a doctor for chest pain?",
  ]);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulated health logs
  useEffect(() => {
    const demoLogs = [
      {
        symptom: "mild headache",
        temperature: 37.2,
        heart_rate: 78,
        notes: "After long work session",
      },
      {
        symptom: "fatigue",
        temperature: 36.8,
        heart_rate: 82,
        notes: "Poor sleep last night",
      },
      {
        symptom: "sore throat",
        temperature: 37.5,
        heart_rate: 85,
        notes: "Dry throat in morning",
      },
    ];
    setLogs(demoLogs);
  }, []);

  // Demo responses for common health questions
  const getDemoResponse = (question) => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes("headache")) {
      return `For a headache, you can try these steps:
- Rest in a quiet, dark room
- Apply a cool compress to your forehead
- Stay hydrated by drinking water
- Consider over-the-counter pain relief like acetaminophen or ibuprofen (if you're not allergic)

If your headache is severe, persistent, or accompanied by vision changes, fever, or confusion, please seek medical attention immediately. Remember, this is general advice and not a substitute for professional medical care.`;
    } else if (
      lowerQuestion.includes("sleep") ||
      lowerQuestion.includes("insomnia")
    ) {
      return `To improve sleep quality:
1. Maintain a consistent sleep schedule
2. Create a relaxing bedtime routine
3. Keep your bedroom cool, dark, and quiet
4. Avoid screens 1 hour before bedtime
5. Limit caffeine after 2pm
6. Exercise regularly (but not too close to bedtime)

If sleep problems persist for more than 2 weeks, consider consulting a healthcare provider.`;
    } else if (lowerQuestion.includes("dehydration")) {
      return `Common symptoms of dehydration include:
- Thirst
- Dry mouth
- Fatigue
- Dark yellow urine
- Dizziness
- Confusion (in severe cases)

To prevent dehydration:
- Drink water throughout the day
- Increase fluids in hot weather or when exercising
- Watch for signs in children and elderly who may not feel thirsty

Severe dehydration requires immediate medical attention.`;
    } else if (lowerQuestion.includes("chest pain")) {
      return `Chest pain can have many causes, some serious. Seek immediate medical attention if:
- Pain is severe or crushing
- Radiates to arm, jaw, or back
- Accompanied by shortness of breath, sweating, or nausea
- Lasts more than a few minutes

Even if mild, persistent chest pain should be evaluated by a doctor to rule out serious conditions.`;
    } else if (lowerQuestion.includes("fever")) {
      return `For fever management:
- Adults: Consider medication if fever is above 38.5°C (101.3°F) and causing discomfort
- Children: Follow pediatric guidelines based on age
- Stay hydrated
- Rest
- Use light clothing and keep room comfortable

Seek medical care if:
- Fever is above 40°C (104°F)
- Lasts more than 3 days
- Accompanied by rash, stiff neck, or confusion`;
    } else {
      return `Thank you for your health question. While I can provide general information, please remember:
- This is not medical diagnosis
- For persistent or severe symptoms, consult a healthcare provider
- In emergencies, call emergency services immediately

Based on your question about "${question}", I recommend discussing this with your doctor for personalized advice. Your health is important!`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || loading) return;

    const newMessage = {
      role: "user",
      content: userInput,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setUserInput("");
    setLoading(true);

    if (useDemoResponses) {
      setTimeout(() => {
        const aiMessage = {
          role: "assistant",
          content: getDemoResponse(userInput),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setLoading(false);
      }, 1000);
      return;
    }

    // ... rest of my handleSubmit implementation ...
  };

  const startVoiceInput = () => {
    // ... my existing voice input implementation ...
  };

  const stopVoiceInput = () => {
    // ... my existing stop voice implementation ...
  };

  const handleSuggestionClick = (suggestion) => {
    setUserInput(suggestion);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Activity size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Health Assistant</h2>
            <p className="text-xs text-gray-500">AI-powered medical guidance</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={useDemoResponses}
            onChange={() => setUseDemoResponses(!useDemoResponses)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ml-2 text-sm font-medium text-gray-700">
            Demo mode
          </span>
        </label>
      </div>

      {/* Chat Area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        ref={chatContainerRef}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex max-w-[85%] md:max-w-[75%] ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  msg.role === "user"
                    ? "bg-blue-100 text-blue-600 ml-3"
                    : "bg-purple-100 text-purple-600 mr-3"
                }`}
              >
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div>
                <div
                  className={`p-3 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-100"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(msg.content),
                  }}
                />
                <div
                  className={`text-xs mt-1 ${
                    msg.role === "user"
                      ? "text-gray-500 text-right"
                      : "text-gray-400"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex max-w-[75%]">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 text-purple-600 mr-3 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Analyzing your question...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && messages.length === 1 && (
        <div className="px-4 pb-2">
          <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Quick questions you might ask:
            </h3>
            <div className="space-y-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="w-full flex items-center justify-between p-3 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                >
                  <span>{s}</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask a health question..."
            className="w-full pl-4 pr-12 py-3 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              className={`p-2 rounded-full ${
                isListening
                  ? "text-white bg-red-500"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              title={isListening ? "Stop voice input" : "Start voice input"}
            >
              {isListening ? (
                <MicOff size={18} className="shrink-0" />
              ) : (
                <Mic size={18} className="shrink-0" />
              )}
            </button>
            <button
              type="submit"
              disabled={loading || !userInput.trim()}
              className={`p-2 rounded-full ${
                userInput.trim()
                  ? "text-white bg-blue-600 hover:bg-blue-700"
                  : "text-gray-400 bg-gray-200"
              } transition-colors`}
            >
              <Send size={18} className="shrink-0" />
            </button>
          </div>
        </form>
        <p className="text-xs text-center text-gray-500 mt-3">
          This assistant provides general information and is not a substitute
          for professional medical advice.
        </p>
      </div>
    </div>
  );
}
