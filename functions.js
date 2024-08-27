let mouseX = 0;
let mouseY = 0;
let mouseClicked = false;

function getMousePos(canvas, evt) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

document.addEventListener("mousemove", function(evt) {
    let mousePos = getMousePos(canvas, evt);
    mouseX = mousePos.x;
    mouseY = mousePos.y;
});
document.addEventListener("mousedown", function() {
   mouseClicked = true; 
});
document.addEventListener("mouseup", function() {
    mouseClicked = false;
});

function detectCollisionL(rect1, velocity, rect2) {
    // Extract properties of rect1
    let { x: x1, y: y1, width: w1, height: h1 } = rect1;
    let { vx, vy } = velocity;

    // Extract properties of rect2
    let { x: x2, y: y2, width: w2, height: h2 } = rect2;

    // Calculate future position of rect1 based on velocity
    let futureX1 = x1;
    let futureY1 = y1;

    // Determine if rect1 will collide with rect2
    let willCollide = !(futureX1 + w1 <= x2 || x2 + w2 <= futureX1 || futureY1 + h1 <= y2 || y2 + h2 <= futureY1);

    if (willCollide) {
        // Calculate overlap in each direction
        let overlapLeft = Math.abs((futureX1 + w1) - x2);   // How much rect1 overlaps rect2 on the left side
        let overlapRight = Math.abs((x2 + w2) - futureX1);  // How much rect1 overlaps rect2 on the right side
        let overlapTop = Math.abs((futureY1 + h1) - y2);    // How much rect1 overlaps rect2 on the top side
        let overlapBottom = Math.abs((y2 + h2) - futureY1); // How much rect1 overlaps rect2 on the bottom side

        // Determine which side the collision occurred on
        let side;
        if (overlapLeft < overlapRight && overlapLeft < overlapTop && overlapLeft < overlapBottom) {
            side = 'left';
        } else if (overlapRight < overlapLeft && overlapRight < overlapTop && overlapRight < overlapBottom) {
            side = 'right';
        } else if (overlapTop < overlapLeft && overlapTop < overlapRight && overlapTop < overlapBottom) {
            side = 'top';
        } else {
            side = 'bottom';
        }

        return { collided: true, side: side };
    }

    return { collided: false, side: null };
}

function detectCollision(rect1, velocity, rect2) {
    // Extract properties of rect1
    let { x: x1, y: y1, width: w1, height: h1 } = rect1;
    let { vx, vy } = velocity;

    // Extract properties of rect2
    let { x: x2, y: y2, width: w2, height: h2 } = rect2;

    // Calculate future position of rect1 based on velocity
    let futureX1 = x1 + vx;
    let futureY1 = y1 + vy;

    // Determine if rect1 will collide with rect2
    let willCollide = !(futureX1 + w1 <= x2 || x2 + w2 <= futureX1 || futureY1 + h1 <= y2 || y2 + h2 <= futureY1);

    if (willCollide) {
        // Calculate overlap in each direction
        let overlapLeft = Math.abs((futureX1 + w1) - x2);   // How much rect1 overlaps rect2 on the left side
        let overlapRight = Math.abs((x2 + w2) - futureX1);  // How much rect1 overlaps rect2 on the right side
        let overlapTop = Math.abs((futureY1 + h1) - y2);    // How much rect1 overlaps rect2 on the top side
        let overlapBottom = Math.abs((y2 + h2) - futureY1); // How much rect1 overlaps rect2 on the bottom side

        // Determine which side the collision occurred on
        let side;
        if (overlapLeft < overlapRight && overlapLeft < overlapTop && overlapLeft < overlapBottom) {
            side = 'left';
        } else if (overlapRight < overlapLeft && overlapRight < overlapTop && overlapRight < overlapBottom) {
            side = 'right';
        } else if (overlapTop < overlapLeft && overlapTop < overlapRight && overlapTop < overlapBottom) {
            side = 'top';
        } else {
            side = 'bottom';
        }

        return { collided: true, side: side };
    }

    return { collided: false, side: null };
}

function findIntegerPointsInsideSquare(x1, y1, x2, y2, x3, y3, x4, y4) {
  let minX = Math.min(x1, x2, x3, x4);
  let maxX = Math.max(x1, x2, x3, x4);
  let minY = Math.min(y1, y2, y3, y4);
  let maxY = Math.max(y1, y2, y3, y4);

  let interiorPoints = [];
  for (let x = minX + 1; x < maxX; x++) {
      for (let y = minY + 1; y < maxY; y++) {
          if (isInsideSquare(x1, y1, x2, y2, x3, y3, x4, y4, x, y)) {
              interiorPoints.push([x, y]);
          }
      }
  }

  return interiorPoints;
}

function isInsideSquare(x1, y1, x2, y2, x3, y3, x4, y4, x, y) {
  let minX = Math.min(x1, x2, x3, x4);
  let maxX = Math.max(x1, x2, x3, x4);
  let minY = Math.min(y1, y2, y3, y4);
  let maxY = Math.max(y1, y2, y3, y4);
  return x > minX && x < maxX && y > minY && y < maxY;
}

function addElementToDictArray(dictionary, key, element) {
    // Check if the key exists and is an array
    if (dictionary.hasOwnProperty(key) && Array.isArray(dictionary[key])) {
        // Key exists as an array, push element to it
        dictionary[key].push(element);
    } else {
        // Key doesn't exist or isn't an array, create new array and add element
        dictionary[key] = [element];
    }
}

function drawTriangle(ctx, x, y, base, height, color) {
    // Begin the path for drawing
    ctx.beginPath();

    // Define the triangle's vertices based on the input parameters
    let x1 = x;
    let y1 = y;
    let x2 = x + base;
    let y2 = y;
    let x3 = x + base / 2;
    let y3 = y - height;

    // Move to the first vertex
    ctx.moveTo(x1, y1);

    // Draw lines to the other vertices
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);

    // Close the path to draw the final side of the triangle
    ctx.closePath();

    // Set the fill color and fill the triangle
    ctx.fillStyle = color;
    ctx.fill();

    // Optionally, you can stroke the outline of the triangle
    //ctx.strokeStyle = "black";
    //ctx.lineWidth = 2;
    //ctx.stroke();
}

function detectCollisionT(rect1, velocity, triangal) { //If player goes fast enough they can go through triangles. needs fix ish maybe later
    
    let a = Math.atan(triangal.height / (triangal.width / 2)) * 180 / Math.PI / 90;

    let ya = a * Math.abs(rect1.x - triangal.x);

    return rect1.y <= triangal.y + triangal.height && rect1.y + rect1.height >= triangal.y - triangal.height + ya && rect1.x + rect1.width >= triangal.x && rect1.x <= triangal.x + triangal.width;
}