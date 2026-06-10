// NYS Utility Governance Map — force-directed graph

const TYPE_META = {
  regulator:   { label: "Regulator",        color: "var(--c-regulator)",   hex: "#4f9cf9" },
  authority:   { label: "Public authority", color: "var(--c-authority)",   hex: "#38b2ac" },
  executive:   { label: "Executive",        color: "var(--c-executive)",   hex: "#9f7aea" },
  legislature: { label: "Legislature",      color: "var(--c-legislature)", hex: "#ed8936" },
  oversight:   { label: "Oversight",        color: "var(--c-oversight)",   hex: "#ecc94b" },
  federal:     { label: "Federal / market", color: "var(--c-federal)",     hex: "#a0aec0" },
  utility:     { label: "Utility",          color: "var(--c-utility)",     hex: "#f56565" },
  law:         { label: "Law",              color: "var(--c-law)",         hex: "#68d391" },
  process:     { label: "Process",          color: "var(--c-process)",     hex: "#f687b3" }
};
const SECTORS = ["electric", "gas", "steam", "water", "telecom"];

const nodeById = new Map(NODES.map(n => [n.id, n]));
const degree = {};
LINKS.forEach(l => {
  degree[l.source] = (degree[l.source] || 0) + 1;
  degree[l.target] = (degree[l.target] || 0) + 1;
});
const radius = n => 8 + Math.min(14, (degree[n.id] || 1) * 1.4);

// ── filters state ──
const activeTypes = new Set(Object.keys(TYPE_META));
const activeSectors = new Set(SECTORS);
let searchTerm = "";
let selectedId = null;

// ── build filter chips ──
const typeBox = document.getElementById("type-filters");
Object.entries(TYPE_META).forEach(([key, meta]) => {
  const chip = document.createElement("span");
  chip.className = "chip active";
  chip.innerHTML = `<span class="dot" style="background:${meta.hex}"></span>${meta.label}`;
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
  selectNode(null);
  svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity);
  applyVisibility();
};

// ── SVG / simulation ──
const svg = d3.select("#graph");
const g = svg.append("g");
const W = () => svg.node().clientWidth, H = () => svg.node().clientHeight;

const zoom = d3.zoom().scaleExtent([0.3, 4]).on("zoom", e => g.attr("transform", e.transform));
svg.call(zoom).on("dblclick.zoom", null);
svg.on("click", () => selectNode(null));

const links = LINKS.map(d => ({ ...d }));
const nodes = NODES.map(d => ({ ...d }));

const sim = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(110).strength(0.5))
  .force("charge", d3.forceManyBody().strength(-420))
  .force("center", d3.forceCenter(W() / 2, H() / 2))
  .force("collide", d3.forceCollide().radius(d => radius(d) + 16));

const linkSel = g.append("g").selectAll("line")
  .data(links).join("line").attr("class", "link-line");

const linkLabelSel = g.append("g").selectAll("text")
  .data(links).join("text")
  .attr("class", "link-label")
  .attr("text-anchor", "middle")
  .text(d => d.rel);

const nodeSel = g.append("g").selectAll("g")
  .data(nodes).join("g")
  .attr("class", "node")
  .call(d3.drag()
    .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.25).restart(); d.fx = d.x; d.fy = d.y; })
    .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
    .on("end", (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }))
  .on("click", (e, d) => { e.stopPropagation(); selectNode(d.id); });

nodeSel.append("circle")
  .attr("r", d => radius(d))
  .attr("fill", d => TYPE_META[d.type].hex);

nodeSel.append("text")
  .attr("dy", d => radius(d) + 13)
  .attr("text-anchor", "middle")
  .text(d => d.label.length > 38 ? d.label.slice(0, 36) + "…" : d.label);

sim.on("tick", () => {
  linkSel
    .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
  linkLabelSel
    .attr("x", d => (d.source.x + d.target.x) / 2)
    .attr("y", d => (d.source.y + d.target.y) / 2 - 4);
  nodeSel.attr("transform", d => `translate(${d.x},${d.y})`);
});

window.addEventListener("resize", () => {
  sim.force("center", d3.forceCenter(W() / 2, H() / 2)).alpha(0.3).restart();
});

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
