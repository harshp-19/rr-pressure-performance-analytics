"use strict";

const data = window.RR_DEMO;
const byId = id => document.getElementById(id);
const number = value => Number(value).toLocaleString("en", {maximumFractionDigits: 0});
const fixed = (value, places = 1) => value === "" ? "—" : Number(value).toFixed(places);
const percentage = value => fixed(Number(value) * 100, 2).replace(/\.?0+$/, "") + "%";

function element(tag, content = "", className = "") {
  const node = document.createElement(tag);
  node.className = className;
  node.append(content);
  return node;
}

function add(parent, ...children) {
  parent.append(...children);
  return parent;
}

function link(label, url) {
  const node = element("a", label);
  node.href = url;
  return node;
}

function metric(value, label) {
  return add(element("div", "", "metric"), element("strong", value), element("span", label));
}

function table(label, columns, rows, className = "") {
  const scroll = element("div", "", "table-scroll");
  scroll.tabIndex = 0;
  scroll.setAttribute("role", "region");
  scroll.setAttribute("aria-label", label);
  const table = element("table", "", className);
  const head = table.createTHead().insertRow();
  for (const [heading, , style] of columns) {
    const cell = element("th", heading, style);
    cell.scope = "col";
    head.append(cell);
  }
  const body = table.createTBody();
  for (const row of rows) {
    const tr = body.insertRow();
    for (const [, read, style] of columns) {
      const isPlayer = style === "player";
      const cell = element(isPlayer ? "th" : "td", read(row), style);
      if (isPlayer) cell.scope = "row";
      tr.append(cell);
    }
  }
  return add(scroll, table);
}

function player(row, detail = false) {
  const name = element("span", row.player_name);
  const category = row.rr_shortlist_category;
  if (category === "Retention consideration") name.append(" ", element("span", "Squad", "pill"));
  if (category === "Non-actionable") name.append(" ", element("span", "Non-actionable", "pill flag"));
  if (detail) name.append(element("small", row.country + " · " + row.style));
  return name;
}

function score(row) {
  const value = element("span", fixed(row.composite_score, 2));
  value.title = "Example score " + row.composite_score;
  const track = element("span", "", "track");
  track.setAttribute("aria-hidden", "true");
  const bar = element("i");
  bar.style.width = (100 * Number(row.composite_score) / 2) + "%";
  return add(value, add(track, bar));
}

byId("metrics").append(
  metric(number(data.matches), "Matches analysed"),
  metric(number(data.pressureBalls), "High-leverage chase balls"),
  metric(number(data.counts.batters), "Eligible batters scored"),
  metric(number(data.counts.bowlers), "Eligible bowlers scored")
);

for (const role of ["batters", "bowlers"]) {
  const batting = role === "batters";
  const label = batting ? "Batters" : "Bowlers";
  const rows = data[role].filter(row => Number(row.rank) <= 10);
  const rank = ["#", row => row.rank, "rank numeric"];
  const scoreColumn = ["Score", score, "score numeric"];
  const smallTable = table(label + " overview", [rank, ["Player", row => player(row), "player"], scoreColumn], rows);
  byId("leaders").append(add(
    element("article", "", "panel " + role),
    add(element("div", "", "panel-head"), element("h3", "Top 10 " + role), link("Full rankings", "#" + role)),
    smallTable
  ));
  const mainColumns = [
    rank, ["Player", row => player(row, true), "player"], scoreColumn,
    ["Pressure balls", row => number(row.chase_high_pressure_balls), "numeric"],
    [batting ? "Pressure innings (6+ balls)" : "Pressure spells (6+ balls)", row => number(row.pressure_innings_or_spells_6plus_balls), "numeric"],
    ["Bootstrap Top 10", row => percentage(row.boot_top10_freq), "numeric"],
    batting ? ["Strike rate", row => fixed(row.hp_SR), "numeric"] : ["Economy", row => fixed(row.hp_econ), "numeric"],
    batting ? ["Dismissals / 100", row => fixed(row.hp_dis100), "numeric"] : ["Wickets / 100", row => fixed(row.hp_wk100), "numeric"]
  ];
  const ranking = table(label + " full rankings", mainColumns, rows, "full-table");
  const rankCaption = ranking.firstElementChild.createCaption();
  rankCaption.textContent = "Composite score bars share a 0–2 scale. Bootstrap percentages show the demo fixture precision. Scroll horizontally to see more columns on small screens.";
  const additional = table(label + " exposure and phase mix", [
    rank, ["Player", row => row.player_name, "player"],
    ["Matches", row => number(row.independent_matches_with_high_pressure_balls), "numeric"],
    ["IPL pressure balls", row => row.hp_ipl_balls, "numeric"],
    ["Powerplay", row => percentage(row.hp_pp_share), "numeric"],
    ["Middle", row => percentage(row.hp_mid_share), "numeric"],
    ["Death", row => percentage(row.hp_death_share), "numeric"],
    ["Ordinary-ball rank", row => row.rank_by_ordinary_value, "numeric"]
  ], rows, "full-table");
  byId(role + "-data").append(
    add(element("div", "", "panel " + role), ranking),
    add(element("details", "", "panel detail"), element("summary", "Match exposure, phase mix and ordinary-ball rank"), additional)
  );
}

