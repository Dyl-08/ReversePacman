let drops = []; // initialized as an empty array that will be used to store multiple drop objects
let bigcircle = {};
let originalBigCirclePos = {x: 515, y: 530};

let rectX = 420;
let rect1Y = 300; // Initial y-coordinate of the first rectangle
let rect2X = 545; // Initial x-coordinate of the second rectangle
let rect3Y = 145; // Initial y-coordinate of the third rectangle
let rect4Y = 215; // Initial y-coordinate of the fourth rectangle
let rect5X = 215; // Initial x-coordinate of the fifth rectangle
let rect6Y = 75;  // Initial y-coordinate of the sixth rectangle

let direction = 1.6;
let direction1 = 1.6; 
let direction2 = 1.6; 
let direction3 = 1.6; 
let direction4 = 1.6; 
let direction5 = 1.6; 
let direction6 = 1.6; 

let gameRunning = false;
let gameReset = false;

let img;
let imgdark;
let imgnav;
let imgarrow;
let imgdots;
let imgdots123;
let imgnext;
let imgsquare;
let imgredsquare12;
let imgattempts;
let imgspacebar;
let imgemoji;
let imgpointer;
let imgfinishline;
let winningimage;

let showImage = true;
let showImage1 = true;
let block = false;
let bounceOffset = 480;
let bounceSpeed = 0.25;

let s;
let lives = 5;

let lines = [
  [545, 535, 545, 355], [485, 535, 485, 425], [545, 355, 400, 355],
  [485, 425, 450, 425], [400, 355, 400, 440], [450, 425, 450, 490],
  [450, 490, 310, 490], [400, 440, 380, 440], [310, 490, 310, 280],
  [380, 440, 380, 330], [380, 330, 575, 330], [310, 280, 520, 280],
  [520, 280, 520, 180], [575, 330, 575, 120], [520, 180, 250, 180],
  [575, 120, 190, 120], [250, 180, 250, 200], [190, 120, 190, 200],
  [190, 255, 190, 480], [250, 200, 490, 200], [490, 200, 490, 255],
  [490, 255, 250, 255], [250, 255, 250, 550], [190, 480, 120, 480],
  [250, 550, 60, 550], [60, 550, 60, 50], [120, 480, 120, 255],
  [120, 255, 190, 255], [120, 200, 190, 200], [120, 200, 120, 100],
  [60, 50, 500, 50], [120, 100, 500, 100]
];

function setup() {
  createCanvas(600, 600);
  initializedrops();
  initializegame();
}

function preload() {
  img = loadImage("instruction.png");
  img1 = loadImage("navigate.png");
  imgarrow = loadImage("arrow.png")
  imgdots = loadImage("dots.png")
  imgdots123 = loadImage("dots123.png")
  imgnext = loadImage("next.png")
  imgsquare = loadImage("square.png")
  imgredsquare12 = loadImage("redsquare12.png")
  imgattempts = loadImage("attempts.png")
  imgspacebar = loadImage("spacebar.png")
  imgemoji = loadImage("emoji.png")
  imgpointer = loadImage("pointer.png")
  imgfinishline = loadImage("finishline.png")
  imgwinningimage = loadImage("winningimage.png")
  imgdark = loadImage("darker_image.png")
}

