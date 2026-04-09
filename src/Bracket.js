import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Trophy } from "lucide-react";
import "./Bracket.css";

/**
 * Dual-sided single-elimination tournament bracket.
 * Left half of teams on the left, right half on the right, final in the center.
 */
export default function Bracket({ teams }) {
  const containerRef = useRef(null);
  const matchRefs = useRef({});
  const [lines, setLines] = useState([]);

  const { leftRounds, rightRounds } = useMemo(() => {
    if (!teams || teams.length === 0)
      return { leftRounds: [], rightRounds: [], rounds: 0 };

    const totalSlots = Math.pow(2, Math.ceil(Math.log2(Math.max(teams.length, 2))));
    const rnds = Math.log2(totalSlots);

    const paddedTeams = [...teams];
    while (paddedTeams.length < totalSlots) {
      paddedTeams.push({ name: null, isBye: true });
    }

    // Split into two halves
    const half = paddedTeams.length / 2;
    const leftTeams = paddedTeams.slice(0, half);
    const rightTeams = paddedTeams.slice(half);

    const buildHalfRounds = (halfTeams, seedOffset) => {
      const result = [];
      const r0 = [];
      for (let i = 0; i < halfTeams.length; i += 2) {
        r0.push({
          top: halfTeams[i],
          bot: halfTeams[i + 1],
          seedTop: seedOffset + i + 1,
          seedBot: seedOffset + i + 2,
        });
      }
      result.push(r0);

      for (let r = 1; r < rnds - 1; r++) {
        const prev = result[r - 1];
        const curr = [];
        for (let i = 0; i < prev.length; i += 2) {
          curr.push({ top: { name: null }, bot: { name: null } });
        }
        result.push(curr);
      }
      // Last round before final: 1 match
      if (rnds > 1) {
        const prev = result[result.length - 1];
        if (prev.length > 1) {
          const curr = [];
          for (let i = 0; i < prev.length; i += 2) {
            curr.push({ top: { name: null }, bot: { name: null } });
          }
          result.push(curr);
        }
      }
      return result;
    };

    const left = buildHalfRounds(leftTeams, 0);
    const right = buildHalfRounds(rightTeams, half);

    return { leftRounds: left, rightRounds: right };
  }, [teams]);

  const computeLines = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines = [];

    // Helper: compute connector lines for a side
    const computeSideLines = (sideRounds, side, sidePrefix) => {
      for (let r = 0; r < sideRounds.length; r++) {
        const currentRound = sideRounds[r];
        // Next round: either next in sideRounds, or the final
        const isLastSideRound = r === sideRounds.length - 1;

        for (let m = 0; m < currentRound.length; m++) {
          const el = matchRefs.current[`${sidePrefix}-${r}`]?.[m];
          if (!el) continue;

          let nextEl;
          if (isLastSideRound) {
            nextEl = matchRefs.current["final"]?.[0];
          } else {
            const nextM = Math.floor(m / 2);
            nextEl = matchRefs.current[`${sidePrefix}-${r + 1}`]?.[nextM];
          }
          if (!nextEl) continue;

          const rect = el.getBoundingClientRect();
          const nextRect = nextEl.getBoundingClientRect();

          const y1 = rect.top + rect.height / 2 - containerRect.top;
          const yEnd = nextRect.top + nextRect.height / 2 - containerRect.top;

          if (side === "left") {
            const x1 = rect.right - containerRect.left;
            const x2 = nextRect.left - containerRect.left;
            const xMid = (x1 + x2) / 2;
            newLines.push({ x1, y1, xMid, x2, yEnd, key: `${sidePrefix}-${r}-${m}` });
          } else {
            // Right side: connector goes from left edge of match to right edge of next
            const x1 = rect.left - containerRect.left;
            const x2 = nextRect.right - containerRect.left;
            const xMid = (x1 + x2) / 2;
            newLines.push({ x1, y1, xMid, x2, yEnd, key: `${sidePrefix}-${r}-${m}` });
          }
        }
      }
    };

    computeSideLines(leftRounds, "left", "L");
    computeSideLines(rightRounds, "right", "R");

    setLines(newLines);
  }, [leftRounds, rightRounds]);

  useEffect(() => {
    const timer = setTimeout(computeLines, 50);
    window.addEventListener("resize", computeLines);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", computeLines);
    };
  }, [computeLines]);

  if (!teams || teams.length === 0) return null;

  const getRoundName = (rIdx, totalSideRounds) => {
    const remaining = totalSideRounds - rIdx;
    if (remaining === 1) return "Semi Final";
    if (remaining === 2) return "Quarter Final";
    if (remaining === 3) return "Round of 16";
    if (remaining === 4) return "Round of 32";
    return `Round ${rIdx + 1}`;
  };

  const setMatchRef = (roundKey, mIdx, el) => {
    if (!matchRefs.current[roundKey]) matchRefs.current[roundKey] = {};
    matchRefs.current[roundKey][mIdx] = el;
  };

  const renderMatch = (match, rIdx, mIdx, roundKey, isFirstRound) => (
    <div
      key={mIdx}
      className="bkt-slot"
      ref={(el) => setMatchRef(roundKey, mIdx, el)}
    >
      <div className="bkt-match">
        <div className={`bkt-team ${!match.top.name ? "bkt-team--empty" : ""}`}>
          {isFirstRound && <span className="bkt-seed">{match.seedTop}</span>}
          <span className="bkt-name">{match.top.name || (match.top.isBye ? "BYE" : "—")}</span>
        </div>
        <div className={`bkt-team ${!match.bot.name ? "bkt-team--empty" : ""}`}>
          {isFirstRound && <span className="bkt-seed">{match.seedBot}</span>}
          <span className="bkt-name">{match.bot.name || (match.bot.isBye ? "BYE" : "—")}</span>
        </div>
      </div>
    </div>
  );

  const totalSideRounds = leftRounds.length;

  return (
    <div className="bkt-container" ref={containerRef}>
      {/* Round labels */}
      <div className="bkt-labels">
        {leftRounds.map((_, rIdx) => (
          <div key={`ll-${rIdx}`} className="bkt-label">
            {getRoundName(rIdx, totalSideRounds)}
          </div>
        ))}
        <div className="bkt-label bkt-label--champ"><Trophy className="inline-block w-4 h-4 mr-1" /> Final</div>
        {[...rightRounds].reverse().map((_, rIdx) => (
          <div key={`rl-${rIdx}`} className="bkt-label">
            {getRoundName(rightRounds.length - 1 - rIdx, totalSideRounds)}
          </div>
        ))}
      </div>

      {/* Bracket body */}
      <div className="bkt-body">
        {/* LEFT side rounds */}
        {leftRounds.map((matches, rIdx) => (
          <div key={`L-${rIdx}`} className="bkt-round">
            {matches.map((match, mIdx) =>
              renderMatch(match, rIdx, mIdx, `L-${rIdx}`, rIdx === 0)
            )}
          </div>
        ))}

        {/* CENTER: Final / Champion */}
        <div className="bkt-round bkt-round--final">
          <div
            className="bkt-slot"
            ref={(el) => setMatchRef("final", 0, el)}
          >
            <div className="bkt-champ">
              <div className="bkt-champ-icon"><Trophy className="w-8 h-8 mx-auto text-green-500" /></div>
              <div className="bkt-champ-label text-green-500">Juara</div>
            </div>
          </div>
        </div>

        {/* RIGHT side rounds (reversed: innermost first, outermost last) */}
        {[...rightRounds].reverse().map((matches, revIdx) => {
          const rIdx = rightRounds.length - 1 - revIdx;
          return (
            <div key={`R-${rIdx}`} className="bkt-round">
              {matches.map((match, mIdx) =>
                renderMatch(match, rIdx, mIdx, `R-${rIdx}`, rIdx === 0)
              )}
            </div>
          );
        })}

        {/* SVG connectors */}
        <svg className="bkt-svg">
          {lines.map((l) => (
            <g key={l.key}>
              <line x1={l.x1} y1={l.y1} x2={l.xMid} y2={l.y1} stroke="#94a3b8" strokeWidth="2" />
              <line x1={l.xMid} y1={l.y1} x2={l.xMid} y2={l.yEnd} stroke="#94a3b8" strokeWidth="2" />
              <line x1={l.xMid} y1={l.yEnd} x2={l.x2} y2={l.yEnd} stroke="#94a3b8" strokeWidth="2" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