const chase = data.models.find(row => row.innings.startsWith("2nd") && row.model.includes("(selected)"));
const first = data.models.find(row => row.innings.startsWith("1st") && row.model.includes("(selected)"));
byId("model-metrics").append(
  metric(fixed(chase.auc, 3), "Chase model AUC"),
  metric(fixed(chase.brier, 3), "Chase Brier score"),
  metric(fixed(chase.ece, 3), "Chase calibration error"),
  metric(fixed(first.auc, 2), "First-innings model AUC")
);

function renderSensitivity() {
  const role = byId("sensitivity-role").value;
  byId("sensitivity-data").replaceChildren(table("Sensitivity results for " + role, [
    ["Alternative", row => row.variant, "player"],
    ["Eligible pool", row => row.pool, "numeric"],
    ["Common players", row => row.n_common, "numeric"],
    ["Rank correlation", row => fixed(row.spearman_vs_base, 3), "numeric"],
    ["Top 10 overlap", row => row.top10_overlap + " / 10", "numeric"]
  ], data.sensitivity.filter(row => row.role === role)));
}
byId("sensitivity-role").addEventListener("change", renderSensitivity);
renderSensitivity();

for (const row of data.repeatability) {
  const label = row.role === "bat" ? "Batters" : "Bowlers";
  byId("repeatability").append(metric("r = " + fixed(row.split_half_r_mean, 2), label + " · split-half repeatability"));
}

const groups = [
  ["Retention consideration", "Retention considerations", "Illustrative existing squad players."],
  ["Conditional target", "Conditional targets", "Illustrative options pending confirmation of availability and squad needs."],
  ["Medium target", "Medium-priority targets", "Illustrative options for specific squad roles."],
  ["Evaluate separately (outside Top 10)", "Separate finisher option", "Example of a candidate outside the performance Top 10."],
  ["Non-actionable", "Non-actionable performance selection", "Example of a ranked player with unavailable or unverified playing status."]
];
for (const [category, title, description] of groups) {
  const cards = data.shortlist.filter(row => row.rr_shortlist_category === category).map(row => {
    const ratings = row.role_type === "Batter" ? data.batters : data.bowlers;
    const rating = ratings.find(player => player.player_name === row.player);
    const evidence = number(rating.chase_high_pressure_balls) + " pressure balls · " +
      percentage(rating.boot_top10_freq) + " bootstrap Top 10 · ordinary-ball rank " + rating.rank_by_ordinary_value;
    const card = add(element("article"), element("h3", row.player), element("strong", row.role_type + " #" + row.performance_rank));
    if (category !== "Non-actionable") card.append(element("p", row.rr_role));
    return add(card, element("p", evidence), element("p", row.major_risk));
  });
  byId("shortlist").append(add(
    element("article", "", "panel short-group"),
    add(element("div", "", "panel-head"), element("h3", title)),
    element("p", description),
    add(element("div", "", "short-grid"), ...cards)
  ));
}

const sourceList = element("ol");
const sourceIds = new Set(data.sources.map(row => row.source_id));
for (const row of data.sources) {
  const title = row.source_id + " · " + row.title;
  const heading = /^https:\/\//.test(row.url) ? link(title, row.url) : element("strong", title);
  const item = add(element("li"), heading, element("p", row.publisher + " · " + row.source_type), element("p", row.exact_fact_supported), element("p", row.limitations));
  item.id = "source-" + row.source_id;
  sourceList.append(item);
}
byId("source-data").append(sourceList);

const statuses = data.status.map(row => {
  const card = add(element("article"), element("h3", row.item), element("strong", row.status), element("p", row.basis));
  if (row.limitation) card.append(element("p", row.limitation));
  const sources = element("p");
  for (const match of row.source_ids.matchAll(/(S\d+)(?:-S(\d+))?/g)) {
    const start = Number(match[1].slice(1));
    const end = match[2] ? Number(match[2]) : start;
    for (let index = start; index <= end; index++) {
      const id = "S" + String(index).padStart(2, "0");
      if (!sourceIds.has(id)) continue;
      const reference = link(id, "#source-" + id);
      reference.addEventListener("click", () => {
        document.querySelector(".source-register").open = true;
      });
      sources.append(reference, " ");
    }
  }
  if (sources.childElementCount) card.append(sources);
  return card;
});
byId("status-data").append(add(element("div", "", "status-grid"), ...statuses));

function showCurrentSection() {
  const current = location.hash || "#overview";
  for (const item of document.querySelectorAll("nav a")) {
    if (item.hash === current) item.setAttribute("aria-current", "location");
    else item.removeAttribute("aria-current");
  }
  if (current.startsWith("#source-")) {
    document.querySelector(".source-register").open = true;
    document.getElementById(current.slice(1))?.scrollIntoView();
  }
}
window.addEventListener("hashchange", showCurrentSection);
showCurrentSection();
