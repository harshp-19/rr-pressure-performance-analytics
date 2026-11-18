"use strict";

// Generated fictional examples for UI testing. No match data or player records are used.
(() => {
  const retention = "Retention consideration";
  const conditional = "Conditional target";
  const medium = "Medium target";
  const finisher = "Evaluate separately (outside Top 10)";
  const inactive = "Non-actionable";

  function makeRole(role, count, categories) {
    return Array.from({ length: count }, (_, index) => {
      const rank = index + 1;
      const batter = role === "Batter";
      return {
        rank: String(rank),
        player_name: "Demo " + role + " " + rank,
        rr_shortlist_category: categories[rank] ?? "Not shortlisted",
        country: "Fictional player",
        style: batter ? "Right-hand bat" : "Right-arm pace",
        composite_score: (1.9 - index * 0.13).toFixed(2),
        chase_high_pressure_balls: 90 + rank * 7,
        independent_matches_with_high_pressure_balls: 13 + rank,
        pressure_innings_or_spells_6plus_balls: 8 + rank,
        hp_ipl_balls: 60 + rank,
        hp_pp_share: 0.55 - rank / 100,
        hp_mid_share: 0.25,
        hp_death_share: 0.20 + rank / 100,
        hp_SR: 150 - rank,
        hp_dis100: 4 + rank / 10,
        hp_econ: 7 + rank / 10,
        hp_wk100: 9 - rank / 5,
        boot_top10_freq: (0.8 - index * 0.055).toFixed(3),
        rank_by_ordinary_value: rank + 1
      };
    });
  }

  const batters = makeRole("Batter", 11, {2: retention, 4: medium, 8: conditional, 11: finisher});
  const bowlers = makeRole("Bowler", 10, {2: conditional, 5: inactive, 7: medium});
  const roleNotes = {
    [retention]: "Existing squad depth",
    [conditional]: "Potential role cover",
    [medium]: "Phase specialist",
    [finisher]: "Possible late-overs finisher",
    [inactive]: "Benchmark only"
  };

  function makeShortlist(role, players) {
    return players.flatMap(player => {
      const category = player.rr_shortlist_category;
      return Object.hasOwn(roleNotes, category) ? [{
        player: player.player_name,
        role_type: role,
        performance_rank: player.rank,
        rr_shortlist_category: category,
        rr_role: roleNotes[category],
        major_risk: "Example only. Availability and role fit are hypothetical."
      }] : [];
    });
  }

  window.RR_DEMO = {
    batters,
    bowlers,
    counts: {batters: batters.length, bowlers: bowlers.length},
    matches: 64,
    pressureBalls: 2410,
    models: [
      {innings: "1st (set target)", model: "Example logistic model (selected)", auc: 0.70},
      {innings: "2nd (chase)", model: "Example logistic model (selected)", auc: 0.84, brier: 0.162, ece: 0.011}
    ],
    sensitivity: [
      {role: "batters", variant: "Alternative leverage cutoff", pool: 11, n_common: 10, spearman_vs_base: 0.81, top10_overlap: 9},
      {role: "batters", variant: "Equal composite weights", pool: 11, n_common: 11, spearman_vs_base: 0.90, top10_overlap: 10},
      {role: "bowlers", variant: "Alternative leverage cutoff", pool: 10, n_common: 8, spearman_vs_base: 0.72, top10_overlap: 8},
      {role: "bowlers", variant: "Equal composite weights", pool: 10, n_common: 10, spearman_vs_base: 0.85, top10_overlap: 10}
    ],
    repeatability: [
      {role: "bat", split_half_r_mean: 0.15},
      {role: "bowl", split_half_r_mean: 0.09}
    ],
    shortlist: [...makeShortlist("Batter", batters), ...makeShortlist("Bowler", bowlers)],
    status: [
      {item: "Example squad list", status: "Verified", basis: "Illustrative official source", limitation: "Applies to the example season.", source_ids: "S01"},
      {item: "Example registration report", status: "Reported", basis: "Illustrative secondary coverage", limitation: "Pending official confirmation.", source_ids: "S02"},
      {item: "Example future contracts", status: "Unverified", basis: "No confirmation in the fictional scenario.", limitation: "", source_ids: ""}
    ],
    sources: [
      {source_id: "S01", title: "Fictional squad announcement", publisher: "Example club", source_type: "Illustrative official source", exact_fact_supported: "Example of a squad announcement.", limitations: "Fictional citation."},
      {source_id: "S02", title: "Fictional registration story", publisher: "Example outlet", source_type: "Illustrative media report", exact_fact_supported: "Example of reported registration.", limitations: "Fictional citation."}
    ]
  };
})();
