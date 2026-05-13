// Core game implementation for Astro-Barrier (p5.js)

const CANVAS_W = 400;
const CANVAS_H = 600;
const UI_TOP = 48;
const UI_BOTTOM = 48;
const MAX_LEVEL = 12;

const LEVELS = [
  {
    levelNumber: 1,
    timer: 30,
    ellipses: [
        { x: 40, y: UI_TOP + 80, width: 36, height: 28, speed: 1.0, path: { type: 'hv', points: [ { x: 40, y: UI_TOP + 80 }, { x: 40, y: UI_TOP + 140 }, { x: 200, y: UI_TOP + 140 } ], dir: 1 } },
      { x: 200, y: UI_TOP + 70, width: 36, height: 28, speed: 1.1, path: { type: 'h', minX: 40, maxX: CANVAS_W - 40, dir: -1 } },
      { x: 320, y: UI_TOP + 90, width: 36, height: 28, speed: 1.15, path: { type: 'h', minX: 40, maxX: CANVAS_W - 40, dir: 1 } }
    ]
  },
  {
    levelNumber: 2,
    timer: 30,
    ellipses: [
      { x: 100, y: UI_TOP + 80, width: 36, height: 28, speed: 1.0, path: { type: 'v', minY: UI_TOP + 60, maxY: UI_TOP + 160, dir: 1 } },
      { x: 200, y: UI_TOP + 70, width: 36, height: 28, speed: 1.15, path: { type: 'h', minX: 60, maxX: CANVAS_W - 60, dir: -1 } },
      { x: 300, y: UI_TOP + 90, width: 36, height: 28, speed: 1.05, path: { type: 'v', minY: UI_TOP + 60, maxY: UI_TOP + 150, dir: -1 } }
    ]
  },
  {
    levelNumber: 3,
    timer: 30,
    ellipses: [
      { x: 70, y: UI_TOP + 90, width: 36, height: 28, speed: 1.05, path: { type: 'h', minX: 50, maxX: CANVAS_W - 50, dir: 1 } },
      { x: 180, y: UI_TOP + 95, width: 36, height: 28, speed: 1.2, path: { type: 'v', minY: UI_TOP + 60, maxY: UI_TOP + 160, dir: -1 } },
      { x: 320, y: UI_TOP + 75, width: 36, height: 28, speed: 1.1, path: { type: 'h', minX: 60, maxX: CANVAS_W - 60, dir: -1 } }
    ]
  },
  {
    levelNumber: 4,
    timer: 30,
    ellipses: [
      { x: 60, y: UI_TOP + 100, width: 36, height: 28, speed: 1.2, path: { type: 'h', minX: 60, maxX: 220, dir: 1 } },
      { x: 200, y: UI_TOP + 80, width: 36, height: 28, speed: 1.25, path: { type: 'h', minX: 100, maxX: CANVAS_W - 100, dir: -1 } },
      { x: 340, y: UI_TOP + 100, width: 36, height: 28, speed: 1.2, path: { type: 'h', minX: 180, maxX: CANVAS_W - 60, dir: 1 } }
    ]
  },
  {
    levelNumber: 5,
    timer: 30,
    ellipses: [
      { x: 80, y: UI_TOP + 70, width: 36, height: 28, speed: 1.4, path: { type: 'h', minX: 40, maxX: CANVAS_W - 40, dir: 1 } },
      { x: 200, y: UI_TOP + 90, width: 36, height: 28, speed: 1.45, path: { type: 'v', minY: UI_TOP + 60, maxY: UI_TOP + 170, dir: -1 } },
      { x: 320, y: UI_TOP + 80, width: 36, height: 28, speed: 1.35, path: { type: 'h', minX: 60, maxX: CANVAS_W - 60, dir: -1 } }
    ]
  },

  // Levels 6-12: 3 enemies, 30s
  {
    levelNumber: 6,
    timer: 30,
    ellipses: [
      { x: 60, y: UI_TOP + 80, width: 34, height: 26, speed: 1.3, path: { type: 'h', minX: 40, maxX: 180, dir: 1 } },
      { x: 160, y: UI_TOP + 70, width: 34, height: 26, speed: 1.25, path: { type: 'v', minY: UI_TOP + 60, maxY: UI_TOP + 150, dir: 1 } },
      { x: 240, y: UI_TOP + 95, width: 34, height: 26, speed: 1.35, path: { type: 'h', minX: 200, maxX: CANVAS_W - 60, dir: -1 } }
    ]
  },
  {
    levelNumber: 7,
    timer: 30,
    ellipses: [
      { x: 80, y: UI_TOP + 90, width: 36, height: 28, speed: 1.4, path: { type: 'h', minX: 50, maxX: 180, dir: 1 } },
      { x: 160, y: UI_TOP + 70, width: 36, height: 28, speed: 1.35, path: { type: 'h', minX: 120, maxX: 260, dir: -1 } },
      { x: 240, y: UI_TOP + 95, width: 36, height: 28, speed: 1.5, path: { type: 'v', minY: UI_TOP + 60, maxY: UI_TOP + 160, dir: 1 } }
    ]
  },
  {
    levelNumber: 8,
    timer: 30,
    ellipses: [
      { x: 50, y: UI_TOP + 75, width: 36, height: 28, speed: 1.6, path: { type: 'h', minX: 40, maxX: 140, dir: 1 } },
      { x: 150, y: UI_TOP + 85, width: 36, height: 28, speed: 1.45, path: { type: 'v', minY: UI_TOP + 60, maxY: UI_TOP + 170, dir: -1 } },
      { x: 250, y: UI_TOP + 85, width: 36, height: 28, speed: 1.5, path: { type: 'h', minX: 180, maxX: CANVAS_W - 80, dir: 1 } }
    ]
  },
  {
    levelNumber: 9,
    timer: 30,
    ellipses: [
      { x: 60, y: UI_TOP + 95, width: 36, height: 28, speed: 1.5, path: { type: 'v', minY: UI_TOP + 70, maxY: UI_TOP + 160, dir: 1 } },
      { x: 160, y: UI_TOP + 75, width: 36, height: 28, speed: 1.6, path: { type: 'h', minX: 60, maxX: 200, dir: 1 } },
      { x: 260, y: UI_TOP + 95, width: 36, height: 28, speed: 1.55, path: { type: 'h', minX: 200, maxX: CANVAS_W - 60, dir: -1 } }
    ]
  },
  {
    levelNumber: 10,
    timer: 30,
    ellipses: [
      { x: 70, y: UI_TOP + 80, width: 38, height: 30, speed: 1.7, path: { type: 'h', minX: 40, maxX: 160, dir: 1 } },
      { x: 170, y: UI_TOP + 70, width: 38, height: 30, speed: 1.6, path: { type: 'v', minY: UI_TOP + 60, maxY: UI_TOP + 160, dir: 1 } },
      { x: 250, y: UI_TOP + 95, width: 38, height: 30, speed: 1.75, path: { type: 'h', minX: 200, maxX: CANVAS_W - 60, dir: -1 } }
    ]
  },
  {
    levelNumber: 11,
    timer: 30,
    ellipses: [
      { x: 60, y: UI_TOP + 80, width: 36, height: 28, speed: 1.9, path: { type: 'h', minX: 40, maxX: 180, dir: 1 } },
      { x: 150, y: UI_TOP + 75, width: 36, height: 28, speed: 1.95, path: { type: 'v', minY: UI_TOP + 60, maxY: UI_TOP + 160, dir: -1 } },
      { x: 250, y: UI_TOP + 95, width: 36, height: 28, speed: 2.0, path: { type: 'h', minX: 200, maxX: CANVAS_W - 60, dir: -1 } }
    ]
  },
  {
    levelNumber: 12,
    timer: 30,
    ellipses: [
      { x: 70, y: UI_TOP + 75, width: 36, height: 28, speed: 2.0, path: { type: 'h', minX: 40, maxX: 160, dir: 1 } },
      { x: 160, y: UI_TOP + 85, width: 36, height: 28, speed: 2.1, path: { type: 'v', minY: UI_TOP + 60, maxY: UI_TOP + 170, dir: 1 } },
      { x: 240, y: UI_TOP + 80, width: 36, height: 28, speed: 2.05, path: { type: 'h', minX: 200, maxX: CANVAS_W - 60, dir: -1 } }
    ]
  }
];

