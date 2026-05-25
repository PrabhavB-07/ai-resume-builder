"use client";

import { useState } from "react";

import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebase";

export default function SignupPage() {

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleSignup = async () => {

    try {

      console.log("Signup button clicked 😈🔥");

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      console.log(userCredential);

      alert("Signup Successful 😈🔥");

    } catch (error: any) {

      console.log(error);

      alert(error.message);
    }
  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center">

      <div className="bg-zinc-900 p-10 rounded-2xl w-[400px] border border-zinc-800">

        <h1 className="text-white text-4xl font-bold text-center mb-8">
          Create Account
        </h1>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-5"
        >

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-4 rounded-lg bg-black text-white border border-zinc-700 outline-none"
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-4 rounded-lg bg-black text-white border border-zinc-700 outline-none"
          />

          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 rounded-lg bg-black text-white border border-zinc-700 outline-none"
          />

          <button
            type="button"
            onClick={handleSignup}
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold"
          >
            Sign Up
          </button>

        </form>

      </div>

    </div>
  );
}