// NYS Utility Governance Map — force graph with tiers/ring layouts, label decluttering

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
const TYPE_ORDER = Object.keys(TYPE_META);
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

// ── display state ──
let sizeScale = 1, distScale = 1;
let labelMode = "auto";   // auto | all | none
let sizeBy = "degree";    // degree | uniform
let sortBy = "degree";    // degree | alpha
let searchTerm = "";
let selectedId = null;
let hoverId = null;
let mode = "force";       // force | tiers | ring

const radius = n => (sizeBy === "uniform" ? 11 : 8 + Math.min(14, (degree[n.id] || 1) * 1.2)) * sizeScale;
const sortCmp = (a, b) => sortBy === "alpha"
  ? a.label.localeCompare(b.label)
  : (degree[b.id] || 0) - (degree[a.id] || 0) || a.label.localeCompare(b.label);

// ── filters ──
const activeTypes = new Set(TYPE_ORDER);
const activeSectors = new Set(SECTORS);

function buildFilterGroup(container, keys, set, renderChip) {
  const mkBtn = (txt, fn, title) => {
    const b = document.createElement("button");
    b.className = "mini-btn";
    b.textContent = txt;
    if (title) b.title = title;
    b.onclick = fn;
    container.appendChild(b);
    return b;
  };
  const chips = new Map();
  const sync = () => chips.forEach((chip, key) => {
    chip.classList.toggle("active", set.has(key));
    chip.classList.toggle("dimmed", !set.has(key));
  });
  mkBtn("All", () => { keys.forEach(k => set.add(k)); sync(); applyVisibility(); });
  mkBtn("None", () => { set.clear(); sync(); applyVisibility(); },
    container.id === "type-filters" ? "Turn off all nodes" : "Turn off all sectors");
  keys.forEach(key => {
    const chip = document.createElement("span");
    chip.className = "chip active";
    renderChip(chip, key);
    chip.onclick = () => {
      set.has(key) ? set.delete(key) : set.add(key);
      sync(); applyVisibility();
    };
    container.appendChild(chip);
    chips.set(key, chip);
  });
  return sync;
}

const syncTypeChips = buildFilterGroup(
  document.getElementById("type-filters"), TYPE_ORDER, activeTypes,
  (chip, key) => {
    const meta = TYPE_META[key];
    const mark = meta.shape === d3.symbolSquare ? "■" : meta.shape === d3.symbolDiamond ? "◆" : "●";
    chip.innerHTML = `<span class="dot" style="color:${meta.hex}">${mark}</span>${meta.label}`;
  });
const syncSectorChips = buildFilterGroup(
  document.getElementById("sector-filters"), SECTORS, activeSectors,
  (chip, key) => { chip.textContent = key; });

document.getElementById("search").addEventListener("input", e => {
  searchTerm = e.target.value.trim().toLowerCase();
  applyVisibility();
});

// ── option controls ──
document.getElementById("label-mode").addEventListener("change", e => {
  labelMode = e.target.value;
  updateLabels();
});
document.getElementById("size-by").addEventListener("change", e => {
  sizeBy = e.target.value;
  refreshSizes();
  applyLayout(0.4);
});
document.getElementById("sort-by").addEventListener("change", e => {
  sortBy = e.target.value;
  applyLayout(0.6);
});
document.querySelectorAll("#layout-toggle button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll("#layout-toggle button").forEach(b => b.classList.remove("on"));
    btn.classList.add("on");
    mode = btn.dataset.mode;
    applyLayout();
  };
});
document.getElementById("size-slider").addEventListener("input", e => {
  sizeScale = +e.target.value;
  refreshSizes();
  if (mode !== "force") applyLayout(0.4);
});
document.getElementById("dist-slider").addEventListener("input", e => {
  distScale = +e.target.value;
  applyLayout(0.5);
});
document.getElementById("reset").onclick = () => {
  document.getElementById("search").value = ""; searchTerm = "";
  TYPE_ORDER.forEach(k => activeTypes.add(k)); syncTypeChips();
  SECTORS.forEach(s => activeSectors.add(s)); syncSectorChips();
  sizeScale = 1; distScale = 1;
  document.getElementById("size-slider").value = 1;
  document.getElementById("dist-slider").value = 1;
  labelMode = "auto"; document.getElementById("label-mode").value = "auto";
  sizeBy = "degree"; document.getElementById("size-by").value = "degree";
  sortBy = "degree"; document.getElementById("sort-by").value = "degree";
  refreshSizes();
  applyLayout();
  selectNode(null);
  svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity);
  applyVisibility();
};

