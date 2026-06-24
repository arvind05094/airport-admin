import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../lib/api";
import type { AuthResponse } from "../../types/auth";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post<AuthResponse>("/api/auth/login", data);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm border border-gray-200 rounded-lg p-8 shadow-sm">
        <h1 className="text-2xl font-semibold mb-1">Airport Admin</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="admin@airport.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Password</label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white rounded-md py-2 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 rounded-md bg-gray-50 border border-gray-200 px-4 py-3">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Demo credentials
          </p>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Email</span>
              <span className="font-mono text-gray-700">
                admin@airportadmin.com
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Password</span>
              <span className="font-mono text-gray-700">Admin123!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
