import React, { useState, useEffect } from 'react';
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

  // Load saved credentials from memory on component mount
  useEffect(() => {
    const savedCreds: any = getSavedCredentials();

    if (savedCreds) {
      setCredentials(savedCreds);
      if (savedCreds.email && savedCreds.apiToken && savedCreds.domain) {
        testConnection(savedCreds);
      }
    }
  }, []);

  const getSavedCredentials = () => {
    // In a real app, you might load from secure storage
    // For this demo, we'll use component state
    return null;
  };

  const saveCredentials = (creds: typeof credentials) => {
    // In a real app, you'd save to secure storage
    console.log('Credentials saved:', { ...creds, apiToken: '***hidden***' });
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

  const testConnection = async (creds = credentials) => {
    setLoading(true);
    setError('');

    try {
      const { email, apiToken, domain } = creds;

      if (!email || !apiToken || !domain) {
        throw new Error('All fields are required');
      }

      const baseUrl = domain;
      const url = `${baseUrl}/rest/api/3/myself`;

      const response = await fetch(
        `https://wecodeforyou.atlassian.net/rest/api/3/myself`,
        {
          method: 'GET',
          headers: {
            Authorization: `Basic ${Buffer.from(
              'm.abdelsabour.intern@wecodeforyou.io:ATATT3xFfGF0-A2w31818bbrAQxAcTnfaKnjrOPCKsyOlLnxfsoTlWR2p9TUFS87HEN4wAy7qhRw73bgx-zUGOcUnBkaV6ABT7KRcDSmQADLLBzfwzo4qlwrAMCRhTkfmbm0iMAfLux8mUHO4r_S6w91ahovTHiFFtA2gHMTjqM0mGkLItdROUg=287FB2E0',
              'utf-8'
            ).toString('base64')}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

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
    } catch (err: any) {
      setError(err.message);
      setConnected(false);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    testConnection();
  };

  const handleDisconnect = () => {
    setCredentials({ email: '', apiToken: '', domain: '' });
    setUserInfo(null);
    setConnected(false);
    setError('');
  };

  const fetchJiraData = async (endpoint: string) => {
    if (!connected) {
      setError('Please connect to Jira first');
      return;
    }

    try {
      const baseUrl = credentials.domain.startsWith('http')
        ? credentials.domain
        : `https://${credentials.domain}`;
      const url = `${baseUrl}/rest/api/3/${endpoint}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: createAuthHeader(
            credentials.email,
            credentials.apiToken
          ),
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`${endpoint} data:`, data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  return (
    <div className="relative max-w-xl mx-auto p-6 bg-[#1e1e1e] border border-[#636265] rounded-lg shadow-lg z-20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Jira Integration</h2>
        <p className="text-white/80">
          Connect to your Jira instance using your credentials
        </p>
      </div>

      {/* Connection Status */}
      <div
        className={`mb-6 p-4 rounded-lg border ${
          connected
            ? 'bg-[#2cdc46]/20 border-[#2cdc46]'
            : 'bg-[#aa8e67]/20 border-[#aa8e67]'
        }`}
      >
        <div className="flex items-center">
          {connected ? (
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 text-gray-400 mr-2" />
          )}
          <span
            className={`font-medium ${
              connected ? 'text-[#2cdc46]' : 'text-white'
            }`}
          >
            {connected ? 'Connected to Jira' : 'Not Connected'}
          </span>
        </div>
        {userInfo && (
          <div className="mt-2 text-sm text-gray-600">
            Logged in as: {userInfo.displayName} ({userInfo.emailAddress})
          </div>
        )}
      </div>

      {/* Credentials Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your-email@company.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Key className="w-4 h-4 inline mr-1" />
            API Token
          </label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              name="apiToken"
              value={credentials.apiToken}
              onChange={handleInputChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Jira API Token"
              required
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showToken ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Generate at: Account Settings → Security → API Tokens
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Globe className="w-4 h-4 inline mr-1" />
            Jira Domain
          </label>
          <input
            type="text"
            name="domain"
            value={credentials.domain}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your-domain.atlassian.net"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-[#fc473d]/20 border border-[#fc473d] rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleConnect}
            disabled={loading}
            className="flex-1 bg-[#3f3f3f] border border-white/20 text-white font-semibold px-4 py-2 rounded-md hover:bg-[#3f3f3f]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Connecting...' : connected ? 'Reconnect' : 'Connect'}
          </button>

          {connected && (
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 border border-gray-300 text-white rounded-md hover:bg-gray-50"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>

      {/* API Examples */}
      {connected && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">API Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => fetchJiraData('project')}
              className="p-3 text-left border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <div className="font-medium">Get Projects</div>
              <div className="text-sm text-gray-600">Fetch all projects</div>
            </button>

            <button
              onClick={() =>
                fetchJiraData('issue/search?jql=assignee=currentUser()')
              }
              className="p-3 text-left border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <div className="font-medium">My Issues</div>
              <div className="text-sm text-gray-600">Get assigned issues</div>
            </button>

            <button
              onClick={() => fetchJiraData('myself')}
              className="p-3 text-left border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <div className="font-medium">User Info</div>
              <div className="text-sm text-gray-600">Get current user</div>
            </button>

            <button
              onClick={() => fetchJiraData('serverInfo')}
              className="p-3 text-left border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <div className="font-medium">Server Info</div>
              <div className="text-sm text-gray-600">Get Jira details</div>
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Check browser console for API responses
          </p>
        </div>
      )}

      {/* Setup Instructions */}
      <div className="mt-8 p-4 bg-[#fea108]/20 border border-[#fea108] rounded-md">
        <h4 className="font-medium text-white mb-2">Setup Instructions:</h4>
        <ol className="text-sm text-white/70 space-y-1">
          <li>1. Go to your Jira Account Settings</li>
          <li>2. Navigate to Security → API Tokens</li>
          <li>3. Create a new API Token</li>
          <li>4. Enter your email, token, and Jira domain above</li>
        </ol>
      </div>
    </div>
  );
};

export default JiraIntegration;
