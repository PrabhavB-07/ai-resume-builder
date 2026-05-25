"use client";

import { useState } from "react";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebase";

import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Login Successful 😈🔥");

      router.push("/resume-builder");

    } catch (error: any) {

      console.log(error);

      alert(error.message);
    }
  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center">

      <div className="bg-zinc-900 p-10 rounded-2xl w-[400px] border border-zinc-800">

        <h1 className="text-white text-4xl font-bold text-center mb-8">
          Login
        </h1>

        <div className="flex flex-col gap-5">

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-4 rounded-lg bg-black text-white border border-zinc-700 outline-none"
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 rounded-lg bg-black text-white border border-zinc-700 outline-none"
          />

          <button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold"
          >
            Login
          </button>

        </div>

      </div>

    </div>
  );
}