// fullscreen toggle on the graph area
const fsBtn = document.getElementById("fs-btn");
fsBtn.onclick = () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.querySelector("main").requestFullscreen();
};
document.addEventListener("fullscreenchange", () => {
  fsBtn.textContent = document.fullscreenElement ? "✕" : "⛶";
  fsBtn.title = document.fullscreenElement ? "Exit full screen" : "Toggle full screen (Esc to exit)";
  applyLayout(0.4);
});

// ── SVG / simulation ──
const svg = d3.select("#graph");
const W = () => svg.node().clientWidth, H = () => svg.node().clientHeight;

svg.append("defs").append("marker")
  .attr("id", "arrow").attr("viewBox", "0 -4 8 8")
  .attr("refX", 7).attr("refY", 0)
  .attr("markerWidth", 7).attr("markerHeight", 7)
  .attr("orient", "auto")
  .append("path").attr("d", "M0,-3.5L8,0L0,3.5").attr("fill", "#55687c");

const g = svg.append("g");
const zoom = d3.zoom().scaleExtent([0.15, 4]).on("zoom", e => g.attr("transform", e.transform));
svg.call(zoom).on("dblclick.zoom", null);
svg.on("click", () => selectNode(null));

const links = LINKS.map(d => ({ ...d }));
const nodes = NODES.map(d => ({ ...d }));

const sim = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(115).strength(0.5))
  .force("charge", d3.forceManyBody().strength(-420))
  .force("center", d3.forceCenter(W() / 2, H() / 2))
  .force("collide", d3.forceCollide().radius(d => radius(d) + 20));

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
    .on("start", (e, d) => { if (mode === "orbit") return; if (!e.active) sim.alphaTarget(0.25).restart(); d.fx = d.x; d.fy = d.y; })
    .on("drag", (e, d) => { if (mode === "orbit") return; d.fx = e.x; d.fy = e.y; })
    .on("end", (e, d) => { if (mode === "orbit") return; if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }))
  .on("click", (e, d) => { e.stopPropagation(); selectNode(d.id); })
  .on("mouseenter", (e, d) => { hoverId = d.id; updateLabels(); })
  .on("mouseleave", () => { hoverId = null; updateLabels(); });

nodeSel.append("path").attr("fill", d => TYPE_META[d.type].hex);
nodeSel.append("text").attr("text-anchor", "middle")
  .text(d => d.label.length > 40 ? d.label.slice(0, 38) + "…" : d.label);

function refreshSizes() {
  nodeSel.select("path")
    .attr("d", d => symbol.type(TYPE_META[d.type].shape).size(radius(d) * radius(d) * 3.6)());
  nodeSel.select("text").attr("dy", d => radius(d) + 14);
  sim.force("collide").radius(d => radius(d) + 20 * sizeScale);
  if (mode !== "orbit") sim.alpha(0.35).restart();
}
refreshSizes();

function render() {
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
}

let tickCount = 0;
sim.on("tick", () => {
  render();
  if (++tickCount % 4 === 0) updateLabels();
});
sim.on("end", updateLabels);

// ── orbit mode: nodes orbit their most-connected neighbor ──
// BFS from the biggest hub assigns each node a parent; children ride concentric
// rings around the parent with Kepler-ish speeds (closer = faster), directions
// alternating by depth. Slider scales (spacing/size) are read live every frame.
let orbitState = null;

