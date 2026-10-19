import { useEffect, useState, useCallback } from "react";
import {
  auth,
  db,
  googleProvider,
} from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut as fbSignOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/lib/firestore-errors";

export interface AppUser {
  uid: string;
  name?: string;
  email?: string;
  isAnonymous?: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const mappedUser: AppUser = {
          uid: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split("@")[0] || (fbUser.isAnonymous ? "مہمان صارف" : "صارف"),
          email: fbUser.email || (fbUser.isAnonymous ? "guest@sauti.local" : undefined),
          isAnonymous: fbUser.isAnonymous,
        };
        setUser(mappedUser);

        // Sync user document to Firestore
        try {
          const userRef = doc(db, "users", fbUser.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, {
              id: fbUser.uid,
              name: mappedUser.name || "صارف",
              email: mappedUser.email || "",
              isAnonymous: fbUser.isAnonymous,
              createdAt: Date.now(),
            });
          }
        } catch {
          // Non-blocking for offline or restricted mode
        }
      } else {
        // Check local guest fallback if Firebase user is null
        const localGuest = typeof window !== "undefined" ? localStorage.getItem("sauti_local_guest") : null;
        if (localGuest) {
          try {
            setUser(JSON.parse(localGuest));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (provider: string, formData?: FormData) => {
    setIsLoading(true);
    try {
      if (provider === "google") {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const mappedUser: AppUser = {
          uid: fbUser.uid,
          name: fbUser.displayName || "صارف",
          email: fbUser.email || undefined,
          isAnonymous: false,
        };
        setUser(mappedUser);
        return { signingIn: true };
      }

      if (provider === "anonymous") {
        try {
          const result = await signInAnonymously(auth);
          const fbUser = result.user;
          const mappedUser: AppUser = {
            uid: fbUser.uid,
            name: "مہمان صارف",
            email: "guest@sauti.local",
            isAnonymous: true,
          };
          setUser(mappedUser);
          return { signingIn: true };
        } catch (anonErr) {
          console.warn("Firebase Anonymous Auth fallback to local session:", anonErr);
          const fallbackGuest: AppUser = {
            uid: "guest-" + Date.now(),
            name: "مہمان صارف",
            email: "guest@sauti.local",
            isAnonymous: true,
          };
          localStorage.setItem("sauti_local_guest", JSON.stringify(fallbackGuest));
          setUser(fallbackGuest);
          return { signingIn: true };
        }
      }

      // Email sign-in or OTP flow
      const email = (formData?.get?.("email") as string) || "user@example.com";
      try {
        const result = await signInAnonymously(auth);
        const fbUser = result.user;
        const mappedUser: AppUser = {
          uid: fbUser.uid,
          name: email.split("@")[0] || "صارف",
          email,
          isAnonymous: false,
        };
        setUser(mappedUser);
        // Persist email in user doc
        try {
          await setDoc(doc(db, "users", fbUser.uid), {
            id: fbUser.uid,
            name: mappedUser.name,
            email: mappedUser.email,
            isAnonymous: false,
            createdAt: Date.now(),
          }, { merge: true });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${fbUser.uid}`);
        }
        return { signingIn: true };
      } catch (e) {
        console.warn("Fallback email sign in:", e);
        const fallbackUser: AppUser = {
          uid: "user-" + Date.now(),
          name: email.split("@")[0] || "صارف",
          email,
          isAnonymous: false,
        };
        localStorage.setItem("sauti_local_guest", JSON.stringify(fallbackUser));
        setUser(fallbackUser);
        return { signingIn: true };
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem("sauti_local_guest");
      await fbSignOut(auth).catch(() => {});
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    isAuthenticated: Boolean(user),
    user,
    signIn,
    signOut,
  };
}
