/*

this script ties everything together

jadden picardal ece30834 spring2025

*/

let type = 0; // 0: palmate  | 1: ginkgo (dichotomous)  | 2: lanceolate

var tree;

// global ui elements.. skull...
let arcSpanSlider, numVeinsSlider, lenSlider, depthSlider, forkAngleSlider;
let auxinCountSlider, captureSlider, killSlider, branchLengthSlider, spreadSlider;
let midribCurveSlider, midribLengthSlider;
let leafWidthSlider, leafHeightSlider, veinCountSlider;
let regenerateButton, typeDropdown;
let dichControlsDiv, palmateControlsDiv, parallelControlsDiv;

let veinCount, petalCount, petalCountSlider;
let veinSegments = 100;

let showAuxinsCheckbox, showAuxins = true;
let uiVisible = true;
let controlsDiv;

// images 0_0
let palmateImg, dichotomousImg, parallelImg;
function preload() {
  palmateImg      = loadImage('img/palmate.png');
  dichotomousImg  = loadImage('img/dichotomous.png');
  parallelImg   = loadImage('img/parallel.png');
}

function setup() {
  noiseSeed(floor(random(10000)));
  createCanvas(windowWidth, windowHeight);
  getHandles(); // gets ui elements
  updateControls();
  initTree();
}

function getHandles() {

  // all parameter UI elements
  controlsDiv         = select('#controls');

  // dichotomous
  dichControlsDiv     = select('#dichotomousControls');
    arcSpanSlider       = select('#arcSpanSlider');
    numVeinsSlider      = select('#numVeinsSlider');
    lenSlider           = select('#lenSlider');
    depthSlider         = select('#depthSlider');
    forkAngleSlider     = select('#forkAngleSlider');

  // palmate
  palmateControlsDiv  = select('#palmateControls');
    auxinCountSlider    = select('#auxinCountSlider');
    captureSlider       = select('#captureSlider');
    killSlider          = select('#killSlider');
    branchLengthSlider  = select('#branchLengthSlider');
    // for fun
    showAuxinsCheckbox  = select('#showAuxinsCheckbox');
    showAuxinsCheckbox.changed(() => showAuxins = showAuxinsCheckbox.checked());
    // for testing
        // spreadSlider        = select('#spreadSlider');
        // midribCurveSlider   = select('#midribCurveSlider');
      // midribLengthSlider  = select('#midribLengthSlider');

  // parallel
  parallelControlsDiv = select('#parallelControls');
    leafWidthSlider     = select('#leafWidthSlider');
    leafHeightSlider    = select('#leafHeightSlider');
    veinCountSlider     = select('#veinCountSlider');
    petalCountSlider    = select('#petalCountSlider');

  // always there + relationships 
  regenerateButton    = select('#regenerateButton');
  regenerateButton.mousePressed(initTree);
  typeDropdown        = select('#typeDropdown');
  typeDropdown.changed(() => {
    type = int(typeDropdown.value());
    updateControls();
    initTree();
  });
  
}

// bottom center for the ginkgo tree. kind of lifted so the petiole will show
function canvasCenter() {
  return createVector(width / 2, height - windowHeight * 0.25);
}

function updateControls() {
  if (type === 0) {
    dichControlsDiv.hide();  palmateControlsDiv.show();  parallelControlsDiv.hide();
  } else if (type === 1) {
    dichControlsDiv.show();  palmateControlsDiv.hide();  parallelControlsDiv.hide();
  } else {
    dichControlsDiv.hide();  palmateControlsDiv.hide();  parallelControlsDiv.show();
  }
}

function initTree() {
  if (type === 0) {
    // make new palmate tree 0_0
    tree = new Tree(
      int(auxinCountSlider.value()),
      float(captureSlider.value()),
      float(killSlider.value()),
      float(branchLengthSlider.value()),
      0.93,
      0.25,
      80
    );
  } else if (type === 2) {
    veinCount  = int(veinCountSlider.value());
    petalCount = max(1, int(petalCountSlider.value()));
    setupParallel(int(leafWidthSlider.value()), int(leafHeightSlider.value()), veinCount, petalCount);
    drawProgress = 0;
  } else if (type === 1) {
    auto_ginkgo.regen(canvasCenter().x, canvasCenter().y); // optimized ginkgo tree 0_0
  }

  animatedDepth = 0;
  noiseSeed(floor(random(10000)));
}

function draw() {
  background(0);

  if (uiVisible) {
    controlsDiv.style("display", "block");
  } else {
    controlsDiv.style("display", "none");
  }

  switch (type) {
    case 0:   // palmate
      image(palmateImg, width - 220, 20, 200, 200);
      tree.show();
      tree.grow();
      label("Veins radiate outwards from the petiole.\n I used the space colonization algorithm to generate the veins.");
      break;

    case 1:   // dichotomous
      image(dichotomousImg, width - 320, 20, 300, 200);
      drawPetiole(canvasCenter(), 40);
      label("Veins branch symmetrically in pairs.\n I used recursive branching, similar to a fractal tree.")
      auto_ginkgo.draw(this);
      break;

    case 2:   // parallel
      image(parallelImg, width - 260, 20, 240, 200);
      label("Veins are parallel to each other.\n I just parameterized the shape of the leaf \nand drew it with a bezier curve.");
      drawParallel(veinCount);
      break;
  }

}

function keyPressed() {
  if (key === 'H' || key === 'h') {
    uiVisible = !uiVisible;
  }

  if (key=== ' ') {
    initTree();
  }
}

// text helper
function label(txt) {
  fill(255); noStroke(); textSize(16); textAlign(RIGHT);
  text(txt, width - 20, 240);
}

class SandboxLeaf {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(40, 160);
    this.rotation = random(TWO_PI);
    this.color = color(
      random(100, 255),
      random(100, 255),
      random(100, 255),
      180
    );
    this.spineCount = floor(random(4, 10));
  }
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    noStroke();
    fill(this.color);
    // basic “leaf” ellipse
    ellipse(0, 0, this.size, this.size * 0.6);

    // simple radial spines
    stroke(50, 150);
    for (let i = 0; i < this.spineCount; i++) {
      let a = map(i, 0, this.spineCount - 1, -PI/3, PI/3);
      let len = this.size * 0.5;
      line(0, 0, len * cos(a), len * sin(a));
    }
    pop();
  }
}
