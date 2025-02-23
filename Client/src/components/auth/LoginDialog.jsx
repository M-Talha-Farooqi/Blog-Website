import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const LoginDialog = ({ isOpen, onClose, onSwitchToSignup }) => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const [serverError, setServerError] = useState("");

  const onSubmit = async (formData) => {
    try {
      console.log("Attempting login with email:", formData.email);

      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const responseData = await response.json();
      console.log("Login response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Login failed");
      }

      localStorage.setItem("token", responseData.token);
      localStorage.setItem("user", JSON.stringify(responseData.user));
      login(responseData.user);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Login error details:", error);
      setServerError(
        error.message || "An error occurred during login. Please try again."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white shadow-lg p-6 transition-transform transform hover:scale-105">
          <Dialog.Title className="text-2xl font-bold text-gray-800 mb-4">
            Login
          </Dialog.Title>

          {serverError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-blue-300 focus:border-blue-300"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-blue-300 focus:border-blue-300"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Don't have an account? Sign up
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition duration-200"
              >
                Login
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default LoginDialog;
