import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const usersRaw = localStorage.getItem("users");
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const idx = users.findIndex((u: any) => u.email === email);
    if (idx === -1) {
      toast.error("No account found with that email.");
      setLoading(false);
      return;
    }
    // Generate OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);
    // Simulate sending OTP by showing in toast
    toast.info(`Your OTP is: ${generatedOtp}`);
    setStep(2);
    setLoading(false);
  };

  // Step 2: Verify OTP and reset password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (enteredOtp !== otp) {
      toast.error("Invalid OTP. Please check your email (toast) and try again.");
      setLoading(false);
      return;
    }
    const usersRaw = localStorage.getItem("users");
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const idx = users.findIndex((u: any) => u.email === email);
    if (idx === -1) {
      toast.error("No account found with that email.");
      setLoading(false);
      return;
    }
    users[idx].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));
    toast.success("Password reset successful. You can now log in.");
    setLoading(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="glass-card rounded-2xl p-8 shadow-lg backdrop-blur-md border border-primary/10 w-full max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-2">Forgot Password</h1>
        <p className="text-muted-foreground mb-6">
          {step === 1
            ? "Enter your registered email to receive an OTP. (OTP will be shown in a toast for demo)"
            : `Enter the OTP sent to your email and your new password.`}
        </p>
        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">OTP</label>
              <Input
                type="text"
                value={enteredOtp}
                onChange={e => setEnteredOtp(e.target.value)}
                required
                placeholder="Enter OTP"
                maxLength={6}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Enter new password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}
        <div className="text-center mt-4">
          <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 