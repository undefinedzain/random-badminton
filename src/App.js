import React, { useEffect, useRef, useState } from "react";

// ✅ Pasangan tetap
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

// ✅ Semua peserta
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
  { name: "Pak Heny", grade: "B" },
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
  { name: "Amin", grade: "C" },
  { name: "Ipunk", grade: "C" },
  { name: "Fian", grade: "C" },
  { name: "Abah Bagio", grade: "C" },
];

// 🔀 Acak array
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// 🔡 Ambil nama acak dari peserta
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

    // 🔁 Pasangkan B dan C, hindari pasangan terlarang
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl h-screen mx-auto flex flex-row gap-x-8 items-center">
        <div className="w-96">
            <h1 className="text-xl font-bold">Participants</h1>
            <br></br>
            {
                participants.map((e, idx) => <p>{idx + 1}. {e.name}</p>)
            }
        </div>
        <div>
          <h1 className="text-3xl font-bold text-center mb-6 text-blue-700 max-w-96">
            Random Partner Application
          </h1>

          <div className="flex justify-center gap-4 mb-8 min-h-[44px]">
            {!isLoading && !isDone && (
              <button
                onClick={start}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow w-36 h-36 rounded-full"
              >
                START
              </button>
            )}
            {isLoading && (
              <button
                onClick={stop}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow w-36 h-36 rounded-full"
              >
                STOP
              </button>
            )}
            {!isLoading && isDone && (
              <p className="text-green-700 font-semibold text-lg">
                ✅ Random process done
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 8 }).map((_, i) => {
            const idx1 = i * 2;
            const idx2 = i * 2 + 1;
            const [a1, b1] = displayPairs[idx1];
            const [a2, b2] = displayPairs[idx2];

            return (
            <div key={i} className="flex items-center justify-center gap-6">
                {/* Team kiri */}
                <div className="bg-white rounded-lg shadow p-4 text-center w-80">
                <h2 className="font-semibold text-gray-700">Team {idx1 + 1}</h2>
                {a1 && b1 ? (
                    <p className="text-lg font-bold mt-2">{a1} & {b1}</p>
                ) : (
                    <p className="text-gray-400 italic mt-2">Click start...</p>
                )}
                </div>

                {/* VS */}
                <div className="text-xl font-extrabold text-gray-700">VS</div>

                {/* Team kanan */}
                <div className="bg-white rounded-lg shadow p-4 text-center w-80">
                <h2 className="font-semibold text-gray-700">Team {idx2 + 1}</h2>
                {a2 && b2 ? (
                    <p className="text-lg font-bold mt-2">{a2} & {b2}</p>
                ) : (
                    <p className="text-gray-400 italic mt-2">Click start...</p>
                )}
                </div>
            </div>
            );
        })}
        </div>
      </div>
    </div>
  );
}
