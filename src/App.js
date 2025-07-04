import React, { useEffect, useRef, useState } from "react";

// Semua peserta
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
  { name: "Syukron", grade: "B" },
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

// 🔀 Fungsi acak
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const getRandomName = () => participants[Math.floor(Math.random() * participants.length)].name;

export default function App() {
  const [pairs, setPairs] = useState([]);
  const [displayPairs, setDisplayPairs] = useState(Array.from({ length: 16 }, () => ["", ""]));
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef(null);

  const generatePairs = () => {
    const a = shuffle(participants.filter((p) => p.grade === "A"));
    const d = shuffle(participants.filter((p) => p.grade === "D"));
    const b = shuffle(participants.filter((p) => p.grade === "B"));
    const c = shuffle(participants.filter((p) => p.grade === "C"));

    if (a.length !== d.length || b.length !== c.length) {
      alert("Jumlah pemain tidak seimbang antara grade.");
      return [];
    }

    const adPairs = a.map((p, i) => ({ p1: p.name, p2: d[i].name }));
    const bcPairs = b.map((p, i) => ({ p1: p.name, p2: c[i].name }));

    return shuffle([...adPairs, ...bcPairs]);
  };

  const start = () => {
    const result = generatePairs();
    if (!result.length) return;

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl h-full mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Random Partner (Tanpa Rule)
        </h1>

        <div className="flex justify-center gap-4 mb-8">
          {!isLoading && !isDone && (
            <button
              onClick={start}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
            >
              START
            </button>
          )}
          {isLoading && (
            <button
              onClick={stop}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow"
            >
              STOP
            </button>
          )}
          {!isLoading && isDone && (
            <span className="text-green-700 font-semibold text-lg">
              ✅ Random process done
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 8 }).map((_, i) => {
            const idx1 = i * 2;
            const idx2 = i * 2 + 1;
            const [a1, b1] = displayPairs[idx1];
            const [a2, b2] = displayPairs[idx2];

            return (
              <div key={i} className="flex flex-row justify-center items-center gap-6">
                {/* Tim kiri */}
                <div className="bg-white rounded-lg shadow p-4 text-center w-80">
                  <h2 className="font-semibold text-gray-700">Team {idx1 + 1}</h2>
                  <p className="text-lg font-bold mt-2">
                    {a1 && b1 ? `${a1} & ${b1}` : "Click start..."}
                  </p>
                </div>

                {/* VS */}
                <div className="text-2xl font-extrabold text-gray-700">VS</div>

                {/* Tim kanan */}
                <div className="bg-white rounded-lg shadow p-4 text-center w-80">
                  <h2 className="font-semibold text-gray-700">Team {idx2 + 1}</h2>
                  <p className="text-lg font-bold mt-2">
                    {a2 && b2 ? `${a2} & ${b2}` : "Click start..."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
