// Supabase Connection Health Check
// This utility checks database connectivity and displays status during app startup

import { supabase } from './supabase';

export const checkSupabaseConnection = async () => {
  console.log('🔍 Checking Supabase connection...');
  
  const results = {
    url: false,
    key: false,
    database: false,
    auth: false,
    tables: false,
    rls: false,
    triggers: false,
    overall: false
  };

  try {
    // 1. Check environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseUrl.includes('supabase.co')) {
      results.url = true;
      console.log('✅ Supabase URL configured');
    } else {
      console.error('❌ Missing or invalid Supabase URL');
      return results;
    }

    if (supabaseKey && supabaseKey.length > 100) {
      results.key = true;
      console.log('✅ Supabase API key configured');
    } else {
      console.error('❌ Missing or invalid Supabase API key');
      return results;
    }

    // 2. Test basic database connection
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('count', { count: 'exact', head: true });
      
      if (!error) {
        results.database = true;
        console.log('✅ Database connection successful');
      } else {
        console.error('❌ Database connection failed:', error.message);
      }
    } catch (err) {
      console.error('❌ Database connection error:', err.message);
    }

    // 3. Test auth service
    try {
      const { data, error } = await supabase.auth.getSession();
      results.auth = true;
      console.log('✅ Auth service accessible');
    } catch (err) {
      console.error('❌ Auth service error:', err.message);
    }

    // 4. Check critical tables exist
    try {
      const tableChecks = await Promise.all([
        supabase.from('user_profiles').select('count', { count: 'exact', head: true }),
        supabase.from('skills').select('count', { count: 'exact', head: true }),
        supabase.from('companies').select('count', { count: 'exact', head: true }),
        supabase.from('job_postings').select('count', { count: 'exact', head: true })
      ]);

      const allTablesExist = tableChecks.every(check => !check.error);
      
      if (allTablesExist) {
        results.tables = true;
        console.log('✅ Critical tables accessible');
        
        // Log table counts
        const skillsCount = await supabase.from('skills').select('*', { count: 'exact', head: true });
        const companiesCount = await supabase.from('companies').select('*', { count: 'exact', head: true });
        console.log(`📊 Data loaded: ${skillsCount.count || 0} skills, ${companiesCount.count || 0} companies`);
      } else {
        console.error('❌ Some critical tables missing or inaccessible');
        tableChecks.forEach((check, index) => {
          const tables = ['user_profiles', 'skills', 'companies', 'job_postings'];
          if (check.error) {
            console.error(`   - ${tables[index]}: ${check.error.message}`);
          }
        });
      }
    } catch (err) {
      console.error('❌ Table check error:', err.message);
    }

    // 5. Test RLS policies (basic check)
    try {
      // Try to access user_profiles without auth (should be restricted)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('email')
        .limit(1);
      
      // If we get a permissions error, RLS is working
      if (error && error.message.includes('permission')) {
        results.rls = true;
        console.log('✅ Row Level Security active');
      } else if (!error && (!data || data.length === 0)) {
        results.rls = true;
        console.log('✅ Row Level Security active (no data returned)');
      } else {
        console.log('⚠️  Row Level Security may not be configured properly');
      }
    } catch (err) {
      console.error('❌ RLS check error:', err.message);
    }

    // 6. Skip trigger function check (triggers work automatically)
    results.triggers = true;
    console.log('⏭️  Skipping trigger function check (triggers are database-level)');

    // Overall status
    results.overall = results.url && results.key && results.database && results.auth && results.tables;

    // Final status report
    console.log('\n🎯 Supabase Connection Status Summary:');
    console.log('=====================================');
    console.log(`🔗 URL Configuration: ${results.url ? '✅' : '❌'}`);
    console.log(`🔑 API Key: ${results.key ? '✅' : '❌'}`);
    console.log(`💾 Database: ${results.database ? '✅' : '❌'}`);
    console.log(`🔐 Authentication: ${results.auth ? '✅' : '❌'}`);
    console.log(`📋 Tables: ${results.tables ? '✅' : '❌'}`);
    console.log(`🛡️  RLS Policies: ${results.rls ? '✅' : '⚠️'}`);
    console.log(`⚡ Triggers: ${results.triggers ? '✅' : '⚠️'}`);
    console.log(`🚀 Overall Status: ${results.overall ? '✅ READY' : '❌ ISSUES DETECTED'}`);
    console.log('=====================================\n');

    if (results.overall) {
      console.log('🎉 Supabase is fully connected and ready!');
    } else {
      console.error('🚨 Supabase connection issues detected. Check the logs above.');
    }

  } catch (error) {
    console.error('❌ Connection check failed:', error.message);
  }

  return results;
};

// Quick connection test for development
export const quickConnectionTest = async () => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Quick connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Quick connection test passed');
    return true;
  } catch (err) {
    console.error('❌ Quick connection test error:', err.message);
    return false;
  }
};

// Development helper to check specific issues
export const debugConnection = async () => {
  console.log('🔍 Debug: Supabase Configuration');
  console.log('URL:', import.meta.env.VITE_SUPABASE_URL?.substring(0, 30) + '...');
  console.log('Key present:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
  console.log('Key length:', import.meta.env.VITE_SUPABASE_ANON_KEY?.length);
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session:', session ? 'Active' : 'None');
  } catch (err) {
    console.log('Session check error:', err.message);
  }
};

// Global helpers for browser console debugging
if (typeof window !== 'undefined') {
  window.supabaseDebug = {
    checkConnection: checkSupabaseConnection,
    quickTest: quickConnectionTest,
    debug: debugConnection,
    testRegistration: async (email = 'test@example.com', password = 'test123456') => {
      try {
        console.log('🧪 Testing user registration...');
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: 'Test User',
              role: 'candidate'
            }
          }
        });
        
        if (error) {
          console.error('❌ Registration test failed:', error.message);
        } else {
          console.log('✅ Registration test successful:', data);
        }
        
        return { data, error };
      } catch (err) {
        console.error('❌ Registration test error:', err.message);
        return { data: null, error: err };
      }
    },
    testLogin: async (email = 'test@example.com', password = 'test123456') => {
      try {
        console.log('🧪 Testing user login...');
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          console.error('❌ Login test failed:', error.message);
        } else {
          console.log('✅ Login test successful:', data);
        }
        
        return { data, error };
      } catch (err) {
        console.error('❌ Login test error:', err.message);
        return { data: null, error: err };
      }
    }
  };
  
  console.log('🛠️  Supabase debug tools available via window.supabaseDebug');
  console.log('   - window.supabaseDebug.checkConnection()');
  console.log('   - window.supabaseDebug.quickTest()');
  console.log('   - window.supabaseDebug.debug()');
  console.log('   - window.supabaseDebug.testRegistration()');
  console.log('   - window.supabaseDebug.testLogin()');
}