function draw() {
  if (!gameRunning) {
    background(0, 55, 130);
    if(showImage) {
    image(img, 0, 0, 600, 350);
    image(imgdark, 140, 230, 300, 300);
    }
    if (keyCode === 39 && showImage1) {
      showImage = false;

      image(img1, 100, 330, 400, 100);
      image(imgdots123, 100, 250, 400, 75);

      bounceOffset = bounceOffset + bounceSpeed;

      if (bounceOffset > 485 || bounceOffset < 475) {
        bounceSpeed *= -1;
      }

      push();
      translate(bounceOffset,bounceOffset);
      rotate(radians(225)); // Rotate 270 degrees (counterclockwise)
      image(imgarrow, 0, 0, 50, 50); // Draw the image at the new origin
      pop();

      fill(255);
      noStroke();
      ellipse(510, 475, 30, 30);

      image(imgdots, 0, 130, 600, 130);
      image(imgnext, 10, 500, 500, 100);
      image(imgsquare, 10, 20, 480, 110);
      image(imgredsquare12, 480, 30, 115, 80);
      image(imgemoji, 515, 520, 70, 70);
    }

    if (block) {
      showImage1 = false;

      image(imgattempts, 1, 205, 600, 200);
      image(imgspacebar, 58, 50, 500, 100);
      image(imgpointer, 180, 400, 250, 250);
    }

    
  } else {
    background(32);
    drawdrops();
    drawsquares();
    updateRectangleposition();
    bigCircle(); 
    handleBigCirclemovement(); 
    drawmaze();
    checkcollision();
    checkPointCollision();
    checkRectangleCollision();
  }
  
  fill(255);
  textSize(17);

  if (lives > 0 && gameRunning) {
    text("Lives: " + lives, 10, 25);
    text("Press 1 (easy), 2 (medium), and 3 (hard) to change difficulty", 140, 25);
  } else if (gameRunning) {
    text("Game Over - Press spacebar to play again", 10, 30);
    gameRunning = false;
    gameReset = true;
  }

  // Reset game if lives reach 0
  if (bigcircle.x > 475 && bigcircle.y < 100) {
    gameRunning = false;
    gameReset = true;
    background(0, 55, 130);
    image(imgwinningimage, 0, 200, 600, 175);
  }

  // Reset game if lives reach 0
  if (lives <= 0 && gameReset) {
    resetgame();
    gameReset = false;
  }

  if (keyCode === 49) {
    s = 15;
  }

  if (keyCode === 50) {
    s = 19;
  }

  if (keyCode === 51) {
    s = 22;
  }
}

function keyPressed() {
  if(keyCode === 32 || gameReset) {
    gameRunning = true;
    lives = 5;
    initializegame();
    gameReset = false;

    for (let drop of drops) {
      drop.collided.fill(false);
    }
    }
  } 


function mouseClicked() {
  if (mouseX > width - 100 && mouseY > height - 100) {
    block = true;
  }
}


function initializedrops() {
  for (let i = 0; i < 15; i++) { // Initialize 15 points and add them to the drops array through key-value assignment, only happens once because it is function setup
    let drop = {};
    drop.x = random(485, 545);
    drop.y = random(355, 500);
    drop.speedX = random(-0.25, 0.25);
    drop.speedY = random(-0.25, 0.25);

    drop.x1 = random(500, 400);
    drop.y1 = random(420, 360);
    drop.speedX1 = random(-0.25, 0.25);
    drop.speedY1 = random(-0.25, 0.25);

    drop.x2 = random(440, 310);
    drop.y2 = random(490, 440);
    drop.speedX2 = random(-0.25, 0.25);
    drop.speedY2 = random(-0.25, 0.25);

    drop.x3 = random(380, 310);
    drop.y3 = random(330, 450);
    drop.speedX3 = random(-0.25, 0.25);
    drop.speedY3 = random(-0.25, 0.25);

    drop.x4 = random(310, 520);
    drop.y4 = random(330, 280);
    drop.speedX4 = random(-0.5, 0.5);
    drop.speedY4 = random(-0.25, 0.25);

    drop.x5 = random(520, 575);
    drop.y5 = random(120, 330);
    drop.speedX5 = random(-0.5, 0.5);
    drop.speedY5 = random(-0.25, 0.25);

    drop.x6 = random(225, 575);
    drop.y6 = random(120, 180);
    drop.speedX6 = random(-0.25, 0.25);
    drop.speedY6 = random(-0.25, 0.25);

    drop.x7 = random(120, 500);
    drop.y7 = random(200, 250);
    drop.speedX7 = random(-0.25, 0.25);
    drop.speedY7 = random(-0.25, 0.25);

    drop.x8 = random(225, 250);
    drop.y8 = random(225, 350);
    drop.y9 = random(350, 550);
    drop.speedX8 = random(-0.25, 0.25);
    drop.speedY8 = random(-0.25, 0.25);
    drop.speedY9 = random(-0.25, 0.25);

    drop.x10 = random(120, 250);
    drop.y10 = random(480, 550);
    drop.speedX10 = random(-0.25, 0.25);
    drop.speedY10 = random(-0.25, 0.25);

    drop.x11 = random(60, 120);
    drop.y11 = random(480, 255);
    drop.y12 = random(255, 120);
    drop.speedX11 = random(-0.25, 0.25);
    drop.speedY11 = random(-0.25, 0.25);
    drop.speedY12 = random(-0.25, 0.25);

    drop.x13 = random(60, 485);
    drop.y13 = random(50, 100);
    drop.speedX13 = random(-0.25, 0.25);
    drop.speedY13 = random(-0.25, 0.25);

    drop.collided = new Array(14).fill(false); // Add this line to initialize the collided array
    drops.push(drop);
  }
}