let gameState = 'INTRO'; // INTRO, PLAYING, GAME_OVER, WIN
let currentLevel = 1;
let lives = 2;
let bulletsRemaining = 15;
let levelTimer = 30; // seconds
let levelStartMillis = 0;

let player;
let projectiles = [];
let ellipses = [];
let barriers = [];
let sfxLaser, sfxBass;
let audioUnlocked = false;

// Preload sound assets (try Build/ first, then fall back to repo root)
function preload() {
  soundFormats('mp3', 'wav');
  sfxLaser = loadSound('laser.mp3', () => {}, () => { sfxLaser = loadSound('../Laser.mp3'); });
  sfxBass = loadSound('bass.mp3', () => {}, () => { sfxBass = loadSound('../bass.mp3'); });
}

function ensureAudioUnlocked() {
  if (audioUnlocked) return Promise.resolve();
  if (typeof userStartAudio === 'function') {
    return userStartAudio().then(() => {
      audioUnlocked = true;
    }).catch(() => {
      const ac = (typeof getAudioContext === 'function') ? getAudioContext() : (window.AudioContext && new AudioContext());
      if (ac && ac.state === 'suspended' && ac.resume) {
        return ac.resume().then(() => { audioUnlocked = true; }).catch(() => {});
      }
    });
  }
  const ac = (typeof getAudioContext === 'function') ? getAudioContext() : (window.AudioContext && new AudioContext());
  if (ac && ac.state === 'suspended' && ac.resume) {
    return ac.resume().then(() => { audioUnlocked = true; }).catch(() => {});
  }
  audioUnlocked = true;
  return Promise.resolve();
}

