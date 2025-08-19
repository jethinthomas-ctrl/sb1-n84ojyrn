import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

// 🔹 Type for Profile row from Supabase
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  roles?: any;
  baseLocation?: string;
  mobileNumber?: string;
  userRole: "Admin" | "Member";
  created_at?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    userData: Omit<UserProfile, "id" | "created_at" | "userRole"> & { password: string }
  ) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    currentUser: null,
  });

  // 🔄 Fetch user + profile
  const getSession = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile && !error) {
        setAuthState({
          isAuthenticated: true,
          currentUser: profile as UserProfile,
        });
      }
    } else {
      setAuthState({
        isAuthenticated: false,
        currentUser: null,
      });
    }
  };

  // 🟢 Run on mount + subscribe to auth state
  useEffect(() => {
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getSession();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔑 Login
  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return false;

    await getSession();
    return true;
  };

  // 🆕 Register
  const register = async (
    userData: Omit<UserProfile, "id" | "created_at" | "userRole"> & { password: string }
  ): Promise<boolean> => {
    const { email, password, name, roles, baseLocation, mobileNumber } = userData;

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) return false;

    // create profile row
    const { error: insertError } = await supabase.from("profiles").insert([
      {
        id: data.user.id,
        email,
        name,
        roles,
        baseLocation,
        mobileNumber,
        userRole: "Member", // default role
      },
    ]);

    if (insertError) return false;

    await getSession();
    return true;
  };

  // 🚪 Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setAuthState({
      isAuthenticated: false,
      currentUser: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