function initializegame() {
  bigcircle.x = (515);
  bigcircle.y = (530);
  bigcircle.size = (30);
}


function drawdrops() {
  
  for (let drop of drops) {
    // Move the drop by adding its speed to its position
    drop.x = drop.x + drop.speedX;
    drop.y = drop.y + drop.speedY;

    drop.x1 = drop.x1 + drop.speedX1;
    drop.y1 = drop.y1 + drop.speedY1;

    drop.x2 = drop.x2 + drop.speedX2;
    drop.y2 = drop.y2 + drop.speedY2;

    drop.x3 = drop.x3 + drop.speedX3;
    drop.y3 = drop.y3 + drop.speedY3;

    drop.x4 = drop.x4 + drop.speedX4;
    drop.y4 = drop.y4 + drop.speedY4;

    drop.x5 = drop.x5 + drop.speedX5;
    drop.y5 = drop.y5 + drop.speedY5;

    drop.x6 = drop.x6 + drop.speedX6;
    drop.y6 = drop.y6 + drop.speedY6;

    drop.x7 = drop.x7 + drop.speedX7;
    drop.y7 = drop.y7 + drop.speedY7;

    drop.x8 = drop.x8 + drop.speedX8;
    drop.y8 = drop.y8 + drop.speedY8;
    drop.y9 = drop.y9 + drop.speedY9;

    drop.x10 += drop.speedX10;
    drop.y10 += drop.speedY10;

    drop.x11 += drop.speedX11;
    drop.y11 += drop.speedY11;
    drop.y12 += drop.speedY12;

    drop.x13 += drop.speedX13;
    drop.y13 += drop.speedY13;

    strokeWeight(4);

    if (drop.x < 485 || drop.x > 545) {
      drop.speedX *= -1;
    }
    if (drop.y < 355 || drop.y > 500) {
      drop.speedY *= -1;
    }

    if (drop.x1 < 400|| drop.x1 > 500) {
      drop.speedX1 *= -1;
    }
    if (drop.y1 < 360 || drop.y1 > 420) {
      drop.speedY1 *= -1;
    }

    if (drop.x2 < 310 || drop.x2 > 440) {
      drop.speedX2 *= -1;
    }

    if (drop.y2 > 490 || drop.y2 < 440) {
      drop.speedY2 *= -1;
    }

    if (drop.x3 < 310 || drop.x3 > 380) {
      drop.speedX3 *= -1;
    }

    if (drop.y3 < 330 || drop.y3 > 450) {
      drop.speedY3 *= -1;
    }

    if (drop.x4 < 310 || drop.x4 > 520) {
      drop.speedX4 *= -1;
    }
    if (drop.y4 < 280 || drop.y4 > 330) {
      drop.speedY4 *= -1;
    }

    if (drop.x5 < 520 || drop.x5 > 575) {
      drop.speedX5 *= -1;
    }
    if (drop.y5 < 120 || drop.y5 > 330) {
      drop.speedY5 *= -1;
    }

    if (drop.x6 < 225 || drop.x6 > 575) {
      drop.speedX6 *= -1;
    }
    if (drop.y6 < 120 || drop.y6 > 180) {
      drop.speedY6 *= -1;
    }

    if (drop.x7 < 120 || drop.x7 > 500) {
      drop.speedX7 *= -1;
    }
    if (drop.y7 < 200 || drop.y7 > 250) {
      drop.speedY7 *= -1;
    }

    if (drop.x8 < 225 || drop.x8 > 250) {
      drop.speedX8 *= -1;
    }
    if (drop.y8 < 225 || drop.y8 > 350) {
      drop.speedY8 *= -1;
    }
    if (drop.y9 < 350 || drop.y9 > 550) {
      drop.speedY9 *= -1;
    }

    if (drop.x10 < 120 || drop.x10 > 250) {
      drop.speedX10 *= -1;
    }
    if (drop.y10 < 480 || drop.y10 > 550) {
      drop.speedY10 *= -1;
    }

    if (drop.x11 < 60 || drop.x11 > 120) {
      drop.speedX11 *= -1;
    }
    if (drop.y11 < 255 || drop.y11 > 480) {
      drop.speedY11 *= -1;
    }

    if (drop.x12 < 60 || drop.x12 > 120) {
      drop.speedX12 *= -1;
    }
    if (drop.y12 < 120 || drop.y12 > 255) {
      drop.speedY12 *= -1;
    }

    if (drop.x13 < 60 || drop.x13 > 485) {
      drop.speedX13 *= -1;
    }
    if (drop.y13 < 50 || drop.y13 > 100) {
      drop.speedY13 *= -1;
    }

    if (!drop.collided) {
      stroke(255, 204, 0);
    } else {
      stroke (32);
    }
   
    stroke(drop.collided[0] ? color(32) : color(255, 204, 0));
    point(drop.x, drop.y);
    stroke(drop.collided[1] ? color(32) : color(255, 204, 0));
    point(drop.x1, drop.y1);
    stroke(drop.collided[2] ? color(32) : color(255, 204, 0));
    point(drop.x2, drop.y2);
    stroke(drop.collided[3] ? color(32) : color(255, 204, 0));
    point(drop.x3, drop.y3);
    stroke(drop.collided[4] ? color(32) : color(255, 204, 0));
    point(drop.x4, drop.y4);
    stroke(drop.collided[5] ? color(32) : color(255, 204, 0));
    point(drop.x5, drop.y5);
    stroke(drop.collided[6] ? color(32) : color(255, 204, 0));
    point(drop.x6, drop.y6);
    stroke(drop.collided[7] ? color(32) : color(255, 204, 0));
    point(drop.x7, drop.y7);
    stroke(drop.collided[8] ? color(32) : color(255, 204, 0));
    point(drop.x8, drop.y8);
    stroke(drop.collided[9] ? color(32) : color(255, 204, 0));
    point(drop.x8, drop.y9);
    stroke(drop.collided[10] ? color(32) : color(255, 204, 0));
    point(drop.x10, drop.y10);
    stroke(drop.collided[11] ? color(32) : color(255, 204, 0));
    point(drop.x11, drop.y11);
    stroke(drop.collided[12] ? color(32) : color(255, 204, 0));
    point(drop.x11, drop.y12);
    stroke(drop.collided[13] ? color(32) : color(255, 204, 0));
    point(drop.x13, drop.y13);

    }
}

