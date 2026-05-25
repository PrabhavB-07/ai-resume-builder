export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* Sidebar */}
      <div className="w-[250px] bg-zinc-900 border-r border-zinc-800 p-6">

        <h1 className="text-2xl font-bold text-blue-500 mb-10">
          AI Resume
        </h1>

        <div className="flex flex-col gap-6 text-lg">

          <button className="text-left hover:text-blue-400">
            Dashboard
          </button>

          <button className="text-left hover:text-blue-400">
            My Resumes
          </button>

          <button className="text-left hover:text-blue-400">
            AI Tools
          </button>

          <button className="text-left hover:text-blue-400">
            Settings
          </button>

        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">

        <h1 className="text-4xl font-bold mb-10">
          Dashboard 🚀
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-6">

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <h2 className="text-xl text-gray-400">
              Total Resumes
            </h2>

            <p className="text-4xl font-bold mt-4">
              12
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <h2 className="text-xl text-gray-400">
              ATS Score
            </h2>

            <p className="text-4xl font-bold mt-4">
              92%
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <h2 className="text-xl text-gray-400">
              AI Suggestions
            </h2>

            <p className="text-4xl font-bold mt-4">
              28
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}