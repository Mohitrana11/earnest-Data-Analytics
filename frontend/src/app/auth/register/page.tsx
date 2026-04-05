"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  console.log(form);

  const handleSubmit = async () => {
    try {
      await api.post("/auth/register", form);
      toast.success("Registration successful");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-surface p-8 rounded-2xl w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold text-text mb-6 text-center">
          Create Account
        </h1>

        <div className="space-y-4">
          <Input label="Username" name="username" onChange={handleChange} />
          <Input label="Email" name="email" onChange={handleChange} />
          <Input
            label="Password"
            type="password"
            name="password"
            onChange={handleChange}
          />

          <Button onClick={handleSubmit}>Register</Button>
        </div>

        <p className="text-sm text-muted mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
