// dichotomous venation
// this uses a recursive function. like a fractal tree, but with some more parameters
// im basing this off of a ginkgo leaf

function drawPetiole(origin, length = 60) {
  stroke(255);
  strokeWeight(3);
  line(origin.x, origin.y, origin.x, origin.y + length);
}
class GinkgoLeaf {
  constructor(origin) {
    this.origin   = origin; // petiole position
    this.segments = new Float32Array(0);
    // animation state
    this.progress    = 0; 
    this.growthRate  = 0.018;
  }

  // basically make the geometry once
  regenerate() {
    const arcSpan   = +document.getElementById('arcSpanSlider').value * Math.PI / 180;
    const nPrimary  = +document.getElementById('numVeinsSlider').value;
    const L0        = +document.getElementById('lenSlider').value;
    const maxDepth  = +document.getElementById('depthSlider').value;
    const forkRad   = +document.getElementById('forkAngleSlider').value * Math.PI / 180;

    // cache for later drawing
    Object.assign(this, { L0: L0, arcSpan: arcSpan, maxDepth: maxDepth });

    // worst‑case allocation
    const estSegs = (Math.pow(2, maxDepth + 1) - 1) * nPrimary;
    this.segments = new Float32Array(estSegs * 5);
    let segCount = 0;

    // create primaries fan
    const startAng = Math.PI / 2 - arcSpan / 2;
    const stepAng  = arcSpan / (nPrimary - 1 || 1);

    const stack = [];
    for (let i = 0; i < nPrimary; i++) {
      stack.push({ x: this.origin.x, y: this.origin.y, ang: startAng + i * stepAng, len: L0, depth: 0 });
    }

    const lenDecay = 0.72; // how much to shrink each segment
    const jitter   = 0.08; // wiggle the angle a bit

    while (stack.length) {
      const seg = stack.pop();
      const dx = Math.cos(seg.ang) * seg.len;
      const dy = -Math.sin(seg.ang) * seg.len; // invert Y
      const x2 = seg.x + dx;
      const y2 = seg.y + dy;

      const o = segCount * 5;
      this.segments[o    ] = seg.x;
      this.segments[o + 1] = seg.y;
      this.segments[o + 2] = x2;
      this.segments[o + 3] = y2;
      this.segments[o + 4] = seg.depth;
      segCount++;

      if (seg.depth < maxDepth) {
        const childLen = seg.len * lenDecay;
        const d = seg.depth + 1;
        const j = (Math.random() * 2 - 1) * jitter;
        stack.push({ x: x2, y: y2, ang: seg.ang + forkRad + j, len: childLen, depth: d });
        stack.push({ x: x2, y: y2, ang: seg.ang - forkRad + j, len: childLen, depth: d });
      }
    }

    this.segments = this.segments.subarray(0, segCount * 5);
    this.progress = 0; // restart growth
  }

  draw(pg) {
    if (!this.segments.length) return;
    // reveal by depth
    pg.push();
    pg.stroke(255);
    pg.strokeCap(pg.PROJECT);

    const totalLevels = this.maxDepth + 1; 
    const p = this.progress * totalLevels;
    const depthCut = Math.floor(p);
    const frac = p - depthCut;

    for (let i = 0; i < this.segments.length; i += 5) {
      const d = this.segments[i + 4];
      const amp = Math.max(1.5, 4 - d * 0.4);
      pg.strokeWeight(Math.max(1, 3 - d * 0.3));

      if (d < depthCut) {
        this.#noisyLine(pg,
          this.segments[i], this.segments[i + 1],
          this.segments[i + 2], this.segments[i + 3], amp);
      } else if (d === depthCut) {
        this.#noisyLinePartial(pg,
          this.segments[i], this.segments[i + 1],
          this.segments[i + 2], this.segments[i + 3], amp, frac);
      }
    }
    pg.pop();
    if (this.progress < 1) this.progress = Math.min(1, this.progress + this.growthRate);
  }

  #noisyLine(pg, x1, y1, x2, y2, amp) {
    const SEG = 4;
    pg.beginShape();
    for (let s = 0; s <= SEG; s++) {
      const t = s / SEG;
      this.#vertexWithNoise(pg, x1, y1, x2, y2, t, amp);
    }
    pg.endShape();
  }

  #noisyLinePartial(pg, x1, y1, x2, y2, amp, tEnd) {
    if (tEnd <= 0) return;
    const SEG = 4;
    pg.beginShape();
    const maxSeg = Math.floor(tEnd * SEG);
    for (let s = 0; s <= maxSeg; s++) {
      const t = s / SEG;
      this.#vertexWithNoise(pg, x1, y1, x2, y2, t, amp);
    }
    // last partial vertex
    const tLast = tEnd;
    this.#vertexWithNoise(pg, x1, y1, x2, y2, tLast, amp);
    pg.endShape();
  }

  #vertexWithNoise(pg, x1, y1, x2, y2, t, amp) {
    let xi = x1 + (x2 - x1) * t;
    let yi = y1 + (y2 - y1) * t;
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const nVal = noise(xi * 0.02, yi * 0.02);
    const offset = (nVal - 0.5) * amp * 2;
    pg.vertex(xi + nx * offset, yi + ny * offset);
  }
}

const ginkgoLeaf = new GinkgoLeaf(new p5.Vector());
function regenerateGinkgo(cx, cy) { ginkgoLeaf.origin.set(cx, cy); ginkgoLeaf.regenerate(); }
function drawGinkgo(p)           { ginkgoLeaf.draw(p); }

// expose
auto_ginkgo = { regen: regenerateGinkgo, draw: drawGinkgo };
