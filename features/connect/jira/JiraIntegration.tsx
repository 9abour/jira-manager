import React, { useState } from 'react';
import {
  User,
  Key,
  Globe,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { JiraUser } from 'core/types/jira.types';
import { useNavigate } from 'react-router';
import { useLang } from '@hooks/useLang';
import { useCookies } from 'react-cookie';
import { motion, AnimatePresence } from 'framer-motion';

const JiraIntegration = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    apiToken: '',
    domain: '',
  });

  const [userInfo, setUserInfo] = useState<JiraUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies([
    'jiraCredentials',
    'jiraUserInfo',
  ]);

  const navigator = useNavigate();
  const { lang } = useLang();

  const saveCredentials = (creds: typeof credentials) => {
    setCookie('jiraCredentials', JSON.stringify(creds), {
      path: '/',
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  };

  const saveUserInfo = (userInfo: JiraUser) => {
    setCookie('jiraUserInfo', JSON.stringify(userInfo), {
      path: '/',
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const createAuthHeader = (email: string, apiToken: string) => {
    const auth = btoa(`${email}:${apiToken}`);
    return `Basic ${auth}`;
  };

  const connectToJira = async (creds = credentials) => {
    setLoading(true);
    setError('');

    try {
      const { email, apiToken, domain } = creds;

      if (!email || !apiToken || !domain) {
        throw new Error('All fields are required');
      }

      const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
      const url = `${baseUrl}/rest/api/3/myself`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: createAuthHeader(email, apiToken),
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            'Invalid credentials. Please check your email and API token.'
          );
        } else if (response.status === 403) {
          throw new Error('Access forbidden. Check your permissions.');
        } else {
          throw new Error(
            `Connection failed: ${response.status} ${response.statusText}`
          );
        }
      }

      const userData = await response.json();
      setUserInfo(userData);
      setConnected(true);
      saveCredentials(creds);
      saveUserInfo(userData);

      navigator(`/${lang}`);
    } catch (err: any) {
      setError(err.message);
      setConnected(false);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    connectToJira();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative w-full h-full sm:h-auto sm:max-w-xl mx-auto p-6 border border-[#636265] sm:rounded-lg shadow-lg z-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
      }}
    >
      {/* Animated Gradient Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(120deg, rgba(254,161,8,0.15) 0%, rgba(44,220,70,0.10) 50%, rgba(170,142,103,0.12) 100%)',
          zIndex: 1,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />
      <div className="relative z-10 mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-[#fea108] via-[#2cdc46] to-[#aa8e67] bg-clip-text text-transparent animate-gradient-x">
          Jira Integration
        </h2>
        <p className="text-white/80">
          Connect to your Jira instance using your credentials
        </p>
      </div>

      {/* Connection Status */}
      <motion.div
        className={`mb-6 p-4 rounded-lg border ${
          connected
            ? 'bg-[#2cdc46]/20 border-[#2cdc46]'
            : 'bg-[#aa8e67]/20 border-[#aa8e67]'
        }`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div className="flex items-center">
          <AnimatePresence mode="wait">
            {connected ? (
              <motion.span
                key="connected"
                initial={{ scale: 0, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 30, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="mr-2"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
              </motion.span>
            ) : (
              <motion.span
                key="not-connected"
                initial={{ scale: 0, rotate: 30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: -30, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="mr-2"
              >
                <AlertCircle className="w-5 h-5 text-gray-400" />
              </motion.span>
            )}
          </AnimatePresence>
          <span
            className={`font-medium ${
              connected ? 'text-[#2cdc46]' : 'text-white'
            }`}
          >
            {connected ? 'Connected to Jira' : 'Not Connected'}
          </span>
        </div>
        {userInfo && (
          <motion.div
            className="mt-2 text-sm text-white/80"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Logged in as: {userInfo.displayName} ({userInfo.emailAddress})
          </motion.div>
        )}
      </motion.div>

      {/* Credentials Form */}
      <div className="space-y-4 mb-6 relative z-10">
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-white mb-2">
            <User className="w-4 h-4 inline mr-1 animate-bounce-slow" />
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black/30 text-white placeholder:text-gray-400"
            placeholder="your-email@company.com"
            required
          />
        </motion.div>

        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-white mb-2">
            <Key className="w-4 h-4 inline mr-1 animate-spin-slow" />
            API Token
          </label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              name="apiToken"
              value={credentials.apiToken}
              onChange={handleInputChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black/30 text-white placeholder:text-gray-400"
              placeholder="Your Jira API Token"
              required
            />
            <motion.button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.15 }}
            >
              {showToken ? (
                <EyeOff className="w-5 h-5 animate-fade-in" />
              ) : (
                <Eye className="w-5 h-5 animate-fade-in" />
              )}
            </motion.button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Generate at: Account Settings → Security → API Tokens
          </p>
        </motion.div>

        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-white mb-2">
            <Globe className="w-4 h-4 inline mr-1 animate-pulse-slow" />
            Jira Domain
          </label>
          <input
            type="text"
            name="domain"
            value={credentials.domain}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black/30 text-white placeholder:text-gray-400"
            placeholder="your-domain.atlassian.net"
            required
          />
        </motion.div>

        {error && (
          <motion.div
            className="p-3 bg-[#fc473d]/20 border border-[#fc473d] rounded-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-red-600 text-sm animate-shake">{error}</p>
          </motion.div>
        )}

        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={handleConnect}
            disabled={loading || connected}
            className="flex-1 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-200 border border-white/20 text-white font-semibold px-4 py-2 rounded-md hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 4px 24px 0 rgba(44,220,70,0.15)',
            }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? 'Connecting...' : connected ? 'Connected' : 'Connect'}
          </motion.button>
        </motion.div>
      </div>

      {/* Setup Instructions */}
      <motion.div
        className="mt-8 p-4 bg-[#fea108]/20 border border-[#fea108] rounded-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="font-medium text-white mb-2">Setup Instructions:</h4>
        <ol className="text-sm text-white/70 space-y-1">
          <li>1. Go to your Jira Account Settings</li>
          <li>2. Navigate to Security → API Tokens</li>
          <li>3. Create a new API Token</li>
          <li>4. Enter your email, token, and Jira domain above</li>
        </ol>
      </motion.div>
      {/* Custom Animations CSS */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce 2.5s infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.7s;
        }
        .animate-shake {
          animation: shake 0.4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
      `}</style>
    </motion.div>
  );
};

export default JiraIntegration;
