import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  User, 
  Briefcase, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Code,
  ShieldCheck,
  Info
} from 'lucide-react';
import { api } from '../services/api';

export default function AuthPage({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [googleNotice, setGoogleNotice] = useState('');

  // Environment variable for Google OAuth
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
    rollNumber: '',
    department: 'CSE',
    batchYear: 2026,
    cgpa: '',
    activeBacklogs: 0,
    skills: '',
    resumeHeadline: ''
  });

  // Initialize Google Identity Services if client ID is configured
  useEffect(() => {
    if (!googleClientId) return;

    const loadGoogleScript = () => {
      if (document.getElementById('google-jssdk')) return;
      const script = document.createElement('script');
      script.id = 'google-jssdk';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse
          });
        }
      };
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, [googleClientId]);

  const handleGoogleCredentialResponse = async (response) => {
    if (!response || !response.credential) return;
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await api.googleLogin({
        idToken: response.credential,
        course: regData.department || 'CSE',
        batchYear: regData.batchYear || 2026
      });
      onLoginSuccess(res);
    } catch (err) {
      setErrorMessage(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignInClick = async () => {
    setErrorMessage('');
    setGoogleNotice('');

    // If client ID is configured and GIS is available
    if (googleClientId && window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback popup if one-tap is suppressed
          setGoogleNotice('Google One-Tap was skipped. Please check popup permissions.');
        }
      });
      return;
    }

    // If Google Client ID is not configured yet in .env, display clear notice and allow dev verification
    if (!googleClientId) {
      setGoogleNotice('VITE_GOOGLE_CLIENT_ID is not configured in .env. Click "Verify with Dev Google Token" below to test backend token validation.');
      return;
    }

    setErrorMessage('Google Sign-In SDK is initializing. Please try again in a moment.');
  };

  const handleDevGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await api.googleLogin({
        idToken: 'dev-google-token-' + Date.now(),
        course: regData.department || 'CSE',
        batchYear: regData.batchYear || 2026
      });
      onLoginSuccess(res);
    } catch (err) {
      setErrorMessage(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await api.login(loginEmail, loginPassword);
      onLoginSuccess(res);
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const payload = {
        ...regData,
        cgpa: regData.cgpa ? parseFloat(regData.cgpa) : 0.0,
        activeBacklogs: parseInt(regData.activeBacklogs || 0, 10),
        batchYear: parseInt(regData.batchYear || 2026, 10)
      };
      const res = await api.register(payload);
      alert('Account registered successfully! Welcome to PlacementIQ.');
      onLoginSuccess(res);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/30 mb-4">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-white">
          Placement<span className="text-indigo-400">IQ</span>
        </h2>
        <p className="mt-1 text-xs text-slate-400 font-medium">
          Smart Placement & Recruitment Management System &bull; Fullstack Java
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Tabs */}
          <div className="flex rounded-2xl bg-slate-100 p-1.5 mb-6 border border-slate-200">
            <button
              onClick={() => {
                setIsRegister(false);
                setErrorMessage('');
                setGoogleNotice('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                !isRegister
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In With Your Details
            </button>
            <button
              onClick={() => {
                setIsRegister(true);
                setErrorMessage('');
                setGoogleNotice('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                isRegister
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create New Account
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google Notice Banner (When Client ID is pending in .env) */}
          {googleNotice && (
            <div className="mb-5 p-3.5 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl text-xs font-medium space-y-2">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span>{googleNotice}</span>
              </div>
              <button
                type="button"
                onClick={handleDevGoogleLogin}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                Verify with Dev Google Token (Redirect to Student Dashboard)
              </button>
            </div>
          )}

          {/* Google Sign-In Button */}
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGoogleSignInClick}
              disabled={loading}
              className="w-full py-3 px-4 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all flex items-center justify-center space-x-3 shadow-sm hover:shadow"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold">
                <span className="bg-white px-3 text-slate-400">Or continue with email</span>
              </div>
            </div>
          </div>

          {/* Sign In Form */}
          {!isRegister ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your registered email address"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center space-x-2 transition-all"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      placeholder="Choose a password"
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Portal Role
                  </label>
                  <select
                    value={regData.role}
                    onChange={(e) => setRegData({ ...regData, role: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="STUDENT">🎓 Student / Candidate</option>
                    <option value="TPO_ADMIN">🏛️ TPO Placement Officer (Faculty)</option>
                    <option value="RECRUITER">💼 Corporate Recruiter</option>
                  </select>
                </div>
              </div>

              {/* Student specific fields */}
              {regData.role === 'STUDENT' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Academic & Profile Information</span>
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Roll Number</label>
                      <input
                        type="text"
                        value={regData.rollNumber}
                        onChange={(e) => setRegData({ ...regData, rollNumber: e.target.value })}
                        placeholder="e.g. 2026CS101"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Course</label>
                      <select
                        value={regData.department}
                        onChange={(e) => setRegData({ ...regData, department: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-medium"
                      >
                        <option value="CSE">CSE</option>
                        <option value="AIML">AIML</option>
                        <option value="ECE">ECE</option>
                        <option value="EEE">EEE</option>
                        <option value="IT">IT</option>
                        <option value="MECH">MECH</option>
                        <option value="CIVIL">CIVIL</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Batch / Graduation Year</label>
                      <input
                        type="number"
                        value={regData.batchYear}
                        onChange={(e) => setRegData({ ...regData, batchYear: e.target.value })}
                        placeholder="e.g. 2026"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">CGPA (out of 10)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={regData.cgpa}
                        onChange={(e) => setRegData({ ...regData, cgpa: e.target.value })}
                        placeholder="e.g. 8.5"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Active Backlogs</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={regData.activeBacklogs}
                        onChange={(e) => setRegData({ ...regData, activeBacklogs: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Technical Skills (For ATS Matching)
                    </label>
                    <input
                      type="text"
                      value={regData.skills}
                      onChange={(e) => setRegData({ ...regData, skills: e.target.value })}
                      placeholder="e.g. Java, Python, React, SQL, Git"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center space-x-2 transition-all"
              >
                <span>{loading ? 'Creating Your Account...' : 'Register & Enter Portal'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
