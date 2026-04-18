export const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export const getFirstRoundMatchups = (totalTeams) => {
  const matchups = [];
  const computeHalf = (n, offset) => {
    const P = Math.pow(2, Math.floor(Math.log2(Math.max(n, 2))));
    const extra = n - P;
    const mainR1Count = P / 2;

    for (let i = 0; i < extra; i++) {
      const idx1 = offset + (P - extra) + i * 2;
      const idx2 = offset + (P - extra) + i * 2 + 1;
      matchups.push([idx1, idx2]);
    }

    let dIdx = 0;
    for (let i = 0; i < mainR1Count; i++) {
      if (i >= mainR1Count - extra) {
        const directIdx = offset + dIdx;
        const pRelIdx = i - (mainR1Count - extra);
        const prelimIdx1 = offset + (P - extra) + pRelIdx * 2;
        const prelimIdx2 = offset + (P - extra) + pRelIdx * 2 + 1;
        matchups.push([directIdx, prelimIdx1]);
        matchups.push([directIdx, prelimIdx2]);
        dIdx++;
      } else {
        matchups.push([offset + dIdx, offset + dIdx + 1]);
        dIdx += 2;
      }
    }
  };

  const halfCount = Math.ceil(totalTeams / 2);
  computeHalf(halfCount, 0);
  computeHalf(totalTeams - halfCount, halfCount);
  return matchups;
};

export const generateRandomPairs = (pairsData, fixedRules, matchups) => {
  for (let attempt = 0; attempt < 500; attempt++) {
    let shuffled = shuffle([...pairsData]);

    for (const rule of fixedRules) {
      const currentIdx = shuffled.findIndex(
        (p) => p.p1 === rule.p1 && p.p2 === rule.p2
      );
      if (currentIdx !== -1 && currentIdx !== rule.index) {
        [shuffled[currentIdx], shuffled[rule.index]] = [shuffled[rule.index], shuffled[currentIdx]];
      }
    }

    const hasConflict = matchups.some(
      ([a, b]) => shuffled[a].pb === shuffled[b].pb
    );
    if (!hasConflict) return shuffled;
  }

  console.warn("Could not find arrangement without same-PB first round matchup");
  let shuffled = shuffle([...pairsData]);
  for (const rule of fixedRules) {
    const currentIdx = shuffled.findIndex(
      (p) => p.p1 === rule.p1 && p.p2 === rule.p2
    );
    if (currentIdx !== -1 && currentIdx !== rule.index) {
      [shuffled[currentIdx], shuffled[rule.index]] = [shuffled[rule.index], shuffled[currentIdx]];
    }
  }
  return shuffled;
};
