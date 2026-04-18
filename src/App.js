import React, { useState } from "react";
import GradeCD from "./GradeCD";
import GradeAB from "./GradeAB";

const TABS = [
  { key: "CD", label: "Grade C/D" },
  { key: "AB", label: "Grade A/B" },
];

const VALID_KEYS = new Set(TABS.map((t) => t.key));

function getTabFromURL() {
  const params = new URLSearchParams(window.location.search);
  const grade = (params.get("grade") || "").toUpperCase();
  if (!VALID_KEYS.has(grade)) {
    const url = new URL(window.location);
    url.searchParams.set("grade", "CD");
    window.location.replace(url);
    return "CD";
  }
  return grade;
}

export default function App() {
  const [activeTab] = useState(getTabFromURL);

  const switchTab = (key) => {
    const url = new URL(window.location);
    url.searchParams.set("grade", key);
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 relative overflow-x-auto">
      {/* Background ornaments */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glowing blobs - larger and more visible */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/3 w-80 h-80 bg-cyan-400/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-10 w-64 h-64 bg-teal-400/8 rounded-full blur-3xl" />
        <div className="absolute top-10 left-1/2 w-96 h-96 bg-sky-400/8 rounded-full blur-3xl" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Radial glow center top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-400/8 rounded-full blur-3xl" />

        {/* Subtle diagonal lines */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.2) 35px, rgba(255,255,255,0.2) 36px)`,
          }}
        />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(148,163,184,0.4) 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />

        {/* Floating ring shapes */}
        <div className="absolute top-[15%] left-[10%] w-40 h-40 border border-white/5 rounded-full" />
        <div className="absolute top-[15%] left-[10%] w-52 h-52 border border-white/[0.03] rounded-full" />
        <div className="absolute bottom-[20%] right-[8%] w-48 h-48 border border-white/5 rounded-full" />
        <div className="absolute bottom-[20%] right-[8%] w-64 h-64 border border-white/[0.03] rounded-full" />
        <div className="absolute top-[60%] left-[45%] w-32 h-32 border border-white/[0.04] rounded-full" />

        {/* Shuttlecock-inspired accent lines */}
        <div className="absolute top-[8%] right-[15%] w-24 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45" />
        <div className="absolute top-[12%] right-[18%] w-20 h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent rotate-45" />
        <div className="absolute bottom-[15%] left-[20%] w-28 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -rotate-45" />
        <div className="absolute bottom-[18%] left-[22%] w-20 h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent -rotate-45" />
      </div>

      <div className="mx-auto w-fit relative z-10">
        <h1 className="text-4xl font-extrabold text-center mb-1 text-white tracking-tight">
          Random Badminton Player Draw
        </h1>

        {/* Tab switcher */}
        <div className="flex justify-center gap-2 mb-4 mt-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => switchTab(tab.key)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === tab.key
                  ? "bg-white text-slate-900 shadow-lg"
                  : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "CD" && <GradeCD />}
        {activeTab === "AB" && <GradeAB />}
      </div>
    </div>
  );
}
