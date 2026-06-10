// NYS Utility Governance Map — force-directed graph with tiered-layout mode

const TYPE_META = {
  fedlaw:      { label: "Federal law",      hex: "#0bc5ea", shape: d3.symbolSquare },
  law:         { label: "State law",        hex: "#68d391", shape: d3.symbolSquare },
  case:        { label: "Case law",         hex: "#fbd38d", shape: d3.symbolDiamond },
  federal:     { label: "Federal / market", hex: "#a0aec0", shape: d3.symbolCircle },
  regulator:   { label: "Regulator",        hex: "#4f9cf9", shape: d3.symbolCircle },
  authority:   { label: "Public authority", hex: "#38b2ac", shape: d3.symbolCircle },
  executive:   { label: "Executive",        hex: "#9f7aea", shape: d3.symbolCircle },
  legislature: { label: "Legislature",      hex: "#ed8936", shape: d3.symbolCircle },
  oversight:   { label: "Oversight",        hex: "#ecc94b", shape: d3.symbolCircle },
  utility:     { label: "Utility",          hex: "#f56565", shape: d3.symbolCircle },
  process:     { label: "Process",          hex: "#f687b3", shape: d3.symbolCircle }
};
const SECTORS = ["electric", "gas", "steam", "water", "telecom"];

// Tier rows for the layered layout (top → bottom = federal → companies)
const TIERS = [
  { label: "Federal law & institutions", types: ["fedlaw", "federal"] },
  { label: "Case law",                   types: ["case"] },
  { label: "State law",                  types: ["law"] },
  { label: "Elected & oversight",        types: ["legislature", "executive", "oversight"] },
  { label: "Regulators & authorities",   types: ["regulator", "authority"] },
  { label: "Regulatory processes",       types: ["process"] },
  { label: "Utilities & companies",      types: ["utility"] }
];
const TIER_OF = {};
TIERS.forEach((t, i) => t.types.forEach(ty => { TIER_OF[ty] = i; }));

const nodeById = new Map(NODES.map(n => [n.id, n]));
const degree = {};
LINKS.forEach(l => {
  degree[l.source] = (degree[l.source] || 0) + 1;
  degree[l.target] = (degree[l.target] || 0) + 1;
});
let sizeScale = 1, distScale = 1;
const radius = n => (8 + Math.min(14, (degree[n.id] || 1) * 1.2)) * sizeScale;

// ── filters state ──
const activeTypes = new Set(Object.keys(TYPE_META));
const activeSectors = new Set(SECTORS);
let searchTerm = "";
let selectedId = null;
let mode = "force";

// ── build filter chips ──
const typeBox = document.getElementById("type-filters");
Object.entries(TYPE_META).forEach(([key, meta]) => {
  const chip = document.createElement("span");
  chip.className = "chip active";
  const mark = meta.shape === d3.symbolSquare ? "■" : meta.shape === d3.symbolDiamond ? "◆" : "●";
  chip.innerHTML = `<span class="dot" style="color:${meta.hex}">${mark}</span>${meta.label}`;
  chip.onclick = () => { toggle(activeTypes, key, chip); };
  typeBox.appendChild(chip);
});
const sectorBox = document.getElementById("sector-filters");
SECTORS.forEach(s => {
  const chip = document.createElement("span");
  chip.className = "chip active";
  chip.textContent = s;
  chip.onclick = () => { toggle(activeSectors, s, chip); };
  sectorBox.appendChild(chip);
});
function toggle(set, key, chip) {
  if (set.has(key)) { set.delete(key); chip.classList.remove("active"); chip.classList.add("dimmed"); }
  else { set.add(key); chip.classList.add("active"); chip.classList.remove("dimmed"); }
  applyVisibility();
}

document.getElementById("search").addEventListener("input", e => {
  searchTerm = e.target.value.trim().toLowerCase();
  applyVisibility();
});
document.getElementById("reset").onclick = () => {
  document.getElementById("search").value = "";
  searchTerm = "";
  activeTypes.clear(); Object.keys(TYPE_META).forEach(k => activeTypes.add(k));
  activeSectors.clear(); SECTORS.forEach(s => activeSectors.add(s));
  document.querySelectorAll(".chip").forEach(c => { c.classList.add("active"); c.classList.remove("dimmed"); });
  sizeScale = 1; distScale = 1;
  document.getElementById("size-slider").value = 1;
  document.getElementById("dist-slider").value = 1;
  refreshSizes();
  applyLayout();
  selectNode(null);
  svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity);
  applyVisibility();
};

