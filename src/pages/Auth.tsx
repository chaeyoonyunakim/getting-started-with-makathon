import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import SeoHead from "@/components/SeoHead";


const AuthPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast.success("Account created!", { description: "Check your inbox to confirm your email." });
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Reset link sent", { description: "Check your inbox for the password reset email." });
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/", { replace: true });
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  const title = mode === "forgot" ? "Reset password" : mode === "signin" ? "Sign in" : "Create account";

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (!result.redirected) {
        navigate("/", { replace: true });
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <SeoHead
        title="Sign in — AAC Choice Board for SEND classrooms"
        description="Teaching Assistants and SENCOs sign in to manage Makaton pupil profiles and start communication sessions."
        path="/auth"
      />
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-lg p-8 flex flex-col gap-6 border border-border">

        <header className="text-center">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-2">
            For Teaching Assistants and SENCOs
          </p>
        </header>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="auth-email" className="sr-only">Email</label>
          <input
            id="auth-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            aria-label="Email"
            autoComplete="email"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-4 focus:ring-ring/50"
          />
          {mode !== "forgot" && (
            <>
              <label htmlFor="auth-password" className="sr-only">Password</label>
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                aria-label="Password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-4 focus:ring-ring/50"
              />
            </>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground rounded-xl px-6 py-3 text-lg font-bold shadow-md transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-ring/50 disabled:opacity-50"
          >
            {submitting
              ? "Please wait…"
              : mode === "forgot"
                ? "Send reset link"
                : mode === "signin"
                  ? "Sign in"
                  : "Sign up"}
          </button>
        </form>

        {mode !== "forgot" && (
          <>
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-3 bg-background border border-border text-foreground rounded-xl px-6 py-3 font-medium shadow-sm transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-ring/50 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              {mode === "signin" ? "Sign in with Google" : "Sign up with Google"}
            </button>
          </>
        )}

        {mode === "signin" && (
          <button
            onClick={() => setMode("forgot")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors self-center"
          >
            Forgot password?
          </button>
        )}

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors self-center"
        >
          {mode === "signin"
            ? "No account? Create one"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
};

export default AuthPage;
