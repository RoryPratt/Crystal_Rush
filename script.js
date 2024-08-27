let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let gravity = 1.5;
let KeysPressed = {};
let friction = 0.8;
let friction_air = 0.85;
let lastUpdateTime = Date.now();

/*
TODO:
Game Idea: Platformer where you need to be the first to complete the level but you can also attack enemies and players.

Player
Enemy
Background
Weapons: shockwave/repel enemy, laser
Maps: platforms, spikes, lava
Multiplayer
*/

window.addEventListener("keydown", function(e) {
  KeysPressed[e.key] = true;
});

window.addEventListener("keyup", function(e) {
  KeysPressed[e.key] = false;
});

class Player {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.easing = 0.1;
    this.width = 50;
    this.height = 50;
    this.grounded = false;
    this.gems = 0;
    this.speed = 1.3;
    this.jumpHeight = 17;
    this.cy = 0;
    this.cx = 200;
    this.tv = 50;
    this.rotation = 0;
    this.isDead = false;
  }

  restart(spawn) {
    this.isDead = false;
    this.x = spawn.x;
    this.y = spawn.y;
    this.vx = 0;
    this.vy = 0;
    this.cy = 0;
    this.cx = 200;
    this.grounded = false;
  }

  collectGems(gems) {
    for (gem in gems) {
      if (detectCollision(this, this, gem).collided) {
        
      }
    }
  }

  move() {
    if ((KeysPressed["w"] || KeysPressed["ArrowUp"] || KeysPressed["Space"]) && this.grounded) {
      this.vy -= this.jumpHeight;
      this.grounded = false;
    }
    if (KeysPressed["s"] || KeysPressed["ArrowDown"]) {
      this.vy += this.speed;
    }
    if (KeysPressed["a"] || KeysPressed["ArrowLeft"]) {
      this.vx -= this.speed;
    }
    if (KeysPressed["d"] || KeysPressed["ArrowRight"]) {
      this.vx += this.speed;
    }
  }

  update(platforms) {
    this.move();
    let collidedy = false;

    this.vy += gravity;

    if (this.vy > this.tv) {
      this.vy = this.tv;
    }
    if (this.vx > this.tv) {
      this.vx = this.tv;
    }

    this.vx *= 0.95;

    for (let i = 0; i < platforms.length; i++) {
      let platform = platforms[i];

      let result = detectCollision(this, this, platform);

      if (result.collided) {
        collidedy = true;

        switch (result.side) {
          case "top":
            this.y = platform.y - this.height;
            this.x += this.vx;
            if (this.vy > 0) { this.vy *= -platform.bounciness; }
            this.grounded = true;
            break;
          case "bottom":
            this.y = platform.y + platform.height;
            this.x += this.vx;
            if (this.vy > 0) { this.vy *= -platform.bounciness; }
            break;
          case "left":
            this.x = platform.x - this.width;
            this.y += this.vy;
            if (this.vx > 0) { this.vx *= -platform.bounciness; }
            break;
          case "right":
            this.x = platform.x + platform.width;
            this.y += this.vy;
            if (this.vx < 0) { this.vx *= -platform.bounciness; }
            break;
          default:
            console.log("Error: something went wrong with collision detection");
            break;
        }
      }
    }
    if (!collidedy) {

      this.x += this.vx;
      this.y += this.vy;

      this.grounded = false;
    }
    this.cx += (this.x + this.width / 2 - canvas.width / 2 - this.cx) * this.easing;
    this.cy += (this.y + this.height / 2 - canvas.height / 2 - this.cy) * this.easing;

    this.rotation += this.vx / 25;

    if (this.rotation / 360 > 1) {
      this.rotation %= 360;
    }
  }

  checkDeath(lava, spikes) {
    let player = this;
    lava.forEach(function(lavar) {
      if (detectCollisionL({ x: player.x, y: player.y, width: player.width, height: player.height }, { vx: player.vx, vy: player.vy }, { x: lavar.x, y: lavar.y, width: lavar.width, height: lavar.height }).collided) {
        player.isDead = true;
        return;
      }
    });

    spikes.forEach(function(spike) {
      if (detectCollisionT({ x: player.x, y: player.y, width: player.width, height: player.height }, { vx: player.vx, vy: player.vy }, { x: spike.x, y: spike.y, width: spike.base, height: spike.height })) {
        player.isDead = true;
        return;
      }
    });
  }

  draw() {
    //ctx.fillStyle = "blue";
    //ctx.fillRect(this.x - this.cx, this.y - this.cy, this.width, this.height);
    let img = document.createElement("img");
    img.src = "imgs/player.png";
    //img.style.transform = "rotate(" + Math.floor(this.rotation) + "deg)";
    //img.style.transition = "transform 1s ease";
    //console.log(img.style.transform);
    ctx.save();
    ctx.translate(this.x - this.cx + this.width / 2, this.y - this.cy + this.height / 2);
    ctx.rotate(this.rotation);
    ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }
}

class Background {
  constructor(color) {
    this.color = color;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

let background = new Background("DarkGrey");
let EnemyList = [];
let player = new Player();
let map = new Map();
let mainMenu = new Menu();
let loseMenu = new Menu();

mainMenu.mainMenu();
loseMenu.LLS();
mainMenu.visible = true;

map.map1();

async function GameLoop() {
  if (mainMenu.visible) {
    await mainMenu.start();
  }

  let currentTime = Date.now();
  let deltaTime = currentTime - lastUpdateTime;

  while (deltaTime < 22.2) {
    currentTime = Date.now();
    deltaTime = currentTime - lastUpdateTime;
  }

  lastUpdateTime = Date.now();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.draw();
  EnemyList.forEach(enemy => { enemy.draw(); });
  player.update(map.platforms);
  player.checkDeath(map.lava, map.spikes);
  map.draw(player.cx, player.cy);
  player.draw();

  if (player.isDead) {
    loseMenu.visible = true;
    player.restart(map.spawnPoint);
  }

  if (loseMenu.visible) {
    await loseMenu.lose();
    mainMenu.visible = true;
  }

  requestAnimationFrame(GameLoop);
}

GameLoop();