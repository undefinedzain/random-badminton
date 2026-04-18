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

  const { leftRounds, rightRounds, leftHasPrelim, rightHasPrelim } = useMemo(() => {
    if (!teams || teams.length === 0)
      return { leftRounds: [], rightRounds: [], leftHasPrelim: false, rightHasPrelim: false };

    // Split teams evenly between left and right
    const halfCount = Math.ceil(teams.length / 2);
    const leftTeamsRaw = teams.slice(0, halfCount);
    const rightTeamsRaw = teams.slice(halfCount);

    const buildHalfRounds = (halfTeams, seedOffset) => {
      const N = halfTeams.length;
      if (N <= 1) return { rounds: [], hasPrelim: false };

      // Largest power of 2 <= N for main bracket size
      let P = Math.pow(2, Math.floor(Math.log2(Math.max(N, 2))));
      let extra = N - P; // number of preliminary matches needed

      // When extra > P/2, prelim layout breaks — use next power of 2 with byes instead
      if (extra > P / 2) {
        P = P * 2;
        extra = 0;
      }

      const rnds = Math.log2(P);
      const hasPrelim = extra > 0;
      const result = [];

      // Pad with byes if needed (when P > N after bumping)
      const paddedTeams = P > N
        ? [...halfTeams, ...Array.from({ length: P - N }, () => ({ name: null, isBye: true }))]
        : halfTeams;

      // Direct teams (bypass preliminary)
      const directTeams = paddedTeams.slice(0, P - extra);
      // Preliminary teams (play preliminary round)
      const prelimTeams = paddedTeams.slice(P - extra);

      // Add preliminary round if needed
      if (hasPrelim) {
        const prelim = [];
        const mainR1Count = P / 2;
        for (let i = 0; i < mainR1Count; i++) {
          if (i >= mainR1Count - extra) {
            const pIdx = i - (mainR1Count - extra);
            prelim.push({
              top: prelimTeams[pIdx * 2],
              bot: prelimTeams[pIdx * 2 + 1],
              seedTop: seedOffset + (P - extra) + pIdx * 2 + 1,
              seedBot: seedOffset + (P - extra) + pIdx * 2 + 2,
              isPrelim: true,
            });
          } else {
            prelim.push({ top: { name: null }, bot: { name: null }, isEmpty: true });
          }
        }
        result.push(prelim);
      }

      // First main round
      const r0 = [];
      let dIdx = 0;
      const mainR1Count = P / 2;
      for (let i = 0; i < mainR1Count; i++) {
        if (hasPrelim && i >= mainR1Count - extra) {
          // One direct team + one TBD from preliminary
          r0.push({
            top: directTeams[dIdx],
            bot: { name: null },
            seedTop: seedOffset + dIdx + 1,
            seedBot: null,
          });
          dIdx++;
        } else {
          r0.push({
            top: directTeams[dIdx],
            bot: directTeams[dIdx + 1],
            seedTop: seedOffset + dIdx + 1,
            seedBot: seedOffset + dIdx + 2,
          });
          dIdx += 2;
        }
      }
      result.push(r0);

      // Remaining main rounds
      for (let r = 1; r < rnds; r++) {
        const prev = result[result.length - 1];
        const curr = [];
        for (let i = 0; i < prev.length; i += 2) {
          curr.push({ top: { name: null }, bot: { name: null } });
        }
        result.push(curr);
      }

      return { rounds: result, hasPrelim };
    };

    const left = buildHalfRounds(leftTeamsRaw, 0);
    const right = buildHalfRounds(rightTeamsRaw, leftTeamsRaw.length);

    return {
      leftRounds: left.rounds,
      rightRounds: right.rounds,
      leftHasPrelim: left.hasPrelim,
      rightHasPrelim: right.hasPrelim,
    };
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
          if (currentRound[m].isEmpty) continue;

          const el = matchRefs.current[`${sidePrefix}-${r}`]?.[m];
          if (!el) continue;

          let nextEl;
          if (isLastSideRound) {
            nextEl = matchRefs.current["final"]?.[0];
          } else {
            // 1:1 mapping for preliminary→main round, 2:1 for normal rounds
            const nextRoundLen = sideRounds[r + 1]?.length;
            const nextM = currentRound.length === nextRoundLen ? m : Math.floor(m / 2);
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

  const getRoundName = (rIdx, totalSideRounds, hasPrelim) => {
    if (hasPrelim && rIdx === 0) return "Preliminary";
    const mainRIdx = hasPrelim ? rIdx - 1 : rIdx;
    const mainTotal = hasPrelim ? totalSideRounds - 1 : totalSideRounds;
    const remaining = mainTotal - mainRIdx;
    if (remaining === 1) return "Semi Final";
    if (remaining === 2) return "Quarter Final";
    if (remaining === 3) return "Round of 16";
    if (remaining === 4) return "Round of 32";
    return `Round ${mainRIdx + 1}`;
  };

  const setMatchRef = (roundKey, mIdx, el) => {
    if (!matchRefs.current[roundKey]) matchRefs.current[roundKey] = {};
    matchRefs.current[roundKey][mIdx] = el;
  };

  const renderMatch = (match, rIdx, mIdx, roundKey) => {
    if (match.isEmpty) {
      return <div key={mIdx} className="bkt-slot" />;
    }
    return (
      <div
        key={mIdx}
        className="bkt-slot"
        ref={(el) => setMatchRef(roundKey, mIdx, el)}
      >
        <div className="bkt-match">
          <div className={`bkt-team ${!match.top.name ? "bkt-team--empty" : ""}`}>
            {match.seedTop != null && <span className="bkt-seed">{match.seedTop}</span>}
            <span className="bkt-name">{match.top.name || (match.top.isBye ? "BYE" : "—")}</span>
          </div>
          <div className={`bkt-team ${!match.bot.name ? "bkt-team--empty" : ""}`}>
            {match.seedBot != null && <span className="bkt-seed">{match.seedBot}</span>}
            <span className="bkt-name">{match.bot.name || (match.bot.isBye ? "BYE" : "—")}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bkt-container" ref={containerRef}>
      {/* Round labels */}
      <div className="bkt-labels">
        {leftRounds.map((_, rIdx) => (
          <div key={`ll-${rIdx}`} className="bkt-label">
            {getRoundName(rIdx, leftRounds.length, leftHasPrelim)}
          </div>
        ))}
        <div className="bkt-label bkt-label--champ"><Trophy className="inline-block w-4 h-4 mr-1" /> Final</div>
        {[...rightRounds].reverse().map((_, rIdx) => (
          <div key={`rl-${rIdx}`} className="bkt-label">
            {getRoundName(rightRounds.length - 1 - rIdx, rightRounds.length, rightHasPrelim)}
          </div>
        ))}
      </div>

      {/* Bracket body */}
      <div className="bkt-body">
        {/* LEFT side rounds */}
        {leftRounds.map((matches, rIdx) => (
          <div key={`L-${rIdx}`} className="bkt-round">
            {matches.map((match, mIdx) =>
              renderMatch(match, rIdx, mIdx, `L-${rIdx}`)
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
                renderMatch(match, rIdx, mIdx, `R-${rIdx}`)
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
