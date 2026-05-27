"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-500">TailorCV</h1>
        <div className="flex gap-6 text-lg">
          <Link href="/login" className="hover:text-blue-400">Login</Link>
          <Link href="/signup" className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center mt-28 px-6">
        <span className="bg-blue-900 text-blue-300 text-sm px-4 py-1 rounded-full mb-6">
          AI Powered — Free to Start
        </span>
        <h1 className="text-6xl font-bold leading-tight">
          Build ATS Friendly <br /> Resumes With AI 🚀
        </h1>
        <p className="text-gray-400 mt-6 text-xl max-w-2xl">
          Paste any job description — AI rewrites your resume for that exact role in seconds.
        </p>
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => router.push("/signup")}
            className="bg-blue-600 px-8 py-4 rounded-xl text-xl hover:bg-blue-700 transition"
          >
            Get Started Free
          </button>
          <button
            onClick={() => router.push("/resume-builder")}
            className="border border-gray-700 px-8 py-4 rounded-xl text-xl hover:bg-gray-900 transition"
          >
            See Demo
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 mt-28 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold mb-2">JD Matched Resume</h3>
          <p className="text-gray-400 text-sm">
            Paste any job description — AI tailors your resume with exact keywords recruiters look for.
          </p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-lg font-semibold mb-2">ATS Score Checker</h3>
          <p className="text-gray-400 text-sm">
            Know exactly how your resume scores against ATS before you apply.
          </p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-semibold mb-2">PDF Export</h3>
          <p className="text-gray-400 text-sm">
            Download a clean, professional PDF resume — ready to send instantly.
          </p>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-5xl mx-auto px-6 mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-4">
            "Got 3 interview calls in one week after using TailorCV. The JD matching is insane."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-blue-300 font-semibold text-sm">R</div>
            <div>
              <p className="text-sm font-medium">Rahul Sharma</p>
              <p className="text-xs text-gray-500">Software Engineer, Bangalore</p>
            </div>
          </div>
        </div>
        <div className="border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-4">
            "Finally a resume builder that actually understands what recruiters want."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-900 rounded-full flex items-center justify-center text-purple-300 font-semibold text-sm">P</div>
            <div>
              <p className="text-sm font-medium">Priya Mehta</p>
              <p className="text-xs text-gray-500">Frontend Developer, Pune</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-16 pb-8 text-gray-600 text-sm">
        Built with ❤️ — TailorCV © 2026
      </div>

    </div>
  );
}