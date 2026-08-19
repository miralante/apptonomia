#!/usr/bin/env node
// scripts/build-meta-graph.js
//
// Build a thin cross-project meta-graph for the Miralante suite.
// One node per sibling project (in apptonomia/, calculia/, memofun/,
// okeymoney/, sinonimia/, teclatlon/, routime/), plus edges that connect
// projects whose per-project GRAPH_REPORT.md share the same community-name
// stems (a soft signal of architectural overlap, e.g. i18n, TTS, Feedback,
// PWA Manifest, validation script).
//
// Output: graphify-out-meta/graph.json + graphify-out-meta/graph.html.
//
// Why not just `graphify extract` against the suite? Because we don't want
// to re-extract; we want to summarise what the per-project graphs already
// say. This is a deterministic, no-LLM, no-deps transform that can run on
// any machine with Node.

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const SUITE_DIR = path.resolve(__dirname, '..', '..');
const OUT_DIR = path.join(__dirname, '..', 'graphify-out-meta');
const PROJECTS = ['apptonomia', 'calculia', 'memofun', 'okeymoney', 'sinonimia', 'teclatlon', 'routime'];

// Tokens we strip when normalising community names: case, accents, punctuation.
// A name like "i18n Module" becomes "i18n module"; "M\u00f3dulo i18n.js" also.
function norm(s) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Read community hubs out of a GRAPH_REPORT.md. The hub list lives under
// the "## Community Hubs (Navigation)" heading, lines starting with "- ".
// We capture only the lines that look like plain text (no markdown links,
// no parenthetical metadata) and ignore the structural metadata lines
// like "- 698 nodes ...".
function parseCommunities(reportText) {
  const lines = reportText.split(/\r?\n/);
  let inHubSection = false;
  const hubs = [];
  for (const line of lines) {
    if (/^## Community Hubs/.test(line)) { inHubSection = true; continue; }
    if (inHubSection && /^## /.test(line)) break; // next section
    if (inHubSection && /^# /.test(line)) break;
    if (!inHubSection) continue;
    const m = line.match(/^\s*-\s+(.+?)\s*$/);
    if (!m) continue;
    const name = m[1];
    // Skip metadata lines ("911 nodes ...", "Built from commit: ..." etc.)
    if (/\b(nodes|edges|communities|words|files|input|output|Built)\b/.test(name)) continue;
    if (name.length < 4) continue;
    hubs.push(name);
  }
  return hubs;
}

// Read node/edge/community counts out of a GRAPH_REPORT.md (best-effort).
function parseCounts(reportText) {
  const out = { nodes: 0, edges: 0, communities: 0, commit: null };
  const m = reportText.match(/(\d+)\s+nodes?\s+\u00b7\s+(\d+)\s+edges?\s+\u00b7\s+(\d+)\s+communities/);
  if (m) { out.nodes = +m[1]; out.edges = +m[2]; out.communities = +m[3]; }
  const c = reportText.match(/Built from commit:\s*`([0-9a-f]+)`/);
  if (c) out.commit = c[1];
  return out;
}

function loadProject(name) {
  const projectDir = path.join(SUITE_DIR, name);
  const reportPath = path.join(projectDir, 'graphify-out', 'GRAPH_REPORT.md');
  const graphPath = path.join(projectDir, 'graphify-out', 'graph.json');
  const node = {
    id: name,
    label: name,
    projectDir,
    graphOut: null,
    hubs: [],
    counts: { nodes: 0, edges: 0, communities: 0, commit: null },
    status: 'unknown',
  };
  if (!fs.existsSync(reportPath)) {
    node.status = 'no-graph';
    return node;
  }
  const txt = fs.readFileSync(reportPath, 'utf8');
  node.hubs = parseCommunities(txt);
  node.counts = parseCounts(txt);
  node.graphOut = fs.existsSync(graphPath) ? path.relative(SUITE_DIR, graphPath) : null;
  node.status = node.graphOut ? 'live' : 'no-graph';
  return node;
}

function jaccard(a, b) {
  const A = new Set(a), B = new Set(b);
  if (A.size === 0 && B.size === 0) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const uni = new Set([...A, ...B]).size;
  return uni === 0 ? 0 : inter / uni;
}

function build() {
  const projects = PROJECTS.map(loadProject);
  // Build inverted index: normalised hub -> set of projects that contain it.
  const index = new Map();
  for (const p of projects) {
    const seen = new Set();
    for (const hub of p.hubs) {
      const k = norm(hub);
      if (!k || seen.has(k)) continue; // dedupe within the same project
      seen.add(k);
      if (!index.has(k)) index.set(k, []);
      index.get(k).push(p.id);
    }
  }
  // Edges: pair (a, b) where they share >=2 normalised hubs, weighted by count.
  const edgeMap = new Map();
  for (const [hub, list] of index) {
    if (list.length < 2) continue;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i], b = list[j];
        const key = a < b ? `${a}|${b}` : `${b}|${a}`;
        if (!edgeMap.has(key)) edgeMap.set(key, { a, b, weight: 0, hubs: [], directed: false, kind: 'similarity' });
        const e = edgeMap.get(key);
        e.weight += 1;
        e.hubs.push(hub);
      }
    }
  }
  // Keep only edges with weight >= 2 (single-hub coincidences are noise).
  const similarityEdges = [...edgeMap.values()].filter(e => e.weight >= 2);

  // Hierarchy edges: apptonomia/ is the metaproject root that carries the
  // cross-project plumbing (sync script, meta-graph, CLAUDE.md). It "parents"
  // every sibling. These are explicit, weighted by the inverse of the
  // sibling's hub_count so the meta-graph stays visually balanced: a busy
  // sibling like routime/ gets a thinner parent edge than a slim one.
  const PARENT_ID = 'apptonomia';
  const parentEdges = [];
  for (const p of projects) {
    if (p.id === PARENT_ID) continue;
    parentEdges.push({
      a: PARENT_ID,
      b: p.id,
      weight: 1,
      hubs: [],
      directed: true,
      kind: 'parent_of',
    });
  }

  const edges = similarityEdges.concat(parentEdges);

  const nodes = projects.map(p => ({
    id: p.id,
    label: p.label,
    status: p.status,
    graph_out: p.graphOut,
    counts: p.counts,
    hub_count: p.hubs.length,
  }));

  return {
    meta: {
      suite_dir: SUITE_DIR,
      generated_at: new Date().toISOString(),
      generator: 'apptonomia/scripts/build-meta-graph.js',
      node_count: nodes.length,
      edge_count: edges.length,
      min_edge_weight: 2,
      edge_kinds: {
        similarity: similarityEdges.length,
        parent_of: parentEdges.length,
      },
    },
    nodes,
    edges,
  };
}