function drawsquares() {

  fill(255, 0, 0);
  noStroke();

  rect(rectX, 430, s, s); 
  rect(370, rect1Y, s, s); 
  rect(rect2X, 200, s, s); 
  rect(250, rect3Y, s, s); 
  rect(120, rect4Y, s + 3, s + 3); 
  rect(rect5X, 480, s, 20); 
  rect(120, rect6Y, s, s); 
}

function updateRectangleposition() {
  rectX += direction;
  rect1Y += direction1;
  rect2X += direction2;
  rect3Y += direction3;
  rect4Y += direction4;
  rect5X += direction5;
  rect6Y += direction6;

  if (rectX >= 430 || rectX <= 405) {
    direction *= -1; // Reverse direction
  }
  if (rect1Y >= 310 || rect1Y <= 285) {
    direction1 *= -1;
  }
  if (rect2X >= 556 || rect2X <= 530) {
    direction2 *= -1;
  }
  if (rect3Y >= 155 || rect3Y <= 125) {
    direction3 *= -1;
  }
  if (rect4Y >= 230 || rect4Y <= 200) {
    direction4 *= -1;
  }
  if (rect5X >= 230 || rect5X <= 200) {
    direction5 *= -1;
  }
  if (rect6Y >= 80 || rect6Y <= 60) {
    direction6 *= -1;
  }
}


function bigCircle() {
  fill(255);
  stroke(255);
  ellipse(bigcircle.x, bigcircle.y, bigcircle.size, bigcircle.size);

  // Check if the big circle has moved off the screen horizontally
  if (bigcircle.x > width) {
    bigcircle.x = originalBigCirclePos.x;
  } else if (bigcircle.x < 0) {
    bigcircle.x = originalBigCirclePos.x;
  }

  // Check if the big circle has moved off the screen vertically
  if (bigcircle.y > height) {
    bigcircle.y = originalBigCirclePos.y;
  } else if (bigcircle.y < 0) {
    bigcircle.y = originalBigCirclePos.y;
  }
}

function handleBigCirclemovement() {
  if (keyIsDown(LEFT_ARROW)) {
    bigcircle.x -= 2;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    bigcircle.x += 2;
  }

  if (keyIsDown(UP_ARROW)) {
    bigcircle.y -= 2;
  }

  if (keyIsDown(DOWN_ARROW)) {
    bigcircle.y += 2;
  }
}

