import React, { useEffect, useRef, useState, useCallback } from "react";
import { Dices, Hand, CircleCheckBig, RefreshCw } from "lucide-react";
import Bracket from "./Bracket";
import { getFirstRoundMatchups, generateRandomPairs } from "./drawUtils";

const pairs_data = [
  { p1: "ALI", p2: "ROBY", pb: "BAJA BETON" },
  { p1: "YOGI", p2: "HUSEN", pb: "BAJA BETON" },
  { p1: "ABAH BAGIO", p2: "BABAR", pb: "BAJA BETON" },
  { p1: "JADUL", p2: "GUGUS", pb: "BAJA BETON" },
  { p1: "DANIL", p2: "ZEIN", pb: "BAJA BETON" },
  { p1: "AZMI", p2: "WAYANG", pb: "BAJA BETON" },
  { p1: "ARIFIN", p2: "AUREL", pb: "BAJA BETON" },
  { p1: "ICANG", p2: "HARI", pb: "BAJA BETON" },
  { p1: "MUSLIH", p2: "FAISOL", pb: "BAJA BETON" },
  { p1: "SLAMET", p2: "WAHYU", pb: "BAJA BETON" },
  { p1: "JUNED", p2: "AHMAD", pb: "BAJA BETON" },
  { p1: "DONI", p2: "YUYUT", pb: "SGN REBORN" },
  { p1: "ARIF", p2: "NANANG", pb: "SGN REBORN" },
  { p1: "APING", p2: "YUDHA", pb: "SGN REBORN" },
  { p1: "AAN", p2: "SUBEKI", pb: "SGN REBORN" },
  { p1: "WAWAN", p2: "OKEM", pb: "SGN REBORN" },
  { p1: "BAGUS", p2: "FARUQ", pb: "SGN REBORN" },
  { p1: "FIRMAN", p2: "MANTRI", pb: "SGN REBORN" },
  { p1: "ROY", p2: "SONI", pb: "SBBC" },
  { p1: "TONI", p2: "FEBRI", pb: "SBBC" },
  { p1: "REHAN", p2: "RIO", pb: "SBBC" },
  { p1: "HILMAN", p2: "YERI", pb: "SBBC" },
  { p1: "FAIQ", p2: "HUDA", pb: "SBBC" },
  { p1: "LASIN", p2: "EKO BOM", pb: "SBBC" },
  { p1: "RONI", p2: "SAIFUL", pb: "GOJEX" },
  { p1: "GALIH", p2: "ARIP", pb: "GOJEX" },
  { p1: "RAHMA", p2: "RIADI", pb: "XWUNGU" },
  { p1: "HAQI", p2: "BUDI DNR", pb: "XWUNGU" },
  { p1: "WIDODO", p2: "AMBAR", pb: "RINGIN CONTONG" },
  { p1: "DADANG", p2: "ROFIQ", pb: "XWUNGU" },
  { p1: "HAMZAH", p2: "SAFI'I", pb: "XWUNGU" },
  { p1: "MAHMUD", p2: "WASIS", pb: "XWUNGU" },
  { p1: "FAHMI", p2: "HARI", pb: "AFANDA" },
  { p1: "DAYAT", p2: "KAFID", pb: "AFANDA" },
  { p1: "HERI", p2: "DRAJAD", pb: "AFANDA" },
  { p1: "SON", p2: "APRIL", pb: "SBX MALANG" },
  { p1: "ANDRE", p2: "JUNDAN", pb: "SBX MALANG" },
  { p1: "RIO", p2: "ILHAM", pb: "OBASERA" },
  { p1: "M.PUR", p2: "RISKI", pb: "OBASERA" },
  { p1: "DEDEN", p2: "WAHYU", pb: "PARE" },
  { p1: "LOTA", p2: "RENDRA", pb: "PARE" },
  { p1: "MUKIDI", p2: "SANTOS", pb: "PARE" },
  { p1: "FRENGKY", p2: "ANGGA", pb: "PARE" },
  { p1: "YANTO", p2: "ROZAQ", pb: "RAJAWALI" },
  { p1: "JIHAN", p2: "BOJEZ", pb: "RAJAWALI" },
  { p1: "NANANG", p2: "JOLLY", pb: "ROXY" },
  { p1: "AKID", p2: "ARYO", pb: "ROXY" },
  { p1: "RAFAEL", p2: "DENIS", pb: "SATRIA" },
  { p1: "SANDY", p2: "DIMAS", pb: "SATRIA" },
  { p1: "JOHAN", p2: "HERU", pb: "GEWA" },
  { p1: "AGUS", p2: "SANDI", pb: "DR.HUSADA" },
  { p1: "RONI", p2: "SUKRON", pb: "HUSADA" },
  { p1: "IRFIN", p2: "BU KAJI", pb: "AN NUR" },
  { p1: "RIDHO", p2: "DINO", pb: "TIMUR JAYA" },
  { p1: "DAFA", p2: "RENO", pb: "MOJOSARI" },
  { p1: "IPUNG", p2: "FANANI", pb: "PB JUANG" },
  { p1: "DANI", p2: "ABID", pb: "AFANDA" },
  { p1: "MUNIR", p2: "UNTUNG", pb: "KEDIRI" },
  { p1: "RONI", p2: "MADE", pb: "VARIASI MOTOR" },
  { p1: "AJI", p2: "SUKRI", pb: "XBX" },
  { p1: "RIO", p2: "DIKA", pb: "MK SONG" },
  { p1: "ASRUL", p2: "PENDIK", pb: "PADI" },
  { p1: "SUN", p2: "DENI", pb: "MOJOSARI" },
  { p1: "ALFARO", p2: "AAN", pb: "DLR" },
  { p1: "MOMON", p2: "PUTUT", pb: "TOYA" },
  { p1: "YAYAN", p2: "YANTO", pb: "DUGADU" },
  { p1: "JUNED", p2: "SULTON CIPALI", pb: "XWUNGU" },
  { p1: "KABUL", p2: "HASAN", pb: "XWUNGU" },
  { p1: "YOHANES", p2: "ARLIN", pb: "TRIDARMA" },
  { p1: "APRI", p2: "SODIK", pb: "KEDIRI" },
  { p1: "KO DIDIK", p2: "ANDRE", pb: "TIMUR JAYA" },
];

