// space colonization algorithm for palmate leaf venation
// i used a tutorial by The Coding Train for this part https://www.youtube.com/watch?v=kKT0v3qhIQY
function Tree(
  auxCount = 800,
  capDist  = 20,
  killDist = 10,
  branchLen = 5,
  spread = 0.8,
  midribCurve = 0.3,
  midribLength = 80
) {

  // main parameters
  this.auxCount    = auxCount;
  this.captureDist = capDist;
  this.killDist    = killDist;
  this.branchLen   = branchLen;

  // midrib parameters T_T
  this.spread      = spread;
  this.midribCurve = midribCurve;
  this.midribLength = midribLength;

  this.leaves = [];
  this.branches = [];
  // midrib branches for thicker rendering
  this.midribs = new Set();

  
  // create attraction points <3
  for (var i = 0; i < auxCount; i++) {
      let x = random(width);
      let y = random(height);
      if (isInLeafShape(x, y, 1)) {
        this.leaves.push(new Leaf(x, y));
      }
  }
  
  // petiole
  var petioleBase = createVector(width / 2, height);
  var petioleDir = createVector(0, -1);
  var petioleLength = 40;
  
  // petiole base is also the root branch
  var root = new Branch(null, petioleBase, petioleDir);
  root.isMidrib = true;       //yeah. its a midrib
  root.level = 0;             // level = 0 for main stem
  this.midribs.add(root);
  this.branches.push(root);
  
  // grow up!!!
  var current = root;
  for (var i = 0; i < petioleLength / 3.2; i++) {
    var stemBranch = current.next();
    stemBranch.isMidrib = true;
    stemBranch.level = 0; 
    current = stemBranch;
    this.midribs.add(current);
    this.branches.push(current);
  }
  

  // creating midribs
  // three primary veins from top of petiole
  var petioleTop = current.pos.copy();
  
  // center midrib branches straight up
  var centerDir = createVector(0, -1);
  var centerMidrib = new Branch(current, petioleTop, centerDir);
  centerMidrib.isMidrib = true;
  centerMidrib.level = 1;
  this.midribs.add(centerMidrib);
  this.branches.push(centerMidrib);
  
  // angle based on spread parameter
  var branchAngle = PI/4 * this.spread; // 45 degrees * spread
  // spread == 1, 45deg
  // spread == 0, aligned with center midrib
  
  // left
  var leftAngle = -PI/2 + branchAngle; // -90° + angle
  var leftDir = p5.Vector.fromAngle(leftAngle);
  var leftMidrib = new Branch(current, petioleTop, leftDir);
  leftMidrib.isMidrib = true;
  leftMidrib.level = 1;
  this.midribs.add(leftMidrib);
  this.branches.push(leftMidrib);
  
  // right
  var rightAngle = -PI/2 - branchAngle; // -90° - angle
  var rightDir = p5.Vector.fromAngle(rightAngle);
  var rightMidrib = new Branch(current, petioleTop, rightDir);
  rightMidrib.isMidrib = true;
  rightMidrib.level = 1; 
  this.midribs.add(rightMidrib);
  this.branches.push(rightMidrib);
  
  // midrib lengths
  var centerMidribLength = this.midribLength * 1.5; // center longer :P
  var sideMidribLength = this.midribLength;
  var midribs = [centerMidrib, leftMidrib, rightMidrib];
  var midribLengths = [centerMidribLength, sideMidribLength, sideMidribLength];
  
  // grow midribs before
  for (var m = 0; m < midribs.length; m++) {
    current = midribs[m];
    var currentMidribLength = midribLengths[m];
    var segments = currentMidribLength / 2.4;
    
    for (var i = 0; i < segments; i++) {
      var naturalAngle = random(-0.05, 0.05) * this.midribCurve; // random angle generation 
      current.dir.rotate(naturalAngle);
      
      // in second half of midrib growth, apply space colonization!
      if (i > segments / 2) {
        var closestLeaves = [];
        var influenceRadius = this.captureDist * 0.3; // smaller influence radius
        
        for (var j = 0; j < this.leaves.length; j++) {
          var d = p5.Vector.dist(current.pos, this.leaves[j].pos);
          if (d < influenceRadius) {
            closestLeaves.push(this.leaves[j]);
          }
        }
        
        // slightly influence direction
        if (closestLeaves.length > 0) {
          var influenceDir = createVector(0, 0);
          for (var k = 0; k < closestLeaves.length; k++) {
            var leafDir = p5.Vector.sub(closestLeaves[k].pos, current.pos);
            leafDir.normalize();
            influenceDir.add(leafDir);
          }
          
          influenceDir.div(closestLeaves.length);
          influenceDir.normalize();
          
          var influenceFactor = 0.2 * this.midribCurve;
          current.dir.mult(1 - influenceFactor);
          influenceDir.mult(influenceFactor);
          current.dir.add(influenceDir);
          current.dir.normalize();
        }
      }
      
      var midribBranch = current.next();
      midribBranch.isMidrib = true;
      midribBranch.level = 1;
      current = midribBranch;
      this.midribs.add(current);
      this.branches.push(current);
    }
  }

  this.grow = function() {
    for (var i = 0; i < this.leaves.length; i++) {
      var leaf = this.leaves[i];
      var closestBranch = null;
      var record = this.captureDist;
      for (var j = 0; j < this.branches.length; j++) {
        var branch = this.branches[j];
        var d = p5.Vector.dist(leaf.pos, branch.pos);
        if (d < this.killDist) {
          leaf.reached = true;
          closestBranch = null;
          break;
        } else if (d < record) {
          closestBranch = branch;
          record = d;
        }
      }

      if (closestBranch != null) {
        var newDir = p5.Vector.sub(leaf.pos, closestBranch.pos);
        newDir.normalize();
        closestBranch.dir.add(newDir);
        closestBranch.count++;
      }
    }

    // remove if reached
    for (var i = this.leaves.length - 1; i >= 0; i--) {
      if (this.leaves[i].reached) {
        this.leaves.splice(i, 1);
      }
    }

    // create new when needed
    for (var i = this.branches.length - 1; i >= 0; i--) {
      var branch = this.branches[i];
      if (branch.count > 0) {
        branch.dir.div(branch.count + 1);
        var newBranch = branch.next();
        this.branches.push(newBranch);
        branch.reset();
      }
    }
  }
  
  this.show = function() {
    if (showAuxins) {
      for (var i = 0; i < this.leaves.length; i++) {
        this.leaves[i].show();
      }
    }

    for (var i = 0; i < this.branches.length; i++) {
      this.branches[i].show();
    }
  }
}