function drawmaze() {
  image(imgfinishline, 480, 40, 70, 70);

  strokeWeight(2);
  stroke(255);
  
  line(545, 535, 545, 355);
  line(485, 535, 485, 425);
  line(545, 355, 400, 355);
  line(485, 425, 450, 425);
  line(400, 355, 400, 440);
  line(450, 425, 450, 490);
  line(450, 490, 310, 490);
  line(400, 440, 380, 440);
  line(310, 490, 310, 280);
  line(380, 440, 380, 330)
  line(380, 330, 575, 330);
  line(310, 280, 520, 280);
  line(520, 280, 520, 180);
  line(575, 330, 575, 120);
  line(520, 180, 250, 180);
  line(575, 120, 190, 120);
  line(250, 180, 250, 200);
  line(190, 120, 190, 200);
  line(190, 255, 190, 480);
  line(250, 200, 490, 200);
  line(490, 200, 490, 255);
  line(490, 255, 250, 255);
  line(250, 255, 250, 550);
  line(190, 480, 120, 480);
  line(250, 550, 60, 550);
  line(60, 550, 60, 50);
  line(120, 480, 120, 255);
  line(120, 255, 190, 255);
  line(120, 200, 190, 200);
  line(120, 200, 120, 100);
  line(60, 50, 500, 50);
  line(120, 100, 500, 100);

}

function checkcollision() {
  for (let line of lines) {
    if (lineIntersectsCircle(line[0], line[1], line[2], line[3], bigcircle.x, bigcircle.y, bigcircle.size / 2)) {
      bigcircle.x = originalBigCirclePos.x;
      bigcircle.y = originalBigCirclePos.y;
      lives--; // Decrease lives by 1
      resetgame();
      break;
    }
  }
}
function lineIntersectsCircle(x1, y1, x2, y2, cx, cy, r) {
  let distX = x2 - x1;
  let distY = y2 - y1;
  let len = sqrt(distX * distX + distY * distY);

  let dot = (((cx - x1) * distX) + ((cy - y1) * distY)) / (len * len);

  let closestX = x1 + (dot * distX);
  let closestY = y1 + (dot * distY);

  if (!isPointOnLineSegment(x1, y1, x2, y2, closestX, closestY)) {
    return false;
  }

  let distToCircleEdge = dist(closestX, closestY, cx, cy);
  return distToCircleEdge <= r;
}

function isPointOnLineSegment(x1, y1, x2, y2, px, py) {
  let minX = min(x1, x2);
  let maxX = max(x1, x2);
  let minY = min(y1, y2);
  let maxY = max(y1, y2);

  return px >= minX && px <= maxX && py >= minY && py <= maxY;
}

// If a collision is detected and the collided status is false, it updates the collided status to true and decreases the size of the bigcircle.

function checkPointCollision() {
  collision = false;

  for (let drop of drops) {
    if (!drop.collided[0] && pointIntersectsCircle(drop.x, drop.y, bigcircle.x, bigcircle.y, bigcircle.size / 2)) {
      drop.collided[0] = true; // Mark this point as collided
      collision = true;
    }
    if (!drop.collided[1] && pointIntersectsCircle(drop.x1, drop.y1, bigcircle.x, bigcircle.y, bigcircle.size / 2)) {
      drop.collided[1] = true;
      collision = true;
    }
    if (!drop.collided[2] && pointIntersectsCircle(drop.x2, drop.y2, bigcircle.x, bigcircle.y, bigcircle.size / 2)) {
      drop.collided[2] = true;
      collision = true;
    }
    if (!drop.collided[3] && pointIntersectsCircle(drop.x3, drop.y3, bigcircle.x, bigcircle.y, bigcircle.size / 2)) {
      drop.collided[3] = true;
      collision = true;
    }
    if (!drop.collided[4] && pointIntersectsCircle(drop.x4, drop.y4, bigcircle.x, bigcircle.y, bigcircle.size / 2)) {
      drop.collided[4] = true;
      collision = true;
    }
    if (!drop.collided[5] && pointIntersectsCircle(drop.x5, drop.y5, bigcircle.x, bigcircle.y, bigcircle.size / 2)) {
      drop.collided[5] = true;
      collision = true;
    }
    if (!drop.collided[6] && pointIntersectsCircle(drop.x6, drop.y6, bigcircle.x, bigcircle.y, bigcircle.size / 2)) {
      drop.collided[6] = true;
      collision = true;
    }
    if (!drop.collided[7] && pointIntersectsCircle(drop.x7, drop.y7, bigcircle.x, bigcircle.y, bigcircle.size / 2)) {
      drop.collided[7] = true;
      collision = true;
    }
    if (!drop.collided[8] && pointIntersectsCircle(drop.x8, drop.y8, bigcircle.x, bigcircle.y, bigcircle.size / 2)) {
      drop.collided[8] = true;
      collision = true;
    }
    if (!drop.collided[9] && pointIntersectsCircle(drop.x8, drop.y9, bigcircle.x, bigcircle.y, bigcircle.size / 2)) {
      drop.collided[9] = true;
      collision = true;
    }
    if (!drop.collided[10] && pointIntersectsCircle(drop.x10, drop.y10, bigcircle.x, bigcircle.y, bigcircle.size / 2)) {
      drop.collided[10] = true;
      collision = true;
    }
    if (!drop.collided[11] && pointIntersectsCircle(drop.x11, drop.y11, bigcircle.x, bigcircle.y, bigcircle.size / 2)) {
      drop.collided[11] = true;
      collision = true;
    }
    if (!drop.collided[12] && pointIntersectsCircle(drop.x11, drop.y12, bigcircle.x, bigcircle.y, bigcircle.size / 2)) {
      drop.collided[12] = true;
      collision = true;
    }
    if (!drop.collided[13] && pointIntersectsCircle(drop.x13, drop.y13, bigcircle.x, bigcircle.y, bigcircle.size / 2)) {
      drop.collided[13] = true;
      collision = true;
    }

    // Continue shrinking the bigcircle for any collisions
    if (collision) {
      bigcircle.size = max(5, bigcircle.size - 0.1);
    }
}
}



