let spawnEnemies = true;

let acc = 0.005;
let fric = 0.03;

let angAcc = 0.003;
let angFric = 0.05;

// view distance in blocks
let tutorialMaxViewDist = 400 / 32;
let levelMaxViewDist = 200 / 32;
let maxViewDist = tutorialMaxViewDist;

let level = 0; // starter level; 0 is tutorial
let brightenPortal = false;
let portalColor = { r: 0, g: 128, b: 0 };