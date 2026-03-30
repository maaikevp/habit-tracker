import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../../lib/supabase/client";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  profileImage?: string;
  onboardingCompleted?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoadingUser: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const buildAuthUser = (authUser: SupabaseUser): User => {
  const email = authUser.email || "";
  const usernameFromEmail = email.includes("@") ? email.split("@")[0] : "user";

  return {
    id: authUser.id,
    email,
    name: authUser.user_metadata?.name || "",
    username: authUser.user_metadata?.username || usernameFromEmail,
    profileImage: authUser.user_metadata?.avatar_url,
    onboardingCompleted: authUser.user_metadata?.onboarding_completed ?? true,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const checkSession = async () => {
    setIsLoadingUser(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const authUser = await fetchAuthUser();
        setUser(authUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking session:", error);
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const fetchAuthUser = async (): Promise<User | null> => {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !authData.user) {
        console.error("No auth user found");
        return null;
      }

      return buildAuthUser(authData.user);
    } catch (error) {
      console.error("Error in fetchAuthUser:", error);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const authUser = await fetchAuthUser();
      setUser(authUser);
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const authUser = await fetchAuthUser();
      setUser(authUser);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      const metadata: Record<string, unknown> = {};
      if (userData.name !== undefined) metadata.name = userData.name;
      if (userData.username !== undefined)
        metadata.username = userData.username;
      if (userData.profileImage !== undefined)
        metadata.avatar_url = userData.profileImage;
      if (userData.onboardingCompleted !== undefined)
        metadata.onboarding_completed = userData.onboardingCompleted;

      const { error } = await supabase.auth.updateUser({ data: metadata });
      if (error) throw error;

      const authUser = await fetchAuthUser();
      setUser(authUser);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };
  return (
    <AuthContext.Provider
      value={{ user, signUp, updateUser, signIn, signOut, isLoadingUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("must be inside the provider");
  }
  return context;
};
