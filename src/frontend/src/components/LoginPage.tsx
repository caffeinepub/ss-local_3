import { Input } from "@/components/ui/input";
import { useActor } from "@/hooks/useActor";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Candid optional is [] | [T], not null
type LoginResult =
  | { ok: { role: string; mobile: string; validityDate: [] | [string] } }
  | { err: string };

interface AuthActor {
  login(username: string, password: string): Promise<LoginResult>;
}

interface LoginPageProps {
  onLoginSuccess: (user: {
    role: string;
    mobile: string;
    validityDate: string | null;
  }) => void;
  onSignUp: () => void;
}

export default function LoginPage({
  onLoginSuccess,
  onSignUp,
}: LoginPageProps) {
  const { actor } = useActor();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.");
      return;
    }
    if (!actor) {
      setError("Connecting to server, please wait...");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await (actor as unknown as AuthActor).login(
        username.trim(),
        password,
      );
      if ("ok" in result) {
        // Convert Candid optional ([] | [string]) to string | null
        const vd = result.ok.validityDate;
        const validityDate: string | null =
          vd.length > 0 ? (vd[0] as string) : null;
        onLoginSuccess({
          role: result.ok.role,
          mobile: result.ok.mobile,
          validityDate,
        });
      } else {
        setError(result.err);
      }
    } catch (e) {
      console.error("Login error:", e);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info("Please contact admin to reset your password");
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
          Sign In
        </h1>

        <div className="space-y-4">
          <Input
            data-ocid="login.input"
            type="text"
            placeholder="Username / Mobile Number"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
            autoComplete="username"
          />

          <div className="relative">
            <Input
              data-ocid="login.input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground pr-10"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {error && (
            <p
              data-ocid="login.error_state"
              className="text-red-400 text-sm text-center"
            >
              {error}
            </p>
          )}

          <button
            type="button"
            data-ocid="login.primary_button"
            onClick={handleLogin}
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
            {loading ? "Signing In..." : "Login"}
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              data-ocid="login.secondary_button"
              onClick={handleForgotPassword}
              className="flex-1 py-2 rounded-lg font-medium text-white text-sm transition-all"
              style={{ backgroundColor: "#dc2626" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#b91c1c";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#dc2626";
              }}
            >
              Forgot Password
            </button>
            <button
              type="button"
              data-ocid="login.open_modal_button"
              onClick={onSignUp}
              className="flex-1 py-2 rounded-lg font-medium text-white text-sm transition-all"
              style={{ backgroundColor: "#dc2626" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#b91c1c";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#dc2626";
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
