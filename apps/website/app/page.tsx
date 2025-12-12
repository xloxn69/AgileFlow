export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            AgileFlow
          </h1>
          <p className="text-2xl text-gray-300 mb-8">
            AI-Driven Agile Development
          </p>
          <p className="text-xl text-gray-400 mb-12">
            41 commands, 26 agents, 23 skills for Claude Code, Cursor, and Windsurf
          </p>

          <div className="bg-slate-800/50 rounded-lg p-6 max-w-2xl mx-auto border border-slate-700">
            <code className="text-green-400 text-lg">
              npx agileflow install
            </code>
          </div>

          <div className="mt-16">
            <a
              href="https://docs.agileflow.projectquestorg.com"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
