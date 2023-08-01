"use client";
import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
  user: any | null;
  handleSignIn: (email: string, password: string) => void;
  handleSignOut: () => void;
  handleSignInWithGoogle: () => void;
}

interface User {
  email: string;
  displayName: string;
  uid: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tokenClient, setTokenClient] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const uid = firebaseUser.uid;
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as User;
          setUser(data);
        } else {
          console.error("User document not found");
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);


  const handleSignIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Login error", error.message);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login with Google error", error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error("Logout error", error.message);
    }
  };

  // const handleAuthClick = () => {
  //   tokenClient.callback = async (response: any) => {
  //     if (response.error !== undefined) {
  //       throw response;
  //     }
  //     setAccessToken(response.access_token);
  //     await createPicker();
  //   };
  //   if (accessToken === null) {
  //     tokenClient.requestAccessToken({ prompt: "consent" });
  //   } else {
  //     tokenClient.requestAccessToken({ prompt: "" });
  //   }
  // };

  return (
    <AuthContext.Provider
      value={{ user, handleSignIn, handleSignOut, handleSignInWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
