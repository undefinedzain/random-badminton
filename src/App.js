import React, { useEffect, useRef, useState } from "react";
import { Dices, Hand, CircleCheckBig, RefreshCw } from "lucide-react";
import Bracket from "./Bracket";

const pairs_data = [
  { p1: "ALI", p2: "ROBY" },
  { p1: "YOGI", p2: "HUSEN" },
  { p1: "ABAH BAGIO", p2: "BABR" },
  { p1: "JADUL", p2: "GUGUS" },
  { p1: "DANIL", p2: "ZEIN" },
  { p1: "AZMI", p2: "WAYANG" },
  { p1: "ARIFIN", p2: "AUREL" },
  { p1: "ICANG", p2: "HARI" },
  { p1: "MUSLIH", p2: "FAISOL" },
  { p1: "SLAMET", p2: "WAHYU" },
  { p1: "JUNED", p2: "AHMAD" },
  { p1: "DONI", p2: "YUYUT" },
  { p1: "ARIF", p2: "NANANG" },
  { p1: "APING", p2: "YUDHA" },
  { p1: "AAN", p2: "SUBEKI" },
  { p1: "WAWAN", p2: "OKEM" },
  { p1: "BAGUS", p2: "FARUQ" },
  { p1: "FIRMAN", p2: "MANTRI" },
  { p1: "ROY", p2: "SONI" },
  { p1: "TONI", p2: "FEBRI" },
  { p1: "REHAN", p2: "RIO" },
  { p1: "HILMAN", p2: "YERI" },
  { p1: "FAIQ", p2: "HUDA" },
  { p1: "LASIN", p2: "EKO BOM" },
  { p1: "RONI", p2: "SAIFUL" },
  { p1: "GALIH", p2: "ARIP" },
  { p1: "RAHMA", p2: "RIADI" },
  { p1: "HAQI", p2: "BUDI DNR" },
  { p1: "AGUNG CJ", p2: "SULTON" },
  { p1: "DADANG", p2: "ROFIQ" },
  { p1: "HAMZAH", p2: "SAFI'I" },
  { p1: "MAHMUD", p2: "WASIS" },
  { p1: "FAHMI", p2: "HARI" },
  { p1: "DAYAT", p2: "KAFID" },
  { p1: "HERI", p2: "DRAJAD" },
  { p1: "AHMAD", p2: "APRIL" },
  { p1: "UNTUNG", p2: "JUNDAY" },
  { p1: "RIO", p2: "ILHAM" },
  { p1: "M.PUR", p2: "RISKI" },
  { p1: "DEDEN", p2: "WAHYU" },
  { p1: "LOTA", p2: "RENDRA" },
  { p1: "MUKIDI", p2: "SANTOS" },
  { p1: "FRENGKY", p2: "ANGGA" },
  { p1: "YANTO", p2: "ROZAQ" },
  { p1: "JIHAN", p2: "BOJEZ" },
  { p1: "NANANG", p2: "JOLLY" },
  { p1: "AKID", p2: "ARYO" },
  { p1: "RAFAEL", p2: "DENIS" },
  { p1: "SANDY", p2: "DIMAS" },
  { p1: "JOHAN", p2: "HERU" },
  { p1: "AGUS", p2: "SANDI" },
  { p1: "RONI", p2: "SUKRON" },
  { p1: "YUSUF", p2: "MAUL" },
  { p1: "RIDHO", p2: "DINO" },
  { p1: "DAFA", p2: "RENO" },
  { p1: "IPUNG", p2: "FANANI" },
  { p1: "FEBRI", p2: "ARIS" },
  { p1: "MUNIR", p2: "UNTUNG" },
  { p1: "RONI", p2: "MADE" },
  { p1: "AJI", p2: "SUKRI" },
  { p1: "RIO", p2: "DIKA" },
  { p1: "ASRUL", p2: "PENDIK" },
  { p1: "SUN", p2: "DENI" },
  { p1: "ALFARO", p2: "AAN" },
  { p1: "MOMON", p2: "PUTUT" },
  { p1: "YAYAN", p2: "YANTO" },
  { p1: "JUNED", p2: "SULTON CIPALI" },
  { p1: "KABUL", p2: "HASAN" },
];

const TOTAL_PAIRS = pairs_data.length;

const allNames = pairs_data.flatMap((p) => [p.p1, p.p2]);

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const getRandomName = () => allNames[Math.floor(Math.random() * allNames.length)];

export default function App() {
  const [pairs, setPairs] = useState([]);
  const [displayPairs, setDisplayPairs] = useState(
    Array.from({ length: TOTAL_PAIRS }, () => ["", ""])
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef(null);

  const generateRandomPairs = () => {
    // Only shuffle the position/order of pairs in the bracket
    return shuffle([...pairs_data]);
  };

  const start = () => {
    const result = generateRandomPairs();
    setPairs(result);
    setIsLoading(true);
    setIsDone(false);

    intervalRef.current = setInterval(() => {
      const temp = result.map(() => {
        let a = getRandomName();
        let b;
        do {
          b = getRandomName();
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
        <p className="text-center text-blue-300/70 text-sm mb-8">
          {TOTAL_PAIRS * 2} peserta &middot; {TOTAL_PAIRS} tim
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
                onClick={() => { setIsDone(false); setPairs([]); setDisplayPairs(Array.from({ length: TOTAL_PAIRS }, () => ["", ""])); }}
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
            name: a && b ? `${a} / ${b}` : null,
          }))}
        />
      </div>
    </div>
  );
}
