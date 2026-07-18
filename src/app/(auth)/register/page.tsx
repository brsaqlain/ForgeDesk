"use client";

import { Eye, EyeOff, Mail, User } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleRegister = async () => {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await response.json();

if (response.ok) {
  alert("Registration successful!");
} else {
  alert(data.message);
}
};

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-100 via-cyan-200 to-sky-300 p-6">
      <div className="w-full max-w-md rounded-3xl border border-cyan-200 bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="mb-2 text-center text-4xl font-extrabold text-cyan-700">
          Create Account 🚀
        </h1>

        <p className="mb-8 text-center text-gray-600">
          Start Your Journey with ForgeDesk
        </p>

        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<User size={20} />}
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={20} />}
        />

        <Input
          label="Password"
          type={isPasswordVisible ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          onIconClick={() => setIsPasswordVisible(!isPasswordVisible)}
        />

        <Button
          text="Register"
          color="blue"
          fullWidth={true}
           onClick={handleRegister} 
        />

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-cyan-600 hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </main>
  );
}