class Text {
  constructor(text, x, y, fontSize, color) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.fontSize = fontSize;
    this.color = color;
  }

  draw() {
    ctx.font = this.fontSize + "px Arial";
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);
  }
}

class Button {
  constructor(x, y, color, margin, text, ts, tcolor) {
    this.x = x;
    this.y = y;
    this.margin = margin;
    this.text = new Text(text, x + margin, y + ts, ts, tcolor);
    ctx.font = ts + "px Arial";
    this.color_default = color;
    this.color_hover = color;
    this.color_clicked = color;
    this.proportions = ctx.measureText(text);
    this.fontSize = ts;
    this.clicked = false;
    this.hover = false;
  }

  update() {
    this.clicked = false;
    this.hover = false;
    if (mouseX >= this.x && mouseX <= this.x + this.proportions.width + this.margin * 2 && mouseY >= this.y && mouseY <= this.y + this.fontSize + this.margin * 2) {
      this.hover = true;
      if (mouseClicked) {
        this.clicked = true;
        mouseClicked = false;
      }
    }
  }

  draw() {
    if (this.clicked) {
      ctx.fillStyle = this.color_clicked;
    } else if (this.hover) {
      ctx.fillStyle = this.color_hover;
    } else {
      ctx.fillStyle = this.color_default;
    }
    ctx.fillRect(this.x, this.y, this.proportions.width + this.margin * 2, this.fontSize + this.margin * 2);
    this.text.draw();
  }
}

class Menu {
  constructor() {
    this.visible = false;
    this.buttons = {};
    this.text = {};
  }

  start() {
    if (this.buttons["main"].length == 0) {return;}
    
    this.visible = true;
    
    return new Promise(resolve => this.update(resolve, Date.now()));
  }

  mainMenu() {
    this.buttons["main"] = [];
    this.text["main"] = [];
    
    this.buttons["main"].push(new Button(canvas.width / 2 - 100, canvas.height / 4 - 50, "green", 10, "Play", 40, "black"));
    this.buttons["main"][0].color_hover = "blue";
    this.buttons["main"].push(new Button(canvas.width / 2 - 100, canvas.height / 4 + 50, "green", 10, "Settings", 40, "black"));
    this.buttons["main"].push(new Button(canvas.width / 2 - 100, canvas.height / 4 + 150, "green", 10, "Exit", 40, "black"));
  }

  pause() {
    
  }

  LLS() {
    this.buttons["lose"] = [];
    this.text["lose"] = [];

    this.buttons["lose"].push(new Button(canvas.width / 2 - 100, canvas.height / 4 - 50, "red", 10, "Main Menu", 40, "black"));
    this.text["lose"].push(new Text("You Lost", canvas.width / 2 - 100, canvas.height / 4 - 50, 40, "white"));

    this.buttons["lose"][0].color_hover = "blue";
  }

  lose() {
    this.visible = true;
    return new Promise(resolve => this.loadLose(resolve, Date.now()));
  }
  
  loadLose(resolve, lastUpdateTime, name) {
    let currentTime = Date.now();
    let deltaTime = currentTime - lastUpdateTime;

    while (deltaTime < 22.2) {
      currentTime = Date.now();
      deltaTime = currentTime - lastUpdateTime;
    }

    lastUpdateTime = Date.now();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.buttons["lose"].forEach(function(button) { button.update();});

    this.draw("lose");

    if (!this.buttons["lose"][0].clicked) {
      requestAnimationFrame(this.loadLose.bind(this, resolve, currentTime));
    } else {
      this.visible = false;
      resolve();
    }
  }

  update(resolve, lastUpdateTime) { 
    let currentTime = Date.now();
    let deltaTime = currentTime - lastUpdateTime;

    while (deltaTime < 22.2) {
      currentTime = Date.now();
      deltaTime = currentTime - lastUpdateTime;
    }
    

    lastUpdateTime = Date.now();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    this.buttons["main"].forEach(function(button) { button.update();});

    this.draw("main");

    if (!this.buttons["main"][0].clicked) {
      requestAnimationFrame(this.update.bind(this, resolve, lastUpdateTime));
    } else {
      this.visible = false;
      resolve();
    }
  }

  draw(name) {
    if (!this.visible) {return;}
    this.buttons[name].forEach(function(button) {button.draw();});
    this.text[name].forEach(function(text) {text.draw();});
    
  }
}