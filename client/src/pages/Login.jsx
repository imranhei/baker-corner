import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, login } from "@/redux/auth-slice";
import { toast } from "sonner";

const initialState = {
  username: "",
  password: "",
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    dispatch(login(formData))
      .unwrap()
      .then((res) => {
        navigate("/dashboard");
        toast.success("Login successful!");
      })
      .catch((err) => {
        console.error("Login error:", err);
        setError(err || "Login failed. Please try again.");
        toast.error(err || "Login failed. Please check your credentials.");
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return setIsCheckingAuth(false);
    }

    dispatch(checkAuth()).then((res) => {
      if (res.payload?.success) {
        navigate("/dashboard", { replace: true });
      } else {
        setIsCheckingAuth(false);
      }
    });
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 relative">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card className="w-full max-w-md mx-auto rounded-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Inventory Management
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
              {error && (
                <div className="text-sm text-red-600 text-center">{error}</div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