function buildOrbitPlan() {
  const adj = new Map(nodes.map(d => [d.id, []]));
  links.forEach(l => {
    adj.get(l.source.id).push(l.target.id);
    adj.get(l.target.id).push(l.source.id);
  });
  const byDeg = [...nodes].sort((a, b) => (degree[b.id] || 0) - (degree[a.id] || 0));
  const BANDS = [0, 175, 80, 47, 33];
  const info = new Map();
  const order = [];
  let roots = 0;
  for (const root of byDeg) {
    if (info.has(root.id)) continue;
    info.set(root.id, { parentId: null, depth: 0, rootIdx: roots, rootAngle: roots * 2.4 });
    roots++;
    const queue = [root.id];
    while (queue.length) {
      const pid = queue.shift();
      order.push(pid);
      const pInf = info.get(pid);
      const kids = adj.get(pid)
        .filter(id => !info.has(id))
        .sort((a, b) => (degree[b] || 0) - (degree[a] || 0));
      kids.forEach((kid, i) => {
        const depth = pInf.depth + 1;
        const base = BANDS[Math.min(depth, BANDS.length - 1)];
        const r = base * (1 + 0.17 * (i % 4));
        info.set(kid, {
          parentId: pid,
          depth,
          r,
          a0: (2 * Math.PI * i) / kids.length + depth * 0.9,
          w: 0.22 / Math.pow(r / 100, 0.8),
          dir: depth % 2 ? 1 : -1
        });
        queue.push(kid);
      });
    }
  }
  return { order, info };
}

function startOrbit() {
  sim.stop();
  const simById = new Map(nodes.map(d => [d.id, d]));
  const ease = u => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  orbitState = {
    ...buildOrbitPlan(),
    starts: new Map(nodes.map(d => [d.id, [d.x, d.y]])),
    t: 0, lastTs: null, blend: 0, frame: 0, raf: 0
  };
  const step = ts => {
    const o = orbitState;
    if (!o || mode !== "orbit") return;
    if (o.lastTs == null) o.lastTs = ts;
    const dt = Math.min(0.05, (ts - o.lastTs) / 1000);
    o.lastTs = ts;
    o.t += dt;
    o.blend = Math.min(1, o.blend + dt / 1.4);
    const k = ease(o.blend);
    const cx = W() / 2, cy = H() / 2;
    const scale = Math.max(0.55, distScale) * (0.85 + 0.3 * sizeScale);
    const pos = new Map();
    for (const id of o.order) {
      const inf = o.info.get(id);
      let tx, ty;
      if (!inf.parentId) {
        // hubs breathe around the center; extra components circle it widely
        const wob = 0.06 * o.t + inf.rootAngle;
        tx = cx + 22 * Math.cos(wob);
        ty = cy + 22 * Math.sin(wob);
        if (inf.rootIdx > 0) {
          const R = (300 + 70 * inf.rootIdx) * scale;
          tx += R * Math.cos(inf.rootAngle + 0.03 * o.t);
          ty += R * Math.sin(inf.rootAngle + 0.03 * o.t);
        }
      } else {
        const p = pos.get(inf.parentId);
        const ang = inf.a0 + inf.dir * inf.w * o.t;
        tx = p[0] + inf.r * scale * Math.cos(ang);
        ty = p[1] + inf.r * scale * Math.sin(ang);
      }
      pos.set(id, [tx, ty]);
      const d = simById.get(id);
      const s = o.starts.get(id);
      d.x = s[0] + (tx - s[0]) * k;
      d.y = s[1] + (ty - s[1]) * k;
    }
    render();
    if (++o.frame % 6 === 0) updateLabels();
    o.raf = requestAnimationFrame(step);
  };
  orbitState.raf = requestAnimationFrame(step);
}

function stopOrbit() {
  if (!orbitState) return;
  cancelAnimationFrame(orbitState.raf);
  orbitState = null;
}

