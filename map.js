let plats = ["imgs/plat1.png", "imgs/plat2.png", "imgs/plat3.png"];

class Platform {
  constructor(x, y, width, height, color, bounciness) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = 50;
    this.color = color;
    this.bounciness = bounciness;
    this.platList = [];
  }

  draw(ax, ay) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - ax, this.y - ay, this.width, this.height);
    
    for (let i = 0; i < this.width / 100; i++) {
      let img = document.createElement("img");
      if (this.platList.length  <= i + 1) {
        this.platList.push(plats[Math.floor(Math.random() * plats.length)]);
        img.src = this.platList[i];
      } else {
        img.src = this.platList[i];
      }
      ctx.drawImage(img, this.x - ax + i*100, this.y - ay, 100, this.height);
    }
  }
}

class WinPortal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;
  }

  draw(ax, ay) {
    let winImg1 = document.createElement("img");
    let winImg2 = document.createElement("img");
    let winImg3 = document.createElement("img");
    
    winImg1.src = "imgs/crystal_blue.png";
    winImg2.src = "imgs/crystal_green.png";
    winImg3.src = "imgs/crystal_red.png";
    
    ctx.drawImage(winImg1, this.x - ax, this.y - ay, this.width, this.height);
    ctx.drawImage(winImg2, this.x - ax + 25, this.y - ay, this.width, this.height);
    ctx.drawImage(winImg3, this.x - ax + 50, this.y - ay, this.width, this.height);
  }
}

class Spike {
  constructor(x, y, base, height, color) {
    this.x = x; 
    this.y = y;
    this.base = base;
    this.height = height;
    this.color = color;
  }

  draw(ax, ay) {
    drawTriangle(ctx, this.x - ax, this.y - ay, this.base, this.height, this.color);
  }
}

class Lava {
  constructor(x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = 30;
  }

  draw(ax, ay) {
    ctx.fillStyle = "orange";
    ctx.fillRect(this.x - ax, this.y - ay, this.width, this.height);
    
    for (let i = 0; i < this.width / 100; i++) {
      let img = document.createElement("img");
      img.src = "imgs/lava.png";

      ctx.drawImage(img, this.x - ax + i*100, this.y - ay, 100, this.height);
    }
  }
}

class Map {
  constructor() {
    this.platforms = [];
    this.lava = [];
    this.spikes = [];
    this.winPortal = null;
    this.spawnPoint = {x: 0, y: 0};
  }

  map1() {
    this.platforms.push(new Platform(300, 275, 100, 50, "grey", 0));
    this.platforms.push(new Platform(500, 275, 100, 50, "grey", 0));
    this.platforms.push(new Platform(0, 325, 1500, 50, "grey", 0));
    this.spikes.push(new Spike(100, 325, 50, 50, "black"));
    this.lava.push(new Lava(400, 295, 100));
    this.winPortal = new WinPortal(900, 290);

    this.spawnPoint = {x: 0, y: 0};
  }

  draw(ax, ay) {
    this.winPortal.draw(ax, ay);
    this.platforms.forEach(function(platform) {platform.draw(ax, ay);});
    this.spikes.forEach(function(spike) {spike.draw(ax, ay);});
    this.lava.forEach(function(lava) {lava.draw(ax, ay);});
  }
}