// Tiny D3 v7 force-directed HTML. Self-contained, no CDN, no network.
function htmlShell(meta, nodes, edges) {
  const data = { nodes, edges };
  // Embed JSON to avoid file:// CORS issues when opening locally.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  const escMeta = JSON.stringify(meta).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Miralante meta-graph</title>
<style>
  body { font: 13px/1.4 -apple-system, Segoe UI, system-ui, sans-serif; margin: 0; background: #fafafa; color: #222; }
  header { padding: 12px 18px; border-bottom: 1px solid #e5e5e5; background: #fff; }
  header h1 { margin: 0 0 4px 0; font-size: 16px; }
  header p  { margin: 0; color: #666; font-size: 12px; }
  #chart { width: 100vw; height: calc(100vh - 70px); }
  svg { width: 100%; height: 100%; display: block; }
  .node circle { fill: #4a6cf7; stroke: #2c4ad0; stroke-width: 1.5; }
  .node.no-graph circle { fill: #aaa; stroke: #888; stroke-dasharray: 3 3; }
  .node text { font-size: 11px; fill: #222; pointer-events: none; }
  .edge { stroke: #999; stroke-opacity: 0.5; }
  .edge.weight-2 { stroke-opacity: 0.35; }
  .edge.weight-3 { stroke-opacity: 0.55; }
  .edge.weight-4 { stroke-opacity: 0.75; stroke-width: 1.4; }
  .edge.weight-5 { stroke-opacity: 0.9;  stroke-width: 1.8; }
  /* Directed (parent_of) edges: orange-ish, with arrowhead */
  .edge.directed { stroke: #d97706; stroke-opacity: 0.85; stroke-width: 1.4;
                   stroke-dasharray: 4 3; marker-end: url(#arrowhead); }
  /* Root node styling: bold outline so it reads as the metaproject hub */
  .node.root circle { fill: #1d4ed8; stroke: #0f1f7a; stroke-width: 2.5; }
  .node.root text  { font-weight: 600; }
  #tooltip { position: absolute; pointer-events: none; padding: 8px 10px; background: #fff;
             border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);
             max-width: 320px; font-size: 12px; display: none; }
  .legend { position: absolute; right: 12px; bottom: 12px; background: #fff;
            border: 1px solid #ddd; border-radius: 4px; padding: 8px 10px; font-size: 11px; }
  .legend div { margin: 2px 0; }
  .legend .swatch { display: inline-block; width: 10px; height: 10px;
                    vertical-align: middle; margin-right: 4px; border-radius: 50%; }
  .legend .line-swatch { display: inline-block; width: 18px; height: 2px;
                         vertical-align: middle; margin-right: 4px; }
</style>
</head>
<body>
<header>
  <h1>Miralante meta-graph</h1>
  <p>One node per sibling project. Two edge kinds: grey undirected edges between siblings (weight = number of normalised community names shared between two per-project graphs) and orange directed edges from <code>apptonomia</code> to each sibling (the metaproject root that carries the cross-project plumbing). Built by <code>apptonomia/scripts/build-meta-graph.js</code>.</p>
</header>
<div id="chart"></div>
<div id="tooltip"></div>
<div class="legend">
  <div><span class="swatch" style="background:#1d4ed8"></span>metaproject root (apptonomia)</div>
  <div><span class="swatch" style="background:#4a6cf7"></span>live sibling graph</div>
  <div><span class="swatch" style="background:#aaa"></span>no graph yet</div>
  <div><span class="line-swatch" style="background:#d97706; border-top:2px dashed #d97706"></span>directed: parent &rarr; sibling</div>
  <div><span class="line-swatch" style="background:#999"></span>undirected: shared community names</div>
</div>

<!-- Arrowhead marker for directed edges. -->
<svg width="0" height="0" style="position:absolute">
  <defs>
    <marker id="arrowhead" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#d97706"/>
    </marker>
  </defs>
</svg>

<script>
const META = ${escMeta};
const DATA = ${json};

const W = () => document.getElementById('chart').clientWidth;
const H = () => document.getElementById('chart').clientHeight;
const COLOURS = { live: '#4a6cf7', 'no-graph': '#aaa' };

function makeSVG() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', \`0 0 \${W()} \${H()}\`);
  return svg;
}

// Pure-JS force simulation (no D3 dependency). Verlet-ish.
function simulate(nodes, edges, opts) {
  const cx = W() / 2, cy = H() / 2;
  for (const n of nodes) {
    n.x = cx + (Math.random() - 0.5) * 200;
    n.y = cy + (Math.random() - 0.5) * 200;
    n.vx = 0; n.vy = 0;
  }
  const linkStrength = 0.05;
  const repulse = 1800;
  const center = 0.01;
  const damping = 0.85;
  const iters = opts.iters || 300;
  for (let it = 0; it < iters; it++) {
    // Repulsion (O(n^2), fine for n<=10)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx*dx + dy*dy + 0.01;
        const f = repulse / d2;
        const fxs = f * dx / Math.sqrt(d2);
        const fys = f * dy / Math.sqrt(d2);
        a.vx += fxs; a.vy += fys;
        b.vx -= fxs; b.vy -= fys;
      }
    }
    // Attraction along edges
    for (const e of edges) {
      const a = nodes.find(n => n.id === e.a), b = nodes.find(n => n.id === e.b);
      if (!a || !b) continue;
      const dx = b.x - a.x, dy = b.y - a.y;
      const fx = linkStrength * e.weight * dx;
      const fy = linkStrength * e.weight * dy;
      a.vx += fx; a.vy += fy;
      b.vx -= fx; b.vy -= fy;
    }
    // Centring + damping
    for (const n of nodes) {
      n.vx += (cx - n.x) * center;
      n.vy += (cy - n.y) * center;
      n.vx *= damping; n.vy *= damping;
      n.x += n.vx; n.y += n.vy;
    }
  }
}

function render() {
  const chart = document.getElementById('chart');
  chart.innerHTML = '';
  const svg = makeSVG();
  chart.appendChild(svg);
  const tooltip = document.getElementById('tooltip');
  const nodeMap = new Map(DATA.nodes.map(n => [n.id, n]));

  simulate(DATA.nodes, DATA.edges, { iters: 400 });

  const ns = 'http://www.w3.org/2000/svg';
  // Edges first. Directed edges get class 'directed' and the arrowhead
  // marker; undirected (similarity) edges get 'weight-N' as before.
  for (const e of DATA.edges) {
    const a = nodeMap.get(e.a), b = nodeMap.get(e.b);
    if (!a || !b) continue;
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
    line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
    const cls = e.directed
      ? 'edge directed'
      : ('edge weight-' + Math.min(5, e.weight));
    line.setAttribute('class', cls);
    line.addEventListener('mouseenter', () => {
      tooltip.style.display = 'block';
      if (e.directed) {
        tooltip.innerHTML = '<b>' + e.a + ' &rarr; ' + e.b + '</b><br>'
          + 'kind: <i>parent_of</i> (apptonomia is the metaproject root)';
      } else {
        tooltip.innerHTML = '<b>' + e.a + ' &harr; ' + e.b + '</b><br>'
          + 'weight=' + e.weight + ' shared hubs: '
          + e.hubs.slice(0, 6).join(', ') + (e.hubs.length > 6 ? ', &hellip;' : '');
      }
    });
    line.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });
    line.addEventListener('mousemove', (ev) => {
      tooltip.style.left = (ev.pageX + 12) + 'px';
      tooltip.style.top  = (ev.pageY + 12) + 'px';
    });
    svg.appendChild(line);
  }
  // Nodes
  for (const n of DATA.nodes) {
    const g = document.createElementNS(ns, 'g');
    // The metaproject root gets a distinct visual treatment.
    const cls = (n.id === 'apptonomia') ? ('node root ' + n.status) : ('node ' + n.status);
    g.setAttribute('class', cls);
    g.setAttribute('transform', \`translate(\${n.x},\${n.y})\`);
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('r', 14);
    g.appendChild(c);
    const t = document.createElementNS(ns, 'text');
    t.setAttribute('x', 18); t.setAttribute('y', 4);
    t.textContent = n.label;
    g.appendChild(t);
    g.addEventListener('mouseenter', () => {
      const c = n.counts || {};
      tooltip.style.display = 'block';
      tooltip.innerHTML = '<b>' + n.label + '</b><br>'
        + 'status: ' + n.status + '<br>'
        + 'nodes: ' + (c.nodes||0) + ', edges: ' + (c.edges||0)
        + ', communities: ' + (c.communities||0) + '<br>'
        + (c.commit ? 'built from commit: <code>' + c.commit + '</code>' : 'no commit metadata')
        + '<br>graph: ' + (n.graph_out || '(none)');
    });
    g.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });
    g.addEventListener('mousemove', (ev) => {
      tooltip.style.left = (ev.pageX + 12) + 'px';
      tooltip.style.top  = (ev.pageY + 12) + 'px';
    });
    svg.appendChild(g);
  }
}

render();
window.addEventListener('resize', render);
</script>
</body>
</html>
`;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const out = build();
  const jsonPath = path.join(OUT_DIR, 'graph.json');
  const htmlPath = path.join(OUT_DIR, 'graph.html');
  fs.writeFileSync(jsonPath, JSON.stringify(out, null, 2));
  fs.writeFileSync(htmlPath, htmlShell(out.meta, out.nodes, out.edges));
  console.log(`Wrote ${path.relative(SUITE_DIR, jsonPath)}`);
  console.log(`Wrote ${path.relative(SUITE_DIR, htmlPath)}`);
  const ek = out.meta.edge_kinds || {};
  console.log(`Nodes: ${out.nodes.length}, edges: ${out.edges.length} (similarity=${ek.similarity ?? 0}, parent_of=${ek.parent_of ?? 0}, min similarity weight ${out.meta.min_edge_weight}).`);
  // Pretty-print a one-line summary so the user can grep it.
  console.log('Summary:');
  for (const n of out.nodes) {
    const c = n.counts;
    console.log(`  - ${n.id.padEnd(12)} status=${n.status.padEnd(8)} hubs=${n.hub_count} nodes=${c.nodes||0} edges=${c.edges||0} comms=${c.communities||0} commit=${c.commit||'-'}`);
  }
  const simEdges = out.edges.filter(e => !e.directed).sort((a, b) => b.weight - a.weight);
  const dirEdges = out.edges.filter(e => e.directed).sort((a, b) => a.b.localeCompare(b.b));
  if (simEdges.length > 0) {
    console.log('Similarity edges (undirected):');
    for (const e of simEdges) {
      console.log(`  - ${e.a} <-> ${e.b}  weight=${e.weight}  hubs=[${e.hubs.slice(0, 5).join(', ')}${e.hubs.length > 5 ? ', ...' : ''}]`);
    }
  }
  if (dirEdges.length > 0) {
    console.log('Hierarchy edges (directed, parent_of):');
    for (const e of dirEdges) {
      console.log(`  - ${e.a} -> ${e.b}`);
    }
  }
}

main();
