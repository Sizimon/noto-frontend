'use client';

export default function AboutSection() {
  return (
    <section id="about" className="px-6 py-16 md:py-24 bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2">

        {/* Card 1 - Main Overview */}
        <div className="bg-neutral-900 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-3 text-orange-500">What is <code>noto()</code>?</h2>
          <p className="text-gray-300">
            <code>noto()</code> is a developer-friendly notepad app built for ideas, tags, and media. It’s designed to be fast, flexible, and minimal — your home for organized thoughts and curated content.
          </p>
        </div>

        {/* Right Column - Stack Cards 2 & 3 */}
        <div className="flex flex-col gap-6">
          {/* Card 2 - Current Features */}
          <div className="bg-neutral-900 rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-green-400">Current Features</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>📝 Rich text editor with formatting</li>
              <li>🏷️ Tag-based organization</li>
              <li>🔍 Basic filtering and search</li>
            </ul>
          </div>

          {/* Card 3 - Future Features */}
          <div className="bg-neutral-900 rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-blue-400">Upcoming Features</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>🎬 ClipCurator: import videos & timestamp notes</li>
              <li>📋 Kanban-style task organization</li>
              <li>📆 Calendar & timeline views</li>
              <li>🤖 AI-assisted writing & note linking</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}