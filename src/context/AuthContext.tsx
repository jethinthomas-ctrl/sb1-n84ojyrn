import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type AuthContextType = {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("❌ Error fetching session:", error.message);
      } else {
        console.log("✅ Current session:", data.session);
        setUser(data.session?.user ?? null);
      }
      setLoading(false);
    };
    checkSession();

    // Listen to auth changes
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("🔄 Auth state changed:", _event, session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log("📩 Attempting login with:", email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("❌ Login failed:", error.message);
    } else {
      console.log("✅ Login success:", data.user);
      setUser(data.user);
    }
  };

  const logout = async () => {
    console.log("🚪 Logging out...");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("❌ Logout error:", error.message);
    } else {
      console.log("✅ Logged out");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