function pointIntersectsCircle(px, py, cx, cy, r) {
  let d = dist(px, py, cx, cy);
  return d <= r;
}

// The function encapsulates the Euclidean distance calculation 
// between a point and the center of a circle. 

// The function provides a boolean result (true or false) based on whether 
// the distance is within the radius of the circle. 
// This simplifies the collision detection logic to a simple if-statement.


function checkRectangleCollision() {
  // Check collision with first rectangle
  if (circleIntersectsRect(bigcircle.x, bigcircle.y, bigcircle.size / 2, rectX, 430, 10, 10)) {
    bigcircle.size = min(50, bigcircle.size + 2); // Increase size, up to a maximum of 50
  }
  // Check collision with second rectangle
  if (circleIntersectsRect(bigcircle.x, bigcircle.y, bigcircle.size / 2, 370, rect1Y, 10, 10)) {
    bigcircle.size = min(50, bigcircle.size + 2);
  }
  // Check collision with third rectangle
  if (circleIntersectsRect(bigcircle.x, bigcircle.y, bigcircle.size / 2, rect2X, 200, 10, 10)) {
    bigcircle.size = min(50, bigcircle.size + 2);
  }
  // Check collision with fourth rectangle
  if (circleIntersectsRect(bigcircle.x, bigcircle.y, bigcircle.size / 2, 250, rect3Y, 10, 10)) {
    bigcircle.size = min(50, bigcircle.size + 2);
  }
  // Check collision with fifth rectangle
  if (circleIntersectsRect(bigcircle.x, bigcircle.y, bigcircle.size / 2, 120, rect4Y, 15, 15)) {
    bigcircle.size = min(50, bigcircle.size + 2);
  }
  // Check collision with sixth rectangle
  if (circleIntersectsRect(bigcircle.x, bigcircle.y, bigcircle.size / 2, rect5X, 480, 10, 10)) {
    bigcircle.size = min(50, bigcircle.size + 2);
  }
  // Check collision with seventh rectangle
  if (circleIntersectsRect(bigcircle.x, bigcircle.y, bigcircle.size / 2, 120, rect6Y, 10, 10)) {
    bigcircle.size = min(50, bigcircle.size + 2);
  }
}

function circleIntersectsRect(cx, cy, cr, rx, ry, rw, rh) {
  // Find the closest point to the circle within the rectangle
  let closestX = constrain(cx, rx, rx + rw);
  let closestY = constrain(cy, ry, ry + rh);

  // Calculate the distance between the circle's center and this closest point
  let distanceX = cx - closestX;
  let distanceY = cy - closestY;

  // If the distance is less than the circle's radius, an intersection occurs
  let distanceSquared = distanceX * distanceX + distanceY * distanceY;
  return distanceSquared < cr * cr;
}

function resetgame() {
  initializegame();
}


