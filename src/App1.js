import React, { useEffect, useRef, useState } from "react";

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

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const randomChar = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));

export default function App() {
  const [pairs, setPairs] = useState([]);
  const [displayPairs, setDisplayPairs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef(null);

  // const generateRandomPairs = () => {
  //   const used = new Set();
  //   fixedPairs.forEach(({ p1, p2 }) => used.add(p1).add(p2));

  //   const bLeft = participants.filter(p => p.grade === "B" && !used.has(p.name));
  //   const cLeft = participants.filter(p => p.grade === "C" && !used.has(p.name));

  //   const bShuffled = shuffle(bLeft);
  //   const cShuffled = shuffle(cLeft);

  //   if (bShuffled.length !== cShuffled.length) {
  //     alert("Jumlah pemain B dan C yang belum dipasangkan tidak sama!");
  //     return;
  //   }

  //   const randomPairs = bShuffled.map((b, i) => ({
  //     p1: b.name,
  //     p2: cShuffled[i].name
  //   }));

  //   setPairs([...fixedPairs, ...randomPairs]);
  // };
  // const generateRandomPairs = () => {
  //   const used = new Set();
  //   fixedPairs.forEach(({ p1, p2 }) => used.add(p1).add(p2));

  //   const bLeft = participants.filter(p => p.grade === "B" && !used.has(p.name));
  //   const cLeft = participants.filter(p => p.grade === "C" && !used.has(p.name));

  //   const bShuffled = shuffle(bLeft);
  //   const cShuffled = shuffle(cLeft);

  //   if (bShuffled.length !== cShuffled.length) {
  //     alert("Jumlah pemain B dan C yang belum dipasangkan tidak sama!");
  //     return;
  //   }

  //   const randomPairs = bShuffled.map((b, i) => ({
  //     p1: b.name,
  //     p2: cShuffled[i].name
  //   }));

  //   // ✅ Acak posisi tim setelah semua pasangan digabung
  //   setPairs(shuffle([...fixedPairs, ...randomPairs]));
  // };
  const generateRandomPairs = () => {
    const used = new Set();
    fixedPairs.forEach(({ p1, p2 }) => used.add(p1).add(p2));

    const bLeft = participants.filter(p => p.grade === "B" && !used.has(p.name));
    const cLeft = participants.filter(p => p.grade === "C" && !used.has(p.name));

    const bShuffled = shuffle(bLeft);
    const cShuffled = shuffle(cLeft);

    if (bShuffled.length !== cShuffled.length) {
      alert("Jumlah pemain B dan C yang belum dipasangkan tidak sama!");
      return [];
    }

    const randomPairs = bShuffled.map((b, i) => ({
      p1: b.name,
      p2: cShuffled[i].name
    }));

    return shuffle([...fixedPairs, ...randomPairs]);
  };


  // const start = () => {
  //   generateRandomPairs();
  //   setIsLoading(true);
  //   intervalRef.current = setInterval(() => {
  //     setDisplayPairs(
  //       pairs.map(() => [randomChar(), randomChar()])
  //     );
  //   }, 100);
  // };
  const start = () => {
    const result = generateRandomPairs();
    if (result.length === 0) return;

    setPairs(result);
    setIsLoading(true);

    intervalRef.current = setInterval(() => {
      setDisplayPairs(
        result.map(() => [randomChar(), randomChar()])
      );
    }, 100);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setIsLoading(false);
    setDisplayPairs(pairs.map(p => [p.p1, p.p2]));
  };

  useEffect(() => {
    if (!isLoading) setDisplayPairs(pairs.map(p => [p.p1, p.p2]));
  }, [pairs, isLoading]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
          🎯 Undian Ganda Putra Badminton
        </h1>

        <div className="flex justify-center gap-4 mb-8">
          {!isLoading ? (
            <button
              onClick={start}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
            >
              Mulai Undian
            </button>
          ) : (
            <button
              onClick={stop}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow"
            >
              Stop
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayPairs.map(([a, b], i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 text-center">
              <h2 className="font-semibold text-gray-700">Tim {i + 1}</h2>
              <p className="text-lg font-bold mt-2">{a} & {b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
