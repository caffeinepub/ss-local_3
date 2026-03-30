import { Input } from "@/components/ui/input";
import { useActor } from "@/hooks/useActor";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

type RegisterResult = { ok: null } | { err: string };

interface AuthActor {
  register(mobile: string, password: string): Promise<RegisterResult>;
}

interface SignUpPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function SignUpPage({ onBack, onSuccess }: SignUpPageProps) {
  const { actor } = useActor();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async () => {
    setError("");
    if (!mobile.trim() || !password.trim() || !confirm.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!/^[0-9]{10}$/.test(mobile.trim())) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!actor) {
      setError("Connecting to server, please wait...");
      return;
    }
    setLoading(true);
    try {
      const result = await (actor as unknown as AuthActor).register(
        mobile.trim(),
        password,
      );
      if ("ok" in result) {
        setSuccess(
          "Account created! Please wait for admin activation before logging in.",
        );
        setTimeout(() => onSuccess(), 2500);
      } else {
        setError(result.err);
      }
    } catch {
      setError("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.16 0.045 200) 0%, oklch(0.12 0.04 200) 100%)",
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 shadow-card ring-1 ring-border"
        style={{ backgroundColor: "oklch(0.22 0.035 200)" }}
      >
        <div className="flex justify-center mb-6">
          <img
            src="/assets/uploads/ss_local-019d3cf2-cb33-77b6-80dc-021c2b6b1286-1.png"
            alt="SS Local"
            className="h-16 w-auto object-contain"
          />
        </div>

        <h1 className="text-center text-xl font-bold text-foreground mb-6 tracking-tight">
          Create Account
        </h1>

        <div className="space-y-4">
          <Input
            data-ocid="signup.input"
            type="tel"
            placeholder="Mobile Number (10 digits)"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            maxLength={10}
            className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
          />

          <div className="relative">
            <Input
              data-ocid="signup.input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="relative">
            <Input
              data-ocid="signup.input"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirm ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {error && (
            <p
              data-ocid="signup.error_state"
              className="text-red-400 text-sm text-center"
            >
              {error}
            </p>
          )}
          {success && (
            <p
              data-ocid="signup.success_state"
              className="text-green-400 text-sm text-center"
            >
              {success}
            </p>
          )}

          <button
            type="button"
            data-ocid="signup.submit_button"
            onClick={handleSignUp}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-white transition-all"
            style={{ backgroundColor: loading ? "#b91c1c" : "#dc2626" }}
            onMouseEnter={(e) => {
              if (!loading)
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#b91c1c";
            }}
            onMouseLeave={(e) => {
              if (!loading)
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#dc2626";
            }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <button
            type="button"
            data-ocid="signup.link"
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
