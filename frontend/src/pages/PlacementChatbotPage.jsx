import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  HelpCircle, 
  CheckCircle2, 
  Briefcase, 
  ShieldCheck, 
  GraduationCap,
  RefreshCw
} from 'lucide-react';

export default function PlacementChatbotPage({ student, drives, companies }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hello ${student?.user?.name || 'Student'}! I am your PlacementIQ AI Assistant. I can help answer questions regarding campus drive eligibility criteria, improving your ATS resume score, company CTCs, interview rounds, and preparation roadmaps. How can I assist you today?`,
      time: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  const quickPrompts = [
    "What are Google's eligibility criteria?",
    "How can I improve my ATS resume score?",
    "Which companies are open for AIML department?",
    "Can I apply if I have 1 active backlog?",
    "What is the highest package available on campus?"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const generateResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('google')) {
      const gDrive = drives?.find(d => d.company?.name?.toLowerCase().includes('google'));
      if (gDrive) {
        return `Google is offering the role of ${gDrive.jobTitle} with a package of ${gDrive.packageLpa} LPA. Criteria: Minimum ${gDrive.minCgpa} CGPA, 0 active backlogs, eligible departments: ${gDrive.eligibleDepartments}. Required skills: ${gDrive.requiredSkills}.`;
      }
      return "Google requires minimum 8.0 CGPA, 0 active backlogs, and strong proficiency in Data Structures, Algorithms, Java/C++, and System Design.";
    }

    if (q.includes('ats') || q.includes('resume') || q.includes('score')) {
      return "To increase your ATS (Applicant Tracking System) match score: 1. Update your Technical Skills in 'My Profile' to match the keywords listed by the company (e.g. Java, Spring Boot, React, SQL, Git). 2. Add fullstack projects and certifications. 3. Include GitHub and LinkedIn repository links.";
    }

    if (q.includes('aiml') || q.includes('ai') || q.includes('machine learning')) {
      const aimlDrives = drives?.filter(d => d.eligibleDepartments?.includes('AIML') || d.eligibleDepartments === 'ALL') || [];
      const names = aimlDrives.map(d => d.company?.name).join(', ') || 'Microsoft, Amazon, Oracle, Deloitte';
      return `Companies currently hiring from AIML include: ${names}. Highest package for AIML goes up to 32.0 LPA (Amazon AWS). Core skills desired: Python, PyTorch, FastApi, SQL, and Cloud Computing.`;
    }

    if (q.includes('backlog')) {
      const backlogDrives = drives?.filter(d => (d.maxBacklogsAllowed || 0) > 0) || [];
      const names = backlogDrives.map(d => `${d.company?.name} (${d.packageLpa} LPA)`).join(', ') || 'Deloitte, TCS Digital';
      return `If you have 1 active backlog, companies like Deloitte and TCS Digital permit candidates with up to 1 active backlog. Tier-1 companies (Google, Microsoft, Amazon) strictly mandate 0 active backlogs at the time of drive registration.`;
    }

    if (q.includes('highest package') || q.includes('highest ctc') || q.includes('top package')) {
      const maxDrive = drives && drives.length > 0 
        ? drives.reduce((prev, curr) => ((curr.packageLpa || 0) > (prev.packageLpa || 0) ? curr : prev), drives[0])
        : null;
      if (maxDrive) {
        return `The highest package currently active on campus is ${maxDrive.packageLpa} LPA offered by ${maxDrive.company?.name} for the ${maxDrive.jobTitle} role.`;
      }
      return "The highest package on campus is 32.0 LPA offered by Amazon AWS.";
    }

    if (q.includes('deloitte')) {
      return "Deloitte is hiring for Technology Analyst with a package of 9.5 LPA. Minimum CGPA required is 6.5, and up to 1 active backlog is allowed for all engineering departments (CSE, AIML, ECE, EEE, IT, MECH, CIVIL).";
    }

    if (q.includes('interview') || q.includes('rounds')) {
      return "Campus recruitment typically involves 4 stages: 1. Automated ATS Resume Screening & Shortlisting, 2. Online Assessment (OA) covering DSA & Aptitude, 3. Technical Interview (Problem solving, Live coding, CS fundamentals), 4. HR & Cultural Fit Interview followed by Offer Release.";
    }

    if (q.includes('preparation') || q.includes('study') || q.includes('how to prepare')) {
      return "Head to the 'Placement Preparation' tab in the navigation bar! It includes curated roadmaps for DSA patterns, Full-Stack Java & Spring Boot, DBMS/OS fundamentals, System Design, and behavioral STAR frameworks.";
    }

    return `Thank you for your question! For specific criteria regarding ${query}, please explore the 'Jobs' tab for real-time eligibility checks, or check 'Placement Preparation' for technical study guides. Feel free to ask about any company (Google, Microsoft, Amazon, Oracle, Deloitte, TCS) or how to optimize your ATS score!`;
  };

  const handleSend = (textToSend = inputMessage) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setTyping(true);

    setTimeout(() => {
      const botResponse = generateResponse(textToSend);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setTyping(false);
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white p-7 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white">PlacementIQ AI Assistant</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Online &bull; 24/7 Placement Support
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              Instant guidance on company criteria, eligibility verification, ATS resume keyword optimization, and interview stages.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          title="Reset conversation"
          className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-slate-300 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Quick Placement Questions</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-xs text-slate-700 hover:text-indigo-700 font-semibold transition-all text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex items-start space-x-3 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div 
                className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-sm ${
                  m.sender === 'user' ? 'bg-indigo-600' : 'bg-slate-900'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-indigo-400" />}
              </div>

              <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200/90 shadow-sm rounded-tl-none font-medium'
              }`}>
                <p>{m.text}</p>
                <span className={`block text-[10px] mt-2 font-medium ${
                  m.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'
                }`}>
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                <Bot className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-500 font-medium rounded-tl-none flex items-center space-x-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-150"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-300"></span>
                <span className="ml-2">Analyzing placement records...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-white border-t border-slate-200 flex items-center space-x-3"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about companies, packages, eligibility, or interview rounds..."
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 font-medium"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-2xl shadow-md shadow-indigo-200 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
