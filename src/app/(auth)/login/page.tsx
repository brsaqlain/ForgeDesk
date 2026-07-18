"use client";

import { Eye, EyeOff, Mail } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";



export default function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const router = useRouter();
const handleLogin = async () => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (response.ok) {
  router.push("/dashboard");
  } else {
    alert(data.message);
  }
};

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-100 via-cyan-200 to-sky-300 p-6">
      <div className="w-full max-w-md rounded-3xl border border-cyan-200 bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="mb-2 text-center text-4xl font-extrabold text-cyan-700">
          Welcome Back 👋
        </h1>

        <p className="mb-8 text-center text-gray-600">
          Continue building with ForgeDesk
        </p>
<Input
  label="Email"
  type="email"
  icon={<Mail size={20} />}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

<Input
  label="Password"
  type={isPasswordVisible ? "text" : "password"}
  icon={isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
  onIconClick={() => setIsPasswordVisible(!isPasswordVisible)}
   value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
<div className="mb-6 flex justify-end">
  <a
    href="#"
    className="text-sm text-cyan-600 hover:underline"
  >
    Forgot Password?
  </a>
</div>

        <Button
          text="Login"
          color="blue"
          fullWidth={true}
          onClick={handleLogin}
        />
        <p className="mt-6 text-center text-sm text-gray-600">
  Don't have an account?{" "}
  <a
    href="/register"
    className="font-semibold text-cyan-600 hover:underline"
  >
    Register
  </a>
</p>
      </div>
    </main>
  );
}