import React, { useEffect, useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { checkSupabaseConnection } from "./lib/connectionCheck";
import Routes from "./Routes";

function App() {
  const [connectionStatus, setConnectionStatus] = useState({
    isChecking: true,
    isConnected: false,
    hasIssues: false
  });

  useEffect(() => {
    const checkConnection = async () => {
      console.log('🚀 Starting Job Matrimony App...');
      
      try {
        const results = await checkSupabaseConnection();
        
        setConnectionStatus({
          isChecking: false,
          isConnected: results.overall,
          hasIssues: !results.overall
        });

        if (results.overall) {
          console.log('🎉 App ready to use!');
        } else {
          console.warn('⚠️  App may have limited functionality due to connection issues');
        }
      } catch (error) {
        console.error('❌ Connection check failed:', error);
        setConnectionStatus({
          isChecking: false,
          isConnected: false,
          hasIssues: true
        });
      }
    };

    checkConnection();
  }, []);

  // Show loading screen during connection check
  if (connectionStatus.isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Starting Job Matrimony</h2>
          <p className="text-gray-500">Checking Supabase connection...</p>
          <div className="mt-4 text-sm text-gray-400">
            Check console for detailed connection status
          </div>
        </div>
      </div>
    );
  }

  // Show warning if there are connection issues
  if (connectionStatus.hasIssues) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-700 mb-4">Connection Issues Detected</h2>
          <p className="text-red-600 mb-6">
            There are issues with the Supabase connection. Please check the console for details.
          </p>
          <div className="bg-red-100 border border-red-300 rounded p-4 text-left text-sm">
            <strong>Common fixes:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Check .env file has correct Supabase credentials</li>
              <li>Verify database schema is applied</li>
              <li>Ensure RLS policies are configured</li>
              <li>Check internet connection</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