function playLaser() {
  if (!audioUnlocked) return;
  if (sfxLaser && typeof sfxLaser.play === 'function') sfxLaser.play();
}

function playHit() {
  if (!audioUnlocked) return;
  if (sfxBass && typeof sfxBass.play === 'function') sfxBass.play();
}

function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  frameRate(60);
  textFont('Arial');
  player = new Player();
  // Sounds are loaded in `preload()` via p5.sound
}

function draw() {
  background(18);
  drawTopUI();
  drawBottomUI();

  if (gameState === 'INTRO') {
    drawIntro();
  } else if (gameState === 'PLAYING') {
    updateGame();
    renderGame();
  } else if (gameState === 'GAME_OVER') {
    drawGameOver();
  } else if (gameState === 'WIN') {
    drawWin();
  }
}

class Player {
  constructor() {
    this.width = 40;
    this.height = 16;
    this.speed = 5;
    this.x = CANVAS_W / 2;
    this.y = CANVAS_H - UI_BOTTOM - this.height / 2 - 8;
    this.cooldown = 1000; // ms
    this.lastShot = -this.cooldown;
  }

  update() {
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    }
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }
    this.x = constrain(this.x, this.width / 2, CANVAS_W - this.width / 2);
  }

  draw() {
    fill(0, 180, 220);
    noStroke();
    push();
    translate(this.x, this.y);
    triangle(-this.width / 2, this.height / 2, this.width / 2, this.height / 2, 0, -this.height);
    pop();
  }

  canShoot() {
    return millis() - this.lastShot >= this.cooldown && bulletsRemaining > 0;
  }

  shoot() {
    if (this.canShoot()) {
      projectiles.push(new Bullet(this.x, this.y - this.height / 2));
      this.lastShot = millis();
      bulletsRemaining--;
      playLaser();
    }
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 6;
    this.h = 10;
    this.speed = 10;
    this.active = true;
  }

  update() {
    this.y -= this.speed;
    if (this.y + this.h / 2 <= UI_TOP) this.active = false;
  }

  draw() {
    noStroke();
    fill(255, 220, 60);
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h);
    rectMode(CORNER);
  }
}

class EllipseEnemy {
  constructor(x, y, w, h, path, speed) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.path = path; // {type:'h'|'v', minX,maxX or minY,maxY, dir}
    this.speed = speed || 1.5;
    this.isHit = false;
    this.hitTime = 0;

