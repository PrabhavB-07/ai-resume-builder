"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {

  const router = useRouter();

  return (

    <div className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-gray-800">

        <h1 className="text-2xl font-bold text-blue-500">
          AI Resume Builder
        </h1>

        <div className="flex gap-6 text-lg">

          <Link
            href="/login"
            className="hover:text-blue-400"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Get Started
          </Link>

        </div>

      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center mt-40 px-6">

        <h1 className="text-6xl font-bold leading-tight">
          Build ATS Friendly <br />
          Resumes With AI 🚀
        </h1>

        <p className="text-gray-400 mt-6 text-xl max-w-2xl">
          Create professional resumes instantly using AI-powered resume generation and job description optimization.
        </p>

        <button
          onClick={() => router.push("/resume-builder")}
          className="mt-8 bg-blue-600 px-8 py-4 rounded-xl text-xl hover:bg-blue-700"
        >
          Create Resume
        </button>

      </div>

    </div>
  );
}