// layout segmented control
document.querySelectorAll("#layout-toggle button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll("#layout-toggle button").forEach(b => b.classList.remove("on"));
    btn.classList.add("on");
    mode = btn.dataset.mode;
    applyLayout();
  };
});

// size & spacing sliders
function refreshSizes() {
  nodeSel.select("path")
    .attr("d", d => symbol.type(TYPE_META[d.type].shape).size(radius(d) * radius(d) * 3.6)());
  nodeSel.select("text").attr("dy", d => radius(d) + 14);
  sim.force("collide").radius(d => radius(d) + 17 * sizeScale);
  sim.alpha(0.35).restart();
}
document.getElementById("size-slider").addEventListener("input", e => {
  sizeScale = +e.target.value;
  refreshSizes();
});
document.getElementById("dist-slider").addEventListener("input", e => {
  distScale = +e.target.value;
  applyLayout(0.5);
});

// ── SVG / simulation ──
const svg = d3.select("#graph");
const W = () => svg.node().clientWidth, H = () => svg.node().clientHeight;

// arrowhead
svg.append("defs").append("marker")
  .attr("id", "arrow").attr("viewBox", "0 -4 8 8")
  .attr("refX", 7).attr("refY", 0)
  .attr("markerWidth", 7).attr("markerHeight", 7)
  .attr("orient", "auto")
  .append("path").attr("d", "M0,-3.5L8,0L0,3.5").attr("fill", "#55687c");

const g = svg.append("g");
const zoom = d3.zoom().scaleExtent([0.25, 4]).on("zoom", e => g.attr("transform", e.transform));
svg.call(zoom).on("dblclick.zoom", null);
svg.on("click", () => selectNode(null));

const links = LINKS.map(d => ({ ...d }));
const nodes = NODES.map(d => ({ ...d }));

const sim = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(115).strength(0.5))
  .force("charge", d3.forceManyBody().strength(-420))
  .force("center", d3.forceCenter(W() / 2, H() / 2))
  .force("collide", d3.forceCollide().radius(d => radius(d) + 17));

// tier band labels (visible only in tiered mode)
const tierLabelSel = g.append("g").selectAll("text")
  .data(TIERS).join("text")
  .attr("class", "tier-label")
  .attr("x", 14)
  .text(d => d.label.toUpperCase());

const linkSel = g.append("g").selectAll("line")
  .data(links).join("line")
  .attr("class", "link-line")
  .attr("marker-end", "url(#arrow)");

const linkLabelSel = g.append("g").selectAll("text")
  .data(links).join("text")
  .attr("class", "link-label")
  .attr("text-anchor", "middle")
  .text(d => d.rel);

const symbol = d3.symbol();
const nodeSel = g.append("g").selectAll("g")
  .data(nodes).join("g")
  .attr("class", "node")
  .call(d3.drag()
    .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.25).restart(); d.fx = d.x; d.fy = d.y; })
    .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
    .on("end", (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }))
  .on("click", (e, d) => { e.stopPropagation(); selectNode(d.id); });

nodeSel.append("path")
  .attr("d", d => symbol.type(TYPE_META[d.type].shape).size(radius(d) * radius(d) * 3.6)())
  .attr("fill", d => TYPE_META[d.type].hex);

nodeSel.append("text")
  .attr("dy", d => radius(d) + 14)
  .attr("text-anchor", "middle")
  .text(d => d.label.length > 40 ? d.label.slice(0, 38) + "…" : d.label);

sim.on("tick", () => {
  // shorten each link so the arrowhead lands at the target's edge
  linkSel.each(function (d) {
    const dx = d.target.x - d.source.x, dy = d.target.y - d.source.y;
    const dist = Math.hypot(dx, dy) || 1;
    const ux = dx / dist, uy = dy / dist;
    const rS = radius(d.source) + 2, rT = radius(d.target) + 6;
    d3.select(this)
      .attr("x1", d.source.x + ux * rS).attr("y1", d.source.y + uy * rS)
      .attr("x2", d.target.x - ux * rT).attr("y2", d.target.y - uy * rT);
  });
  linkLabelSel
    .attr("x", d => (d.source.x + d.target.x) / 2)
    .attr("y", d => (d.source.y + d.target.y) / 2 - 4);
  nodeSel.attr("transform", d => `translate(${d.x},${d.y})`);
});

