let veinNoiseScale = 0.1,  veinWiggle = 5;
let leafOutline = [];
function setupParallel(leafW, leafH, veinCount, petalCount) {
  veins = [];
  drawProgress = 0;

  const centerX = width  / 2;
  const centerY = height / 2;

  const baseRound = 2.5, tipSharp = 3.2;
  const petalVeins = [];

  for (let vi = 0; vi < veinCount; vi++) {
    let pts = [];
    for (let si = 0; si <= veinSegments; si++) {
      const u  = si / veinSegments;
      const vY = u * leafH - leafH / 2;
      const profile = pow(u, baseRound) * pow(1 - u, tipSharp);
      const halfW   = leafW * profile;
      let xLocal = map(vi, 0, veinCount - 1, -halfW, halfW);
      xLocal += map(noise(vi * 0.2, u * 5), 0, 1, -veinWiggle, veinWiggle);
      pts.push(createVector(xLocal, vY));
    }
    petalVeins.push(pts);
  }

  // IF THERE ARE MORE PETALS THEN WE ARE GONNA REPEAT AND ROTATE!!!!
  for (let p = 0; p < petalCount; p++) {
    const ang = TWO_PI * p / petalCount; // rotation angle :3
    const c   = cos(ang), s = sin(ang);

    for (let vi = 0; vi < veinCount; vi++) {
      const rotated = [];
      const localPts = petalVeins[vi];
      for (let si = 0; si < localPts.length; si++) {
        const lp = localPts[si];
        
        // rotate localX/Y about origin, then translate to canvas center
        const gx = centerX + lp.x * c - lp.y * s;
        const gy = centerY + lp.x * s + lp.y * c;
        rotated.push(createVector(gx, gy));
      }
      veins.push(rotated);
    }
  }
}


function drawParallel() {
  fill(0,0,0,0);
  stroke(255) ;
  strokeWeight(1);
  beginShape();
  for (let pt of leafOutline) {
    vertex(pt.x, pt.y);
  }
  endShape(CLOSE);

  strokeWeight(0.8);

  for (let vein of veins) {
    const visible = floor(vein.length * drawProgress); 
    for (let j = 1; j < visible; j++) {
      const alpha = map(j, 1, visible, 40, 255);
      stroke(255, alpha);
      line(vein[j - 1].x, vein[j - 1].y, vein[j].x, vein[j].y);
    }
  }
  
  if (drawProgress < 1) drawProgress += 0.01;
}