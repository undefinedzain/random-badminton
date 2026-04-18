import React, { useEffect, useRef, useState, useCallback } from "react";
import { Dices, Hand, CircleCheckBig, RefreshCw } from "lucide-react";
import Bracket from "./Bracket";
import { getFirstRoundMatchups, generateRandomPairs } from "./drawUtils";

const pairs_data = [
  { p1: "DIMAS", p2: "ARIFIN", pb: "BAJA BETON" },
  { p1: "FATCHUL", p2: "MADE", pb: "BAJA BETON" },
  { p1: "PUTRA", p2: "HARI", pb: "GOJEX" },
  { p1: "BEKI", p2: "TORO", pb: "GOJEX" },
  { p1: "IFAN", p2: "FAQIH", pb: "GOJEX" },
  { p1: "ROGER", p2: "MAULANA", pb: "GOJEX" },
  { p1: "HAZA", p2: "NANDA", pb: "FLUO MALANG" },
  { p1: "ZIDAN", p2: "DIMAS", pb: "FLUO MALANG" },
  { p1: "FARIS", p2: "RASYA", pb: "FLUO MALANG" },
  { p1: "KHUSEN", p2: "RAHMAD", pb: "TIRTO AGUNG" },
  { p1: "FERDI", p2: "DANIL", pb: "TIRTO AGUNG" },
  { p1: "NASRUL", p2: "DEDEN", pb: "TIRTO AGUNG" },
  { p1: "YOSI", p2: "HURI", pb: "DOROWATI" },
  { p1: "IMUL", p2: "LUKI", pb: "DOROWATI" },
  { p1: "FIRKY", p2: "AFAN", pb: "SMS PLOSOKUNING" },
  { p1: "FAREL", p2: "LEFA", pb: "SMS PLOSOKUNING" },
  { p1: "SATRIA", p2: "MUNIR", pb: "SMHASA" },
  { p1: "HAFIZ", p2: "HERU", pb: "SMHASA" },
  { p1: "APRI", p2: "SAFAK", pb: "KEDIRI" },
  { p1: "SULTON", p2: "DINO", pb: "KEDIRI" },
  { p1: "DITA", p2: "AGUNG", pb: "KEDIRI" },
  { p1: "FITO", p2: "FAISAL", pb: "HANOMAN 77" },
  { p1: "FAHMI", p2: "DIMAS", pb: "KRIAN" },
  { p1: "AFIF", p2: "BAGUS G", pb: "MALAIKAT SUBUH" },
  { p1: "EDO", p2: "KEVIN", pb: "PARE" },
  { p1: "YERE", p2: "SANDY", pb: "SBX" },
  { p1: "ANTON", p2: "ADREW", pb: "STIKES HUSADA" },
  { p1: "YOFAN", p2: "RIDHO", pb: "TIMUR JAYA" },
  { p1: "DONI", p2: "ERIK", pb: "SGN REBORN" },
  { p1: "BAROK", p2: "GALANG", pb: "PUTRA GAMA" },
  { p1: "TEGUH", p2: "ATTA", pb: "PUTRA GAMA" },
  { p1: "BYE", p2: "", pb: "_BYE_" },
];

const fixedPositionRules = [
    { p1: "DIMAS", p2: "ARIFIN", index: 0 },
    { p1: "BYE", p2: "", index: 1 },
    { p1: "FARIS", p2: "RASYA", index: 2 },
    { p1: "AFIF", p2: "BAGUS G", index: 3 },
    { p1: "SULTON", p2: "DINO", index: 4 },
    { p1: "TEGUH", p2: "ATTA", index: 5 },
    { p1: "KHUSEN", p2: "RAHMAD", index: 6 },
    { p1: "YOSI", p2: "HURI", index: 7 },
    { p1: "FERDI", p2: "DANIL", index: 8 },
    { p1: "HAZA", p2: "NANDA", index: 9 },
    { p1: "ROGER", p2: "MAULANA", index: 10 },
    { p1: "DONI", p2: "ERIK", index: 11 },
    { p1: "FAHMI", p2: "DIMAS", index: 12 },
    { p1: "FIRKY", p2: "AFAN", index: 13 },
    { p1: "BEKI", p2: "TORO", index: 14 },
    { p1: "DITA", p2: "AGUNG", index: 15 },
    { p1: "FATCHUL", p2: "MADE", index: 16 },
    { p1: "IMUL", p2: "LUKI", index: 17 },
    { p1: "EDO", p2: "KEVIN", index: 18 },
    { p1: "IFAN", p2: "FAQIH", index: 19 },
    { p1: "SATRIA", p2: "MUNIR", index: 20 },
    { p1: "ZIDAN", p2: "DIMAS", index: 21 },
    { p1: "APRI", p2: "SAFAK", index: 22 },
    { p1: "FITO", p2: "FAISAL", index: 23 },
    { p1: "YOFAN", p2: "RIDHO", index: 24 },
    { p1: "PUTRA", p2: "HARI", index: 25 },
    { p1: "HAFIZ", p2: "HERU", index: 26 },
    { p1: "FAREL", p2: "LEFA", index: 27 },
    { p1: "BAROK", p2: "GALANG", index: 28 },
    { p1: "NASRUL", p2: "DEDEN", index: 29 },
    { p1: "YERE", p2: "SANDY", index: 30 },
];

const TOTAL_PAIRS = pairs_data.length;
const allNames = pairs_data.flatMap((p) => [p.p1, p.p2]);
const getRandomName = () => allNames[Math.floor(Math.random() * allNames.length)];
const firstRoundMatchups = getFirstRoundMatchups(TOTAL_PAIRS);

export default function GradeAB() {
  const [pairs, setPairs] = useState([]);
  const [displayPairs, setDisplayPairs] = useState(
    Array.from({ length: TOTAL_PAIRS }, () => ["", ""])
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    const result = generateRandomPairs(pairs_data, fixedPositionRules, firstRoundMatchups);
    setPairs(result);
    setIsLoading(true);
    setIsDone(false);

    intervalRef.current = setInterval(() => {
      const temp = result.map((pair) => {
        if (pair.pb === "_BYE_") return ["", ""];
        let a = getRandomName();
        let b;
        do {
          b = getRandomName();
        } while (a === b);
        return [a, b];
      });
      setDisplayPairs(temp);
    }, 80);
  }, []);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsLoading(false);
    setIsDone(true);
    setDisplayPairs(pairs.map((p) => [p.p1, p.p2]));
  }, [pairs]);

  const reset = useCallback(() => {
    setIsDone(false);
    setPairs([]);
    setDisplayPairs(Array.from({ length: TOTAL_PAIRS }, () => ["", ""]));
  }, []);

  useEffect(() => {
    if (!isLoading && pairs.length > 0) {
      setDisplayPairs(pairs.map((p) => [p.p1, p.p2]));
    }
  }, [pairs, isLoading]);

  return (
    <>
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
              onClick={reset}
              className="bg-blue-500 hover:bg-blue-400 text-white px-5 py-2 rounded-lg shadow-lg shadow-blue-500/20 text-sm font-semibold transition-all hover:scale-105"
            >
              <RefreshCw className="inline-block w-4 h-4 mr-1" /> Ulang
            </button>
          </div>
        )}
      </div>

      <Bracket
        teams={displayPairs.map(([a, b]) => ({
          name: a && b ? `${a} / ${b}` : null,
        }))}
      />
    </>
  );
}
