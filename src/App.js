import React, { useEffect, useRef, useState } from "react";
import { Dices, Hand, CircleCheckBig, RefreshCw, Users, X } from "lucide-react";
import Bracket from "./Bracket";

const fixedPairs = [
  { p1: "Fanani", p2: "Tiyo" },
  { p1: "Agung", p2: "Angga" },
  { p1: "Yoga", p2: "Bairul" },
  { p1: "Pak Eko", p2: "Agung Sukro" },
  { p1: "Yuniar", p2: "Andik" },
  { p1: "Sanusi", p2: "Gus Rozaq" },
  { p1: "Zain", p2: "Pak Imam" },
  { p1: "Faisal", p2: "Rahmad" }
];

const participants = [
  { name: "Fanani", grade: "A" },
  { name: "Agung", grade: "A" },
  { name: "Yoga", grade: "A" },
  { name: "Pak Eko", grade: "A" },
  { name: "Yuniar", grade: "A" },
  { name: "Sanusi", grade: "A" },

  { name: "Tiyo", grade: "D" },
  { name: "Angga", grade: "D" },
  { name: "Bairul", grade: "D" },
  { name: "Agung Sukro", grade: "D" },
  { name: "Andik", grade: "D" },
  { name: "Gus Rozaq", grade: "D" },

  { name: "Faisal", grade: "B" },
  { name: "Pak Budi", grade: "B" },
  { name: "Reno", grade: "B" },
  { name: "Asep", grade: "B" },
  { name: "Amin", grade: "B" },
  { name: "Pak Falik", grade: "B" },
  { name: "Pak Imam", grade: "B" },
  { name: "Pak Lutfi", grade: "B" },
  { name: "Dandi", grade: "B" },
  { name: "Doni", grade: "B" },

  { name: "Zain", grade: "C" },
  { name: "Rahmad", grade: "C" },
  { name: "Pak Majid", grade: "C" },
  { name: "Pak Ajis", grade: "C" },
  { name: "Sigit Sukro", grade: "C" },
  { name: "Aris", grade: "C" },
  { name: "Pak Heny", grade: "C" },
  { name: "Ipunk", grade: "C" },
  { name: "Fian", grade: "C" },
  { name: "Abah Bagio", grade: "C" },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const getRandomParticipantName = () => {
  return participants[Math.floor(Math.random() * participants.length)].name;
};

export default function App() {
  const [pairs, setPairs] = useState([]);
  const [displayPairs, setDisplayPairs] = useState(
    Array.from({ length: 16 }, () => ["", ""])
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const intervalRef = useRef(null);

  const generateRandomPairs = () => {
    const used = new Set();
    fixedPairs.forEach(({ p1, p2 }) => used.add(p1).add(p2));

    const bLeft = participants.filter(
      (p) => p.grade === "B" && !used.has(p.name)
    );
    const cLeft = participants.filter(
      (p) => p.grade === "C" && !used.has(p.name)
    );

    const bShuffled = shuffle(bLeft);
    const cShuffled = shuffle(cLeft);

    if (bShuffled.length !== cShuffled.length) {
      alert("Jumlah pemain B dan C tersisa tidak sama!");
      return [];
    }

    const randomPairs = [];
    for (let i = 0; i < bShuffled.length; i++) {
      const b = bShuffled[i];
      for (let j = 0; j < cShuffled.length; j++) {
        const c = cShuffled[j];
        const isInvalid =
          (b.name === "Pak Lutfi" && c.name === "Fian") ||
          (b.name === "Fian" && c.name === "Pak Lutfi") ||
          (b.name === "Faisal" && c.name === "Zain") ||
          (b.name === "Zain" && c.name === "Faisal");

        if (
          !isInvalid &&
          !randomPairs.find((p) => p.p1 === b.name || p.p2 === c.name)
        ) {
          randomPairs.push({ p1: b.name, p2: c.name });
          cShuffled.splice(j, 1);
          break;
        }
      }
    }

    let shuffled;
    let fianIndex, lutfiIndex, faisalIndex, zainIndex;

    do {
      shuffled = shuffle([...fixedPairs, ...randomPairs]);

      const findIndex = (name) =>
        shuffled.findIndex((pair) => pair.p1 === name || pair.p2 === name);

      fianIndex = findIndex("Fian");
      lutfiIndex = findIndex("Pak Lutfi");
      faisalIndex = findIndex("Faisal");
      zainIndex = findIndex("Zain");
    } while (
      Math.abs(fianIndex - lutfiIndex) < 4 ||
      Math.abs(faisalIndex - zainIndex) < 4
    );

    return shuffled;
  };

  const start = () => {
    const result = generateRandomPairs();
    if (result.length === 0) return;

    setPairs(result);
    setIsLoading(true);
    setIsDone(false);

    intervalRef.current = setInterval(() => {
      const temp = result.map(() => {
        let a = getRandomParticipantName();
        let b;
        do {
          b = getRandomParticipantName();
        } while (a === b);
        return [a, b];
      });
      setDisplayPairs(temp);
    }, 80);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setIsLoading(false);
    setIsDone(true);
    setDisplayPairs(pairs.map((p) => [p.p1, p.p2]));
  };

  useEffect(() => {
    if (!isLoading && pairs.length > 0) {
      setDisplayPairs(pairs.map((p) => [p.p1, p.p2]));
    }
  }, [pairs, isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 relative overflow-hidden">
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
        <p className="text-center text-blue-300/70 text-sm mb-8">
          {participants.length} peserta &middot; {displayPairs.length} tim
          <button
            onClick={() => setShowParticipants(true)}
            className="ml-3 inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
          >
            <Users className="w-3.5 h-3.5" /> Lihat Peserta
          </button>
        </p>

        <div className="flex justify-center gap-4 mb-8 min-h-[44px]">
          {!isLoading && !isDone && (
            <button
              onClick={start}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-3 rounded-full shadow-lg shadow-emerald-500/30 text-lg font-bold transition-all hover:scale-105"
            >
              <Dices className="inline-block w-5 h-5 mr-2" /> START
            </button>
          )}
          {isLoading && (
            <button
              onClick={stop}
              className="bg-rose-500 hover:bg-rose-400 text-white px-10 py-3 rounded-full shadow-lg shadow-rose-500/30 text-lg font-bold animate-pulse transition-all"
            >
              <Hand className="inline-block w-5 h-5 mr-2" /> STOP
            </button>
          )}
          {!isLoading && isDone && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-emerald-400 font-semibold text-lg">
                <CircleCheckBig className="inline-block w-5 h-5 mr-1" /> Undian selesai!
              </p>
              <button
                onClick={() => { setIsDone(false); setPairs([]); setDisplayPairs(Array.from({ length: 16 }, () => ["", ""])); }}
                className="bg-blue-500 hover:bg-blue-400 text-white px-5 py-2 rounded-lg shadow-lg shadow-blue-500/20 text-sm font-semibold transition-all hover:scale-105"
              >
                <RefreshCw className="inline-block w-4 h-4 mr-1" /> Ulang
              </button>
            </div>
          )}
        </div>

        {/* Tournament bracket */}
        <Bracket
          teams={displayPairs.map(([a, b], i) => ({
            name: a && b ? `${a} & ${b}` : null,
          }))}
        />
      </div>

      {/* Participants modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
          showParticipants ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowParticipants(false)}
      >
        {/* Blur overlay */}
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
          showParticipants ? "opacity-100" : "opacity-0"
        }`} />

        {/* Modal content */}
        <div
          className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden transition-all duration-300 ${
            showParticipants ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 pb-0 mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" /> Daftar Peserta
            </h2>
            <button
              onClick={() => setShowParticipants(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto px-6 pb-6">
            {["A", "B", "C", "D"].map((grade) => {
              const group = participants.filter((p) => p.grade === grade);
              if (group.length === 0) return null;
              return (
                <div key={grade} className="mb-4 last:mb-0">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Grade {grade}
                  </h3>
                  <div className="grid grid-cols-2 gap-1">
                    {group.map((p, idx) => (
                      <div
                        key={p.name}
                        className="text-sm text-gray-700 py-1.5 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        {p.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="mt-4 pt-3 border-t border-gray-100 text-center text-xs text-gray-400">
              Total: {participants.length} peserta
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