    // hv (horizontal/vertical) path: sequence of axis-aligned points (90° turns only)
    if (this.path && this.path.type === 'hv') {
      this.points = Array.isArray(this.path.points) ? this.path.points.map(p => ({ x: p.x, y: p.y })) : [];
      this.forward = (this.path.dir || 1) > 0;
      if (this.points.length >= 2) {
        if (this.forward) {
          this.currPointIndex = 0;
          this.nextPointIndex = 1;
        } else {
          this.currPointIndex = this.points.length - 1;
          this.nextPointIndex = this.currPointIndex - 1;
        }
        // snap to starting point for consistent motion
        this.x = this.points[this.currPointIndex].x;
        this.y = this.points[this.currPointIndex].y;
      } else {
        this.vx = this.speed;
        this.vy = 0;
      }
    } else if (this.path && this.path.type === 'h') {
      this.vx = this.speed * (this.path.dir || 1);
      this.vy = 0;
    } else if (this.path && this.path.type === 'v') {
      this.vx = 0;
      this.vy = this.speed * (this.path.dir || 1);
    } else {
      this.vx = this.speed;
      this.vy = 0;
    }
  }

  update() {
    if (this.isHit) return;
    // hv path movement (move along segments between axis-aligned points)
    if (this.path && this.path.type === 'hv' && this.points && this.points.length >= 2) {
      const target = this.points[this.nextPointIndex];
      const dx = target.x - this.x;
      const dy = target.y - this.y;

      if (Math.abs(dx) > 0) {
        // horizontal movement only
        const step = Math.sign(dx) * this.speed;
        this.x += step;
        if ((dx > 0 && this.x >= target.x) || (dx < 0 && this.x <= target.x)) this.x = target.x;
      } else if (Math.abs(dy) > 0) {
        // vertical movement only
        const step = Math.sign(dy) * this.speed;
        this.y += step;
        if ((dy > 0 && this.y >= target.y) || (dy < 0 && this.y <= target.y)) this.y = target.y;
      }

      // reached target point
      if (this.x === target.x && this.y === target.y) {
        this.currPointIndex = this.nextPointIndex;
        if (this.forward) {
          if (this.currPointIndex === this.points.length - 1) {
            this.forward = false;
            this.nextPointIndex = this.currPointIndex - 1;
          } else {
            this.nextPointIndex = this.currPointIndex + 1;
          }
        } else {
          if (this.currPointIndex === 0) {
            this.forward = true;
            this.nextPointIndex = this.currPointIndex + 1;
          } else {
            this.nextPointIndex = this.currPointIndex - 1;
          }
        }
      }
      return;
    }

    // default simple movement
    this.x += this.vx;
    this.y += this.vy;

    if (this.path && this.path.type === 'h') {
      if (this.x < this.path.minX) {
        this.x = this.path.minX;
        this.vx *= -1;
      }
      if (this.x > this.path.maxX) {
        this.x = this.path.maxX;
        this.vx *= -1;
      }
    }

    if (this.path && this.path.type === 'v') {
      if (this.y < this.path.minY) {
        this.y = this.path.minY;
        this.vy *= -1;
      }
      if (this.y > this.path.maxY) {
        this.y = this.path.maxY;
        this.vy *= -1;
      }
    }
  }

  draw() {
    noStroke();
    if (this.isHit) fill(255, 80, 80); else fill(160, 80, 200);
    ellipse(this.x, this.y, this.width, this.height);
  }

  hit() {
    if (!this.isHit) {
      this.isHit = true;
      this.hitTime = millis();
      playHit();
    }
  }

  isRemovable() {
    return this.isHit && millis() - this.hitTime > 500;
  }
}

class Barrier {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    fill(120);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
}