// ── label decluttering ──
// Labels live in the same zoomed group, so graph-space overlap == screen overlap.
function labelW(d) {
  return Math.min(d.label.length, 40) * 6.5;
}
function updateLabels() {
  const text = nodeSel.select("text");
  if (labelMode === "none") {
    text.style("display", d => d.id === hoverId || d.id === selectedId ? null : "none");
    return;
  }
  if (labelMode === "all") { text.style("display", null); return; }
  // auto: greedy placement by priority (selected > hovered > most-connected)
  const placed = [];
  const show = new Set();
  const vis = nodes.filter(nodeVisible)
    .sort((a, b) =>
      (b.id === selectedId) - (a.id === selectedId) ||
      (b.id === hoverId) - (a.id === hoverId) ||
      (degree[b.id] || 0) - (degree[a.id] || 0));
  vis.forEach(d => {
    const w = labelW(d), h = 14;
    const x = d.x - w / 2, y = d.y + radius(d) + 3;
    const clash = placed.some(b => x < b.x + b.w && b.x < x + w && y < b.y + b.h && b.y < y + h);
    if (!clash || d.id === selectedId || d.id === hoverId) {
      placed.push({ x, y, w, h });
      show.add(d.id);
    }
  });
  text.style("display", d => show.has(d.id) ? null : "none");
}

// ── layouts ──
function tierY(i) {
  const pad = 80;
  const spread = Math.max(1, distScale, sizeScale * 0.9);
  const cy = H() / 2;
  const base = pad + i * ((H() - 2 * pad) / (TIERS.length - 1));
  return cy + (base - cy) * spread;
}
function applyLayout(alpha = 0.9) {
  sim.force("link").distance(115 * distScale);
  tierLabelSel.classed("visible", mode === "tiers");
  svg.classed("orbiting", mode === "orbit");
  if (mode === "orbit") {
    sim.stop();
    if (!orbitState) startOrbit();
    return;
  }
  stopOrbit();
  if (mode === "tiers") {
    const cx = W() / 2;
    const byTier = {};
    nodes.forEach(d => { (byTier[TIER_OF[d.type]] ||= []).push(d); });
    Object.values(byTier).forEach(arr => {
      arr.sort(sortCmp);
      arr.forEach((d, i) => {
        const raw = W() * (i + 1) / (arr.length + 1);
        d.tx = cx + (raw - cx) * Math.max(1, distScale * 0.9);
      });
    });
    sim.force("center", null)
      .force("x", d3.forceX(d => d.tx).strength(0.2))
      .force("y", d3.forceY(d => tierY(TIER_OF[d.type])).strength(0.6))
      .force("charge", d3.forceManyBody().strength(-180 * distScale));
    sim.force("link").strength(0.02);
    tierLabelSel.attr("y", (d, i) => tierY(i) - 40);
  } else if (mode === "ring") {
    const cx = W() / 2, cy = H() / 2;
    const R = (Math.min(W(), H()) / 2 - 110) * Math.max(1, distScale * 0.85) * Math.max(1, sizeScale * 0.8);
    const order = [...nodes].sort((a, b) =>
      TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type) || sortCmp(a, b));
    order.forEach((d, i) => {
      const a = -Math.PI / 2 + 2 * Math.PI * i / order.length;
      d.rx = cx + R * Math.cos(a);
      d.ry = cy + R * Math.sin(a);
    });
    sim.force("center", null)
      .force("x", d3.forceX(d => d.rx).strength(0.5))
      .force("y", d3.forceY(d => d.ry).strength(0.5))
      .force("charge", d3.forceManyBody().strength(-40));
    sim.force("link").strength(0.005);
  } else {
    sim.force("x", null).force("y", null)
      .force("center", d3.forceCenter(W() / 2, H() / 2))
      .force("charge", d3.forceManyBody().strength(-420 * distScale));
    sim.force("link").strength(0.5);
  }
  sim.alpha(alpha).restart();
}
window.addEventListener("resize", () => applyLayout(0.4));

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
  updateLabels();
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
  updateLabels();

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

  document.getElementById("panel-source").href = d.link;
  panel.classList.remove("hidden");
}
document.getElementById("panel-close").onclick = () => selectNode(null);

// start with the PSC selected so the panel demonstrates itself
setTimeout(() => selectNode("psc"), 900);
