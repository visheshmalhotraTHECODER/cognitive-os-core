import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 font-sans selection:bg-orange-500/30">
      <main className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
        
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 mb-4 border border-zinc-800 rounded-full bg-zinc-900/50 backdrop-blur-md">
            <span className="text-xs font-medium text-zinc-400 tracking-widest uppercase">Layer 3: The Tacit Knowledge Graph</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-600">
            Cognitive.OS
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mt-4">
            The future of AI is not general. It is specialised and adaptive. 
            Capturing the invisible intelligence of human experts into a durable, computable framework.
          </p>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent my-10"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mb-12">
          {[
            { title: "Observer SDK", desc: "Non-disruptive telemetry tracking intent over clicks." },
            { title: "Extraction Engine", desc: "Isolating decision contexts and surfacing heuristics." },
            { title: "Knowledge Graph", desc: "Codifying human judgment for next-gen AI Agents." }
          ].map((item, i) => (
            <div key={i} className="p-6 border border-zinc-800/60 rounded-xl bg-zinc-900/20 backdrop-blur-sm hover:bg-zinc-900/40 hover:border-zinc-700 transition-all">
              <h3 className="text-zinc-200 font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-zinc-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <a 
          href="/dashboard"
          className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors tracking-wide flex items-center justify-center gap-2"
        >
          Initialize Engine
          <span>→</span>
        </a>

      </main>
    </div>
  );
}