function Leaf(x, y) {
  if (x !== undefined && y !== undefined) {
    this.pos = createVector(x, y); // use provided point
  }
  this.reached = false;

  this.show = function () {
    noStroke();
    fill(255);
    ellipse(this.pos.x, this.pos.y, 4, 4);
  };

  this.hide = function () {
    noStroke();
    fill(0, 0, 0, 0);
    ellipse(this.pos.x, this.pos.y, 4, 4);
  };
}

function Branch(parent, pos, dir, len = 10) {
  this.pos = pos;
  this.parent = parent;
  this.dir = dir;
  this.origDir = this.dir.copy();
  this.count = 0;
  this.len = len;
  this.isMidrib = false; 
  this.level = parent ? 3 : 0; // 0 = petiole, 1 = midrib, 3 = vein
  this.reset = function() {
    this.dir = this.origDir.copy();
    this.count = 0;
  }

  this.next = function() {
    var nextDir = p5.Vector.mult(this.dir, this.len);
    var nextPos = p5.Vector.add(this.pos, nextDir);
    var nextBranch = new Branch(this, nextPos, this.dir.copy());
    return nextBranch;
  }

  this.show = function() {
    if (parent != null) {
      stroke(255);
      
      if (this.isMidrib) {
        if (this.level === 0) { // petiole
          strokeWeight(6);
        } else if (this.level === 1) {
          strokeWeight(2.5);
        }
      } else {
        strokeWeight(1);
      }
      
      line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y);
    }
  }
}