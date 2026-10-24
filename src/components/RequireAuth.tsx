import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Route gate for the signed-in product.
 *
 * Access to صوتی بقیہ is QR/activation-code only, so this gate never sends
 * anyone to a sign-in form. It waits for Firebase's anonymous identity, and
 * when there is no identity yet it renders nothing: the activation screen
 * (`/activate`, built on top of this gate) is the only entry point.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!isAuthenticated) return null;

  return children;
}