function loadLevel(levelNumber) {
  projectiles = [];
  ellipses = [];
  barriers = [];
  bulletsRemaining = 15;

  const def = LEVELS[levelNumber - 1];
  if (!def) {
    // fallback generator: create 3 horizontal lanes (365px wide), 30s timer
    levelTimer = 30;
    levelStartMillis = millis();
    const enemyCount = 3;
    const laneWidth = 365;
    const left = Math.round((CANVAS_W - laneWidth) / 2);
    const right = left + laneWidth;
    const topY = UI_TOP + 80;
    const spacing = 50;
    for (let i = 0; i < enemyCount; i++) {
      const x = left + Math.floor(Math.random() * (right - left + 1));
      const y = Math.round(topY + i * spacing);
      const w = 36;
      const h = 28;
      const path = { type: 'h', minX: left, maxX: right, dir: i % 2 === 0 ? 1 : -1 };
      const speed = 1.2 + levelNumber * 0.03 + i * 0.05;
      ellipses.push(new EllipseEnemy(x, y, w, h, path, speed));
    }
    return;
  }

  levelTimer = def.timer || 30;
  levelStartMillis = millis();
  bulletsRemaining = def.bullets || 15;

  // generate non-crossing hv (L/U) paths and barrier windows for this level
  const generated = generateHvPathsAndBarriers(def, levelNumber);
  for (let e of generated.ellipses) {
    ellipses.push(new EllipseEnemy(e.x, e.y, e.width, e.height, e.path, e.speed));
  }
  for (let b of generated.barriers) {
    barriers.push(new Barrier(b.x, b.y, b.w, b.h));
  }
}
// Generate axis-aligned L/U ('hv') paths for level enemies and barrier segments
function generateHvPathsAndBarriers(def, levelNumber) {
  // Simplified generator: produce horizontal lanes stretched 365px across the canvas
  const enemies = def.ellipses || [];
  const n = Math.min(typeof levelNumber === 'number' ? levelNumber : (def.levelNumber || enemies.length), MAX_LEVEL);
  const laneWidth = 365;
  const left = Math.round((CANVAS_W - laneWidth) / 2);
  const right = left + laneWidth;

  // vertical layout: first lane starts right under the top UI bar, lanes are equidistant
  const topY = UI_TOP + 20; // first lane just below the top UI
  const bottomLimit = CANVAS_H - UI_BOTTOM - 100; // keep lanes above player area

  let spacing = 0;
  if (n <= 1) {
    spacing = 0;
  } else {
    spacing = Math.floor((bottomLimit - topY) / (n - 1));
    if (spacing < 20) spacing = 20;
  }

  const newEllipses = [];
  for (let i = 0; i < n; i++) {
    const e = enemies[i] || {};
    const y = Math.round(topY + i * spacing);
    const w = e.width || e.w || 36;
    const h = e.height || e.h || 28;
    const speed = e.speed || 1.2 + i * 0.05;
    const dir = (i % 2 === 0) ? 1 : -1;
    const startX = left + Math.floor(Math.random() * (right - left + 1));

    newEllipses.push({
      x: startX,
      y: y,
      width: w,
      height: h,
      speed: speed,
      path: { type: 'h', minX: left, maxX: right, dir: dir }
    });
  }

  // barriers removed by design
  return { ellipses: newEllipses, barriers: [] };
}

function updateGame() {
  player.update();

  for (let p of projectiles) p.update();

  for (let e of ellipses) e.update();

  // Bullet <-> Barrier collisions
  for (let b of projectiles) {
    if (!b.active) continue;
    for (let br of barriers) {
      if (bulletHitsBarrier(b, br)) {
        b.active = false;
        break;
      }
    }
  }

  // Bullet <-> Ellipse collisions
  for (let b of projectiles) {
    if (!b.active) continue;
    for (let e of ellipses) {
      if (!e.isHit && bulletHitsEllipse(b, e)) {
        e.hit();
        b.active = false;
        break;
      }
    }
  }

  // cleanup bullets and remove enemies after hit delay
  projectiles = projectiles.filter(p => p.active);
  ellipses = ellipses.filter(e => !e.isRemovable());

  // Timer
  if (remainingTime() <= 0) {
    gameState = 'GAME_OVER';
    return;
  }

  // Out of bullets -> lose a life once active bullets finish
  if (bulletsRemaining <= 0 && projectiles.length === 0 && ellipses.length > 0) {
    loseLife();
    return;
  }

  // Level complete
  if (ellipses.length === 0) {
    levelComplete();
  }
}

function renderGame() {
  // draw gameplay items
  drawPaths();
  for (let br of barriers) br.draw();
  for (let e of ellipses) e.draw();
  for (let p of projectiles) p.draw();
  player.draw();
}

function drawPaths() {
  // render each enemy path as a bright green line
  if (!ellipses || ellipses.length === 0) return;
  push();
  stroke(0, 255, 0);
  strokeCap(ROUND);
  for (let e of ellipses) {
    if (!e.path) continue;
    const thickness = Math.max(1, e.width / 2);
    strokeWeight(thickness);
    noFill();
    if (e.path.type === 'h') {
      line(e.path.minX, e.y, e.path.maxX, e.y);
    } else if (e.path.type === 'v') {
      line(e.x, e.path.minY, e.x, e.path.maxY);
    } else if (e.path.type === 'hv') {
      const pts = e.path.points || e.points || [];
      if (pts.length >= 2) {
        for (let i = 0; i < pts.length - 1; i++) {
          const p0 = pts[i];
          const p1 = pts[i + 1];
          line(p0.x, p0.y, p1.x, p1.y);
        }
      }
    } else if (e.path.type === 'circle') {
      const cx = (e.path.cx !== undefined) ? e.path.cx : e.x;
      const cy = (e.path.cy !== undefined) ? e.path.cy : e.y;
      const r = (e.path.radius !== undefined) ? e.path.radius : Math.max(20, (e.width + e.height) / 4);
      ellipse(cx, cy, r * 2, r * 2);
    }
  }
  pop();
}

