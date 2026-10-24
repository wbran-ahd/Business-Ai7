import { useCallback, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signOut as fbSignOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Identity for صوتی بقیہ.
 *
 * Access is QR/activation-code only, so there is no sign-up form and no
 * provider choice: Firebase anonymous auth mints a stable uid on the device and
 * the activation flow (`/activate`) upgrades that uid with a license. Keeping
 * identity anonymous means the app needs no email address, no password and no
 * third-party consent screen at any point.
 *
 * `use-license` is what starts the anonymous session (it has to, because it
 * must know whether the device is already activated). This hook only observes
 * the resulting Firebase user, so it stays a passive mirror of auth state.
 */

export interface AppUser {
  uid: string;
  name?: string;
  isAnonymous?: boolean;
}

const GUEST_NAME = "مہمان صارف";

function mapUser(fbUser: FirebaseUser): AppUser {
  return {
    uid: fbUser.uid,
    name: fbUser.displayName || GUEST_NAME,
    isAnonymous: fbUser.isAnonymous,
  };
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const mappedUser = mapUser(fbUser);
      setUser(mappedUser);

      // One profile document per uid. Local-first: a failed profile write must
      // never block the UI, because the ledger already lives on the device.
      try {
        const userRef = doc(db, "users", fbUser.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            id: fbUser.uid,
            name: mappedUser.name,
            isAnonymous: fbUser.isAnonymous,
            createdAt: Date.now(),
          });
        }
      } catch {
        // Offline or restricted mode — the ledger keeps working locally.
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
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
    signOut,
  };
}