// ── layout switching ──
function tierY(i) {
  const pad = 80;
  return pad + i * ((H() - 2 * pad) / (TIERS.length - 1));
}
function applyLayout(alpha = 0.9) {
  sim.force("link").distance(115 * distScale);
  if (mode === "tiers") {
    sim.force("center", null)
      .force("x", d3.forceX(W() / 2).strength(0.05))
      .force("y", d3.forceY(d => tierY(TIER_OF[d.type])).strength(0.6))
      .force("charge", d3.forceManyBody().strength(-240 * distScale));
    sim.force("link").strength(0.03);
    tierLabelSel.attr("y", (d, i) => tierY(i) - 38).classed("visible", true);
  } else {
    sim.force("x", null).force("y", null)
      .force("center", d3.forceCenter(W() / 2, H() / 2))
      .force("charge", d3.forceManyBody().strength(-420 * distScale));
    sim.force("link").strength(0.5);
    tierLabelSel.classed("visible", false);
  }
  sim.alpha(alpha).restart();
}

window.addEventListener("resize", () => { applyLayout(); });

// ── visibility (filters + search) ──
function nodeVisible(d) {
  if (!activeTypes.has(d.type)) return false;
  if (!d.sectors.some(s => activeSectors.has(s))) return false;
  if (searchTerm && !(d.label.toLowerCase().includes(searchTerm) || d.id.includes(searchTerm))) return false;
  return true;
}
function applyVisibility() {
  const vis = new Set(nodes.filter(nodeVisible).map(d => d.id));
  nodeSel.classed("faded", d => !vis.has(d.id));
  linkSel.classed("faded", d => !vis.has(d.source.id) || !vis.has(d.target.id));
  if (selectedId && !vis.has(selectedId)) selectNode(null);
}

// ── selection / detail panel ──
const panel = document.getElementById("panel");
function neighborsOf(id) {
  const ids = new Set([id]);
  links.forEach(l => {
    if (l.source.id === id) ids.add(l.target.id);
    if (l.target.id === id) ids.add(l.source.id);
  });
  return ids;
}

function selectNode(id) {
  selectedId = id;
  if (!id) {
    panel.classList.add("hidden");
    nodeSel.classed("selected", false);
    linkSel.classed("highlight", false);
    linkLabelSel.classed("visible", false);
    applyVisibility();
    return;
  }
  const d = nodeById.get(id);
  const hood = neighborsOf(id);

  nodeSel.classed("selected", n => n.id === id)
         .classed("faded", n => !hood.has(n.id));
  linkSel.classed("highlight", l => l.source.id === id || l.target.id === id)
         .classed("faded", l => !(l.source.id === id || l.target.id === id));
  linkLabelSel.classed("visible", l => l.source.id === id || l.target.id === id);

  const meta = TYPE_META[d.type];
  const badge = document.getElementById("panel-type");
  badge.textContent = meta.label;
  badge.style.color = meta.hex;
  document.getElementById("panel-title").textContent = d.label;
  document.getElementById("panel-sectors").innerHTML =
    d.sectors.map(s => `<span class="sector-tag">${s}</span>`).join("");
  document.getElementById("panel-body").innerHTML = `<p>${d.blurb}</p>`;

  const ul = document.getElementById("panel-links");
  ul.innerHTML = "";
  links.filter(l => l.source.id === id || l.target.id === id).forEach(l => {
    const other = l.source.id === id ? l.target : l.source;
    const dir = l.source.id === id ? "→" : "←";
    const li = document.createElement("li");
    li.innerHTML = `${dir} <a data-id="${other.id}">${nodeById.get(other.id).label}</a>
                    <span class="rel"> — ${l.rel}</span>`;
    li.querySelector("a").onclick = ev => { ev.preventDefault(); selectNode(other.id); };
    ul.appendChild(li);
  });

  const src = document.getElementById("panel-source");
  src.href = d.link;
  panel.classList.remove("hidden");
}
document.getElementById("panel-close").onclick = () => selectNode(null);

// start with the PSC selected so the panel demonstrates itself
setTimeout(() => selectNode("psc"), 900);