function drawTopUI() {
  noStroke();
  fill(26);
  rect(0, 0, CANVAS_W, UI_TOP);
  fill(255);
  textSize(14);
  textAlign(LEFT, CENTER);
  text(`Level: ${currentLevel}`, 10, UI_TOP / 2);
  textAlign(CENTER, CENTER);
  text(`Time: ${Math.max(0, Math.ceil(remainingTime()))}`, CANVAS_W / 2, UI_TOP / 2);
  textAlign(RIGHT, CENTER);
  text(`Lives: ${lives}  Bullets: ${bulletsRemaining}`, CANVAS_W - 10, UI_TOP / 2);
}

function drawBottomUI() {
  noStroke();
  fill(26);
  rect(0, CANVAS_H - UI_BOTTOM, CANVAS_W, UI_BOTTOM);
}

function drawIntro() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(28);
  text('ASTRO', CANVAS_W / 2, CANVAS_H / 2 - 40);
  textSize(14);
  text('A/D to move — Click to shoot (1 shot/sec)', CANVAS_W / 2, CANVAS_H / 2);
  text('Click to Start', CANVAS_W / 2, CANVAS_H / 2 + 40);
}

function drawGameOver() {
  fill(255, 60, 60);
  textAlign(CENTER, CENTER);
  textSize(32);
  text('GAME OVER', CANVAS_W / 2, CANVAS_H / 2 - 10);
  textSize(14);
  text('Click to restart', CANVAS_W / 2, CANVAS_H / 2 + 30);
}

function drawWin() {
  fill(120, 255, 120);
  textAlign(CENTER, CENTER);
  textSize(28);
  text('YOU WIN!', CANVAS_W / 2, CANVAS_H / 2 - 10);
  textSize(14);
  text('Click to play again', CANVAS_W / 2, CANVAS_H / 2 + 30);
}

function remainingTime() {
  if (gameState !== 'PLAYING') return levelTimer;
  return Math.max(0, levelTimer - (millis() - levelStartMillis) / 1000);
}

function bulletHitsBarrier(bullet, barrier) {
  const left = bullet.x - bullet.w / 2;
  const right = bullet.x + bullet.w / 2;
  const top = bullet.y - bullet.h / 2;
  const bottom = bullet.y + bullet.h / 2;
  return !(right < barrier.x || left > barrier.x + barrier.w || bottom < barrier.y || top > barrier.y + barrier.h);
}

function bulletHitsEllipse(bullet, enemy) {
  const dx = bullet.x - enemy.x;
  const dy = bullet.y - enemy.y;
  const rx = enemy.width / 2;
  const ry = enemy.height / 2;
  return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1;
}

function loseLife() {
  lives -= 1;
  if (lives <= 0) {
    gameState = 'GAME_OVER';
  } else {
    loadLevel(currentLevel);
  }
}

function levelComplete() {
  // gain life on even-numbered level completion
  if (currentLevel % 2 === 0 && lives < 2) lives += 1;
  currentLevel += 1;
  if (currentLevel > MAX_LEVEL) {
    gameState = 'WIN';
  } else {
    loadLevel(currentLevel);
  }
}

function mousePressed() {
  if (gameState === 'INTRO') {
    ensureAudioUnlocked().then(() => {
      gameState = 'PLAYING';
      loadLevel(currentLevel);
    });
    return;
  }
  if (gameState === 'PLAYING') {
    // ensure audio is unlocked before triggering sound
    ensureAudioUnlocked().then(() => {
      player.shoot();
    });
    return;
  }
  if (gameState === 'GAME_OVER' || gameState === 'WIN') {
    // restart
    currentLevel = 1;
    lives = 2;
    bulletsRemaining = 15;
    gameState = 'INTRO';
  }
}

function keyPressed() {
  // spacebar alternative for shooting
  if (key === ' ' && gameState === 'PLAYING') {
    ensureAudioUnlocked().then(() => player.shoot());
  }
}