const fixedPositionRules = [
  { p1: "JADUL", p2: "GUGUS", index: 0 },
  { p1: "WAWAN", p2: "OKEM", index: 1 },
  { p1: "ALI", p2: "ROBY", index: 6 },
  { p1: "HAQI", p2: "BUDI DNR", index: 7 },
  { p1: "BAGUS", p2: "FARUQ", index: 8 },
  { p1: "ABAH BAGIO", p2: "BABAR", index: 10 },
  { p1: "ASRUL", p2: "PENDIK", index: 11 },
  { p1: "HAMZAH", p2: "SAFI'I", index: 12 },
  { p1: "REHAN", p2: "RIO", index: 15 },
  { p1: "FRENGKY", p2: "ANGGA", index: 16 },
  { p1: "RIO", p2: "DIKA", index: 17 },
  { p1: "FIRMAN", p2: "MANTRI", index: 18 },
  { p1: "YOGI", p2: "HUSEN", index: 19 },
  { p1: "DAFA", p2: "RENO", index: 20 },
  { p1: "RIO", p2: "ILHAM", index: 21 },
  { p1: "RIDHO", p2: "DINO", index: 22 },
  { p1: "JOHAN", p2: "HERU", index: 23 },
  { p1: "RONI", p2: "SAIFUL", index: 24 },
  { p1: "MUKIDI", p2: "SANTOS", index: 25 },
  { p1: "FAIQ", p2: "HUDA", index: 28 },
  { p1: "KABUL", p2: "HASAN", index: 29 },
  { p1: "JUNED", p2: "AHMAD", index: 30 },
  { p1: "DONI", p2: "YUYUT", index: 31 },
  { p1: "MAHMUD", p2: "WASIS", index: 32 },
  { p1: "MUNIR", p2: "UNTUNG", index: 33 },
  { p1: "DADANG", p2: "ROFIQ", index: 34 },
  { p1: "DANIL", p2: "ZEIN", index: 36 },
  { p1: "ALFARO", p2: "AAN", index: 37 },
  { p1: "TONI", p2: "FEBRI", index: 39 },
  { p1: "RAHMA", p2: "RIADI", index: 41 },
  { p1: "ARIF", p2: "NANANG", index: 42 },
  { p1: "SLAMET", p2: "WAHYU", index: 45 },
  { p1: "HILMAN", p2: "YERI", index: 46 },
  { p1: "AAN", p2: "SUBEKI", index: 49 },
  { p1: "ICANG", p2: "HARI", index: 50 },
  { p1: "JUNED", p2: "SULTON CIPALI", index: 51 },
  { p1: "ROY", p2: "SONI", index: 52 },
  { p1: "ARIFIN", p2: "AUREL", index: 56 },
  { p1: "APING", p2: "YUDHA", index: 58 },
  { p1: "DADANG", p2: "ROFIQ", index: 59 },
  { p1: "AZMI", p2: "WAYANG", index: 64 },
  { p1: "MUSLIH", p2: "FAISOL", index: 65 },
  { p1: "YANTO", p2: "ROZAQ", index: 66 },
];

const TOTAL_PAIRS = pairs_data.length;
const allNames = pairs_data.flatMap((p) => [p.p1, p.p2]);
const getRandomName = () => allNames[Math.floor(Math.random() * allNames.length)];
const firstRoundMatchups = getFirstRoundMatchups(TOTAL_PAIRS);

export default function GradeCD() {
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
