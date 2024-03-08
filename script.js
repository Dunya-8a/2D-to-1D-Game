let canvasElem2d = document.getElementById("canvas2d");
canvasElem2d.width = "300";
canvasElem2d.height = "300";

let canvasElem1d = document.getElementById("canvas1d");
canvasElem1d.width = "150";
canvasElem1d.height = "200";

let ctx2d = canvasElem2d.getContext("2d");
let ctx1d = canvasElem1d.getContext("2d");

// Define the FOV and calculate the angle between rays
const FOV = Math.PI / 2; // 90 degrees in radians, representing a typical FOV for a first-person perspective
const resolution = canvasElem1d.width; // The number of rays to cast corresponds to the canvas width
const angleBetweenRays = FOV / resolution;

let textures1D = [
	[
		{ r: 255, g: 255, b: 255 },
		{ r: 192, g: 192, b: 192 },
		{ r: 128, g: 128, b: 128 },
		{ r: 64, g: 64, b: 64 },
		{ r: 128, g: 128, b: 128 },
		{ r: 192, g: 192, b: 192 },
	],
	[
		{ r: 0, g: 0, b: 255 },
		{ r: 0, g: 64, b: 192 },
		{ r: 0, g: 128, b: 128 },
		{ r: 0, g: 192, b: 64 },
		{ r: 0, g: 128, b: 128 },
		{ r: 0, g: 64, b: 192 },
	],
	[
		{ r: 255, g: 0, b: 0 },
		{ r: 255, g: 128, b: 0 },
		{ r: 255, g: 255, b: 0 },
		{ r: 0, g: 255, b: 0 },
		{ r: 0, g: 0, b: 255 },
		{ r: 255, g: 0, b: 255 },
	],
	[
		{ r: 255, g: 255, b: 255 },
		{ r: 128, g: 128, b: 128 },
	],
	[
		{ r: 255, g: 255, b: 0 },
		{ r: 128, g: 128, b: 0 },
	],
	[{ r: 128, g: 0, b: 0 }],
	[
		{ r: 255, g: 255, b: 255 },
		{ r: 255, g: 255, b: 255 },
		{ r: 0, g: 0, b: 0 },
		{ r: 255, g: 255, b: 255 },
		{ r: 0, g: 0, b: 0 },
		{ r: 0, g: 0, b: 0 },
		{ r: 255, g: 255, b: 255 },
		{ r: 0, g: 0, b: 0 },
	],
	[
		{ r: 255, g: 255, b: 255 },
		{ r: 96, g: 96, b: 96 },
	],
];

let enemyEyeColor = { r: 255, g: 255, b: 255 };
let enemyBodyColor = { r: 255, g: 0, b: 0 };

// texture for half of the enemy's face
let enemyTexture1D = [
	enemyBodyColor,
	enemyBodyColor,
	enemyEyeColor,
	{ r: 0, g: 0, b: 0 },
	enemyEyeColor,
	enemyBodyColor,
];

let gameOverBackground = { r: 0, g: 0, b: 0 };
let gameOverForeground = { r: 255, g: 255, b: 255 };
let gameOverTexture = [
	// bg
	gameOverBackground,
	gameOverBackground,
	gameOverBackground,
	gameOverBackground,
	gameOverBackground,
	gameOverBackground,

	// game
	gameOverForeground,
	gameOverForeground,
	gameOverBackground,

	gameOverForeground,
	gameOverForeground,
	gameOverBackground,

	gameOverForeground,
	gameOverForeground,
	gameOverBackground,

	gameOverForeground,
	gameOverForeground,
	gameOverBackground,

	// space
	gameOverBackground,
	gameOverBackground,

	// over
	gameOverForeground,
	gameOverForeground,
	gameOverBackground,

	gameOverForeground,
	gameOverForeground,
	gameOverBackground,

	gameOverForeground,
	gameOverForeground,
	gameOverBackground,

	gameOverForeground,
	gameOverForeground,
	gameOverBackground,

	// bg
	gameOverBackground,
	gameOverBackground,
	gameOverBackground,
	gameOverBackground,
	gameOverBackground,
	gameOverBackground,
];

let playerType = 1;
let player = {
	x: 1.5,
	y: 1.5,
	xVel: 0.0,
	yVel: 0.0,
	angVel: 0.0, // angular velocity
	type: playerType,
	direction: 0.0, // direction in radians
	cooldown: 0.0, // remaining cooldown time
	health: 100,
};

let acc = 0.005;
let fric = 0.03;

let angAcc = 0.003;
let angFric = 0.05;

let hitCooldown = 1500; // cooldown in milliseconds

let bulletSpeed = 0.1;

// view distance in blocks
let tutorialMaxViewDist = 400 / 32;
let levelMaxViewDist = 200 / 32;
let maxViewDist = tutorialMaxViewDist;

let testWorld = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let emptyWorld = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Adding obstacles
// for (let i = 0; i < 5; i++) {
// 	let randomRow = Math.floor(Math.random() * (world.length - 2)) + 1;
// 	let randomCol = Math.floor(Math.random() * (world[0].length - 2)) + 1;
// 	world[randomRow][randomCol] = 3; // 3 represents an obstacle
// }

let world = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 1, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let level = 0;
let enemyType = 2;
// enemy: {x, y, xVel, yVel, type, dir, state}
// null enemy = dead
// -state = death animation
// +state = regular animation
let enemies = [];
let spawnEnemies = true;

// bullet: {x, y, xVel, yVel, type}
let bulletType = 3;
let bullets = [];

// keep track of entities in each tile by storing their indexes as bit positions
let bulletOffset = 0; // the starting bit position for bullet indices
let bulletMax = 8; // keep track of a maximum of 8 bullets
let enemyOffset = bulletOffset + bulletMax;
let enemyMax = 16; // keep track of a maximum of 8 enemies

enemies.push({ x: 8, y: 10, xVel: 0, yVel: 0, dir: 0 });

function clearSelection() {
	document.activeElement.blur();
}

let anaglyph = false;
function toggleAnaglyph() {
	anaglyph = this.checked;
	clearSelection();
}
document.getElementById("anaglyph").onclick = toggleAnaglyph;
toggleAnaglyph.bind(document.getElementById("anaglyph"))();

let show2d = true;
function toggleDisplay2d() {
	show2d = this.checked;
	canvasElem2d.style.display = show2d ? "inline" : "none";
	clearSelection();
}
document.getElementById("show2d").onclick = toggleDisplay2d;
toggleDisplay2d.bind(document.getElementById("show2d"))();

// render quality/resolution
let maxRes = 450;
let renderQuality = 10;
function updateRenderQuality() {
	renderQuality = this.value;
	clearSelection();
}
document.getElementById("quality").onchange = updateRenderQuality;
updateRenderQuality.bind(document.getElementById("quality"))();

let bigPicture = true;
function updateCanvasSize() {
	canvasElem1d.width = bigPicture
		? window.innerWidth
		: Math.min(window.innerWidth, 450);
	canvasElem1d.height = canvasElem1d.width / 3;
	canvasElem2d.width = Math.min(window.innerWidth, 300);
}
window.onresize = updateCanvasSize;
function updateBigPicture() {
	bigPicture = this.checked;
	updateCanvasSize();
	clearSelection();
}
document.getElementById("bigPicture").onchange = updateBigPicture;
updateBigPicture.bind(document.getElementById("bigPicture"))();

let texIndex = 0;
function updateWorldTexture() {
	texIndex = parseInt(this.value);
	clearSelection();
}
document.getElementById("texture").onchange = updateWorldTexture;
updateWorldTexture.bind(document.getElementById("texture"))();

function remove(x, y) {
	if (x >= 0 && y >= 0 && y < world.length && x < world[y].length) {
		world[y][x] = 0;
		return;
	}
}

function clear(p, dir) {
	switch (dir) {
		case 1: // up
			remove(p.x, p.y - 1);
			remove(p.x, p.y - 2);
			remove(p.x, p.y - 3);
			remove(p.x + 1, p.y - 1);
			remove(p.x + 1, p.y - 2);
			remove(p.x + 1, p.y - 3);
			p.y -= 3;
			break;
		case 2: // down
			remove(p.x, p.y + 1);
			remove(p.x, p.y + 2);
			remove(p.x, p.y + 3);
			remove(p.x, p.y + 4);
			remove(p.x + 1, p.y + 1);
			remove(p.x + 1, p.y + 2);
			remove(p.x + 1, p.y + 3);
			remove(p.x + 1, p.y + 4);
			p.y += 3;
			break;
		case 3: // left
			remove(p.x - 1, p.y);
			remove(p.x - 2, p.y);
			remove(p.x - 3, p.y);
			remove(p.x - 1, p.y + 1);
			remove(p.x - 2, p.y + 1);
			remove(p.x - 3, p.y + 1);
			p.x -= 3;
			break;
		case 4: // right
			remove(p.x + 1, p.y);
			remove(p.x + 2, p.y);
			remove(p.x + 3, p.y);
			remove(p.x + 4, p.y);
			remove(p.x + 1, p.y + 1);
			remove(p.x + 2, p.y + 1);
			remove(p.x + 3, p.y + 1);
			remove(p.x + 4, p.y + 1);
			p.x += 3;
			break;
		default:
			return;
	}
	++p.dist;
}

function available(x, y) {
	if (x >= 0 && y >= 0 && y < world.length && x < world[y].length) {
		return world[y][x] == 1;
	}
	return false;
}

// generate a new world algorithmically
function generateWorld(size) {
	size = size * 3 + 1;
	enemies = [];

	// fill a 2d array
	world = [];
	for (let i = 0; i < size; ++i) {
		world.push([]);
		for (let j = 0; j < size; ++j) {
			world[i].push(1);
		}
	}

	let pathways = [];

	pathways.push({ x: 1, y: 1, dist: 0 });
	remove(1, 1);
	remove(1, 2);
	remove(2, 1);

	let maxPathway = pathways[0];

	while (pathways.length > 0) {
		for (let i = 0; i < pathways.length; ++i) {
			let p = pathways[i];
			let directions = [];
			if (available(p.x, p.y - 3)) {
				directions.push(1); // up
			}
			if (available(p.x, p.y + 4)) {
				directions.push(2); // down
			}
			if (available(p.x - 3, p.y)) {
				directions.push(3); // left
			}
			if (available(p.x + 4, p.y)) {
				directions.push(4); // right
			}

			for (let j = directions.length; j >= 0; --j) {
				if (Math.random() > 0.95) {
					// clone p for new branch
					let pathway = Object.assign({}, p);
					clear(pathway, directions[j]);
					pathways.push(pathway);
					directions.splice(j, 1);
				}
			}

			if (directions.length == 0) {
				if (p.dist > maxPathway.dist) {
					maxPathway = p;
				} else if (
					spawnEnemies &&
					p.dist > 5 &&
					enemies.length < enemyMax
				) {
					// spawn an enemy at the end of a pathway
					if (Math.random() > 0.75) {
						enemies.push({
							x: p.x + 0.5,
							y: p.y + 0.5,
							xVel: 0,
							yVel: 0,
							type: enemyType,
							dir: 0,
							state: 0,
						});
					}
				}
				pathways.splice(i, 1);
			}
		}
	}

	// add the exit block
	world[maxPathway.y][maxPathway.x] = 2;
}

let portalColor = { r: 255, g: 255, b: 255 };

function render1d() {
	let canvasWidth = canvasElem1d.width;
	let canvasHeight = canvasElem1d.height; // Now used to ensure square pixels

	// Clear the canvas or set up background if needed

	for (let i = 0; i < resolution; ++i) {
		// half the FOV to the left and right of the player's direction
		// iterate through the rays cast out from the player determined by chosen angle between rays (resolution)
		let rayAngle = player.direction - FOV / 2 + i * angleBetweenRays; // Adjust ray angle
		let color = castRay(player.x, player.y, rayAngle); // Cast ray and get color

		// Calculate the width and height of each "pixel" in the 1D strip
		let pixelWidth = canvasWidth / resolution;
		let pixelHeight = pixelWidth; // Square pixels

		// Draw the pixel with border
		ctx1d.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
		// ctx1d.lineWidth = 1;
		// ctx1d.strokeStyle = "black";
		ctx1d.fillRect(i * pixelWidth, 0, pixelWidth, pixelHeight);
	}
}

function drawStage2d() {
	let cX = canvasElem2d.width / 2;
	let cY = canvasElem2d.height / 2;
	ctx2d.strokeStyle = "yellow";
	// portal color
	ctx2d.fillStyle =
		"rgb(" +
		portalColor.r +
		"," +
		portalColor.g +
		"," +
		portalColor.b +
		")";

	for (let y = 0; y < world.length; ++y) {
		for (let x = 0; x < world[y].length; ++x) {
			if (world[y][x] > 0) {
				//ctx2d.strokeStyle = world[y][x] > 0 ? "yellow" : "red"
				ctx2d.strokeStyle = "yellow";
				ctx2d.beginPath();
				ctx2d.rect(
					(x - player.x) * 32 + cX,
					(y - player.y) * 32 + cY,
					32,
					32
				);
				if (world[y][x] == 2) {
					ctx2d.fill();
				}
				ctx2d.stroke();
			}
		}
	}
}

function drawPlayer() {
	let cX = canvasElem2d.width / 2;
	let cY = canvasElem2d.height / 2;
	ctx2d.beginPath();
	ctx2d.strokeStyle = "black";
	ctx2d.fillStyle = "#ff00ff";
	ctx2d.arc(cX, cY, 16 / 2, 0, 2 * Math.PI, false);
	ctx2d.fill();
	ctx2d.stroke();
	// left eye
	ctx2d.fillStyle = "white";
	ctx2d.beginPath();
	let leftEyeAng = player.direction - Math.PI / 5;
	let leftEyeX = cX + Math.cos(leftEyeAng) * 6;
	let leftEyeY = cY + Math.sin(leftEyeAng) * 6;
	ctx2d.arc(leftEyeX, leftEyeY, 3, 0, 2 * Math.PI, false);
	ctx2d.fill();
	ctx2d.stroke();

	// left pupil
	ctx2d.fillStyle = "black";
	ctx2d.beginPath();
	let leftPupilAng = player.direction - Math.PI / 6;
	let leftPupilX = cX + Math.cos(leftPupilAng) * 7.5;
	let leftPupilY = cY + Math.sin(leftPupilAng) * 7.5;
	ctx2d.arc(leftPupilX, leftPupilY, 1.5, 0, 2 * Math.PI, false);
	ctx2d.fill();
	ctx2d.stroke();

	// right eye
	ctx2d.fillStyle = "white";
	ctx2d.beginPath();
	let rightEyeAng = player.direction + Math.PI / 5;
	let rightEyeX = cX + Math.cos(rightEyeAng) * 6;
	let rightEyeY = cY + Math.sin(rightEyeAng) * 6;
	ctx2d.arc(rightEyeX, rightEyeY, 3, 0, 2 * Math.PI, false);
	ctx2d.fill();
	ctx2d.stroke();

	// right pupil
	ctx2d.fillStyle = "black";
	ctx2d.beginPath();
	let rightPupilAng = player.direction + Math.PI / 6;
	let rightPupilX = cX + Math.cos(rightPupilAng) * 7.5;
	let rightPupilY = cY + Math.sin(rightPupilAng) * 7.5;
	ctx2d.arc(rightPupilX, rightPupilY, 1.5, 0, 2 * Math.PI, false);
	ctx2d.fill();
	ctx2d.stroke();
}

function drawEnemies() {
	let cX = canvasElem2d.width / 2;
	let cY = canvasElem2d.height / 2;

	for (let i = 0; i < enemies.length; ++i) {
		let e = enemies[i];
		if (e == null) {
			continue;
		}

		ctx2d.beginPath();
		ctx2d.strokeStyle = "black";
		ctx2d.fillStyle = "#ff0000";
		ctx2d.arc(
			(e.x - player.x) * 32 + cX,
			(e.y - player.y) * 32 + cY,
			16 / 2,
			0,
			2 * Math.PI,
			false
		);
		ctx2d.fill();
		ctx2d.stroke();
	}
}

function drawBullets() {
	let cX = canvasElem2d.width / 2;
	let cY = canvasElem2d.height / 2;

	for (let i = 0; i < bullets.length; ++i) {
		let b = bullets[i];

		ctx2d.beginPath();
		ctx2d.strokeStyle = "black";
		ctx2d.fillStyle = "#ffff00";
		ctx2d.arc(
			(b.x - player.x) * 32 + cX,
			(b.y - player.y) * 32 + cY,
			8 / 2,
			0,
			2 * Math.PI,
			false
		);
		ctx2d.fill();
		ctx2d.stroke();
	}
}

function render2d() {
	ctx2d.beginPath();
	ctx2d.fillStyle = "black";
	ctx2d.strokeStyle = "white";
	ctx2d.rect(0, 0, canvasElem2d.width, canvasElem2d.height);
	ctx2d.fill();
	ctx2d.stroke();
	drawStage2d();
	drawBullets();
	drawPlayer();
	drawEnemies();
}

function render() {
	//ctx2d.clearRect(0, 0, canvasElem2d.width, canvasElem2d.height)    ctx1d.beginPath()

	if (show2d) {
		render2d();
	}

	render1d();
	//ctx1d.clearRect(0, 0, canvasElem1d.width, canvasElem1d.height)
}

function checkCollision(entity, movingHoriz) {
	// check for collisions
	let leftBoundX = Math.floor(entity.x - 0.25);
	let rightBoundX = Math.ceil(entity.x + 0.25);

	let topBoundY = Math.floor(entity.y - 0.25);
	let bottomBoundY = Math.ceil(entity.y + 0.25);
	for (let y = topBoundY; y < bottomBoundY; ++y) {
		for (let x = leftBoundX; x < rightBoundX; ++x) {
			if (world[y][x] > 0) {
				if (entity == player) {
					if (world[y][x] == 2) {
						generateWorld(++level + 2);
						entity.x = 1.5;
						entity.y = 1.5;
						entity.xVel = 0;
						entity.yVel = 0;
						player.angVel = 0;
						player.direction = 0;
						document.getElementById("level").innerHTML = level;
						maxViewDist = levelMaxViewDist;
						return;
					}
				}

				if (movingHoriz) {
					if (entity.xVel > 0) {
						entity.x = x - 0.25;
					} else if (entity.xVel < 0) {
						entity.x = x + 1.25;
					}
					entity.xVel = 0;
				} else {
					if (entity.yVel > 0) {
						entity.y = y - 0.25;
					} else if (entity.yVel < 0) {
						entity.y = y + 1.25;
					}
					entity.yVel = 0;
				}
				return;
			} else if (entity != player && player.cooldown == 0) {
				// the entity is an enemy; check if touching player

				// get the distance between the enemy and the player
				let xDist = player.x - entity.x;
				let yDist = player.y - entity.y;
				let dist = Math.sqrt(xDist ** 2 + yDist ** 2);

				// check if they are touching
				if (dist < 0.25 + 0.25) {
					player.cooldown = hitCooldown;
					player.health -= 10;
				}
			}
		}
	}
}

function clearAllBulletBits() {
	for (let i = 0; i < bullets.length; ++i) {
		let b = bullets[i];
		let leftBoundX = Math.floor(b.x - 0.25);
		let rightBoundX = Math.ceil(b.x + 0.25);
		let topBoundY = Math.floor(b.y - 0.25);
		let bottomBoundY = Math.ceil(b.y + 0.25);
		for (let y = topBoundY; y < bottomBoundY; ++y) {
			for (let x = leftBoundX; x < rightBoundX; ++x) {
				if (world[y][x] < 1) {
					// set the corresponding bit index to 0
					let bulletBits = -world[y][x];
					bulletBits &= ~(1 << (i + bulletOffset));
					world[y][x] = -bulletBits;
				}
			}
		}
	}
}

function writeBulletBits(i) {
	let b = bullets[i];
	leftBoundX = Math.floor(b.x - 0.25);
	rightBoundX = Math.ceil(b.x + 0.25);
	topBoundY = Math.floor(b.y - 0.25);
	bottomBoundY = Math.ceil(b.y + 0.25);
	for (let y = topBoundY; y < bottomBoundY; ++y) {
		for (let x = leftBoundX; x < rightBoundX; ++x) {
			if (world[y][x] < 1) {
				// set the corresponding bit index to 1
				let bulletBits = -world[y][x];
				bulletBits |= 1 << (i + bulletOffset);
				world[y][x] = -bulletBits;
			}
		}
	}
}

function clearEnemyBits(i) {
	let e = enemies[i];
	let leftBoundX = Math.floor(e.x - 0.25);
	let rightBoundX = Math.ceil(e.x + 0.25);
	let topBoundY = Math.floor(e.y - 0.25);
	let bottomBoundY = Math.ceil(e.y + 0.25);
	for (let y = topBoundY; y < bottomBoundY; ++y) {
		for (let x = leftBoundX; x < rightBoundX; ++x) {
			if (world[y][x] < 1) {
				// set the corresponding bit index to 0
				let tileBits = -world[y][x];
				tileBits &= ~(1 << (i + enemyOffset));
				world[y][x] = -tileBits;
			}
		}
	}
}

function writeEnemyBits(i) {
	let e = enemies[i];
	let leftBoundX = Math.floor(e.x - 0.25);
	let rightBoundX = Math.ceil(e.x + 0.25);
	let topBoundY = Math.floor(e.y - 0.25);
	let bottomBoundY = Math.ceil(e.y + 0.25);
	for (let y = topBoundY; y < bottomBoundY; ++y) {
		for (let x = leftBoundX; x < rightBoundX; ++x) {
			if (i < enemyMax && world[y][x] < 1) {
				// set the corresponding bit index to 1
				let tileBits = -world[y][x];
				tileBits |= 1 << (i + enemyOffset);
				world[y][x] = -tileBits;
			}
		}
	}
}

function checkBulletCollision(index) {
	let b = bullets[index];

	let leftBoundX = Math.floor(b.x - 0.125);
	let rightBoundX = Math.ceil(b.x + 0.125);

	let topBoundY = Math.floor(b.y - 0.125);
	let bottomBoundY = Math.ceil(b.y + 0.125);
	for (let y = topBoundY; y < bottomBoundY; ++y) {
		for (let x = leftBoundX; x < rightBoundX; ++x) {
			if (world[y][x] > 0) {
				return true;
			}

			if (world[y][x] < 0) {
				let tileBits = -world[y][x];

				// isolate enemy bits, adjust to 0 offset
				// assumes bulletOffset < enemyOffset
				let enemyBits = tileBits >> enemyOffset;

				// look for enemies
				for (let i = 0; i < enemyMax; ++i) {
					if (enemyBits == 0) {
						// stop looking if there are no enemies
						break;
					}
					if ((enemyBits & 1) == 0) {
						// skip over this bit
						enemyBits >>= 1;
						continue;
					}
					// go to the next bit
					enemyBits >>= 1;

					let e = enemies[i];

					// get the distance between the enemy and the bullet
					let xDist = e.x - b.x;
					let yDist = e.y - b.y;
					let dist = Math.sqrt(xDist ** 2 + yDist ** 2);

					// check if they are touching
					if (dist < 0.125 + 0.25) {
						clearEnemyBits(i);
						enemies[i] = null;
						return true;
					}
				}
			}
		}
	}
	return false;
}

let brightenPortal = false;

// the standard timestep
let stepSt = 20;
function update(timestep) {
	// timestep ratio
	let tr = timestep / stepSt;

	if (keys.right) {
		player.angVel += angAcc * tr;
	} else if (keys.left) {
		player.angVel -= angAcc * tr;
	}
	player.angVel *= 1 - angFric * tr;

	player.direction += player.angVel * tr;

	let xComp = Math.cos(player.direction);
	let yComp = Math.sin(player.direction);

	if (keys.forward) {
		player.xVel += xComp * acc * tr;
		player.yVel += yComp * acc * tr;
	} else if (keys.backward) {
		player.xVel -= ((xComp * acc) / 2) * tr;
		player.yVel -= ((yComp * acc) / 2) * tr;
	}

	if (keys.shoot && bullets.length < bulletMax) {
		keys.shoot = false;
		bullets.push({
			x: player.x,
			y: player.y,
			xVel: xComp * bulletSpeed,
			yVel: yComp * bulletSpeed,
			type: bulletType,
		});
	}

	player.xVel *= 1 - fric * tr;
	player.yVel *= 1 - fric * tr;

	// check if the player is touching any e

	// remaining velocity x and y
	let rvx = Math.abs(player.xVel * tr);
	let rvy = Math.abs(player.yVel * tr);
	let xDir = player.xVel > 0 ? 1 : -1;
	let yDir = player.yVel > 0 ? 1 : -1;
	while (rvx > 0 || rvy > 0) {
		if (rvx > 1) {
			player.x += xDir;
			rvx -= 1;
		} else {
			player.x += xDir * rvx;
			rvx = 0;
		}
		checkCollision(player, true);

		if (rvy > 1) {
			player.y += yDir;
			rvy -= 1;
		} else {
			player.y += yDir * rvy;
			rvy = 0;
		}
		checkCollision(player, false);
	}

	// update damage cooldown
	if (player.cooldown > 0) {
		player.cooldown = Math.max(0, player.cooldown - timestep);
	}

	// update bullets
	clearAllBulletBits();
	let numBullets = bullets.length;
	for (let i = 0; i < bullets.length; ++i) {
		let b = bullets[i];
		if (b == null) {
			continue;
		}

		// remaining velocity x and y
		let rvx = Math.abs(b.xVel * tr);
		let rvy = Math.abs(b.yVel * tr);
		let xDir = b.xVel > 0 ? 1 : -1;
		let yDir = b.yVel > 0 ? 1 : -1;
		while (rvx > 0 || rvy > 0) {
			if (rvx > 1) {
				b.x += xDir;
				rvx -= 1;
			} else {
				b.x += xDir * rvx;
				rvx = 0;
			}
			if (checkBulletCollision(i)) {
				bullets.splice(i, 1);
				break;
			}

			if (rvy > 1) {
				b.y += yDir;
				rvy -= 1;
			} else {
				b.y += yDir * rvy;
				rvy = 0;
			}
			if (checkBulletCollision(i)) {
				bullets.splice(i, 1);
				break;
			}
		}

		if (numBullets > bullets.length) {
			--i;
			numBullets = bullets.length;
		} else {
			// update the bullet tile boundaries
			writeBulletBits(i);
		}
	}

	// update enemies
	for (let i = 0; i < enemies.length; ++i) {
		let e = enemies[i];
		if (e == null) {
			continue;
		}

		// reset the enemy tile boundaries
		clearEnemyBits(i);

		// find the direction towards the player
		let xDist = player.x - e.x;
		let yDist = player.y - e.y;
		let dist = Math.sqrt(xDist ** 2 + yDist ** 2);
		let xComp = xDist / dist;
		let yComp = yDist / dist;

		e.xVel += xComp * acc * tr;
		e.yVel += yComp * acc * tr;

		e.xVel *= 1 - fric * tr;
		e.yVel *= 1 - fric * tr;

		// remaining velocity x and y
		let rvx = Math.abs((e.xVel * tr) / 3);
		let rvy = Math.abs((e.yVel * tr) / 3);
		let xDir = e.xVel > 0 ? 1 : -1;
		let yDir = e.yVel > 0 ? 1 : -1;
		while (rvx > 0 || rvy > 0) {
			if (rvx > 1) {
				e.x += xDir;
				rvx -= 1;
			} else {
				e.x += xDir * rvx;
				rvx = 0;
			}
			checkCollision(e, true);

			if (rvy > 1) {
				e.y += yDir;
				rvy -= 1;
			} else {
				e.y += yDir * rvy;
				rvy = 0;
			}
			checkCollision(e, false);
		}

		// update the enemy tile boundaries
		writeEnemyBits(i);
	}

	let portalAnimSpeed = 5 * tr;
	let brightness = portalColor.r;
	if (brightenPortal) {
		brightness += portalAnimSpeed;
		if (brightness > 255) {
			brightness = 255;
			brightenPortal = false;
		}
	} else {
		brightness -= portalAnimSpeed;
		if (brightness < 0) {
			brightness = 0;
			brightenPortal = true;
		}
	}

	portalColor.r = brightness;
	portalColor.g = brightness;
	portalColor.b = brightness;
}

let lastTime = Date.now();
let gameOverOpacity = 0;
let gameOverTime = 5000; // animation milliseconds
function runGame() {
	let currentTime = Date.now();
	let delta = currentTime - lastTime;
	lastTime = currentTime;

	if (player.health > 0) {
		render();

		update(Math.min(delta, 100));
	} else {
		if (gameOverOpacity < 1) {
			gameOverOpacity = Math.min(
				1,
				gameOverOpacity + delta / gameOverTime
			);
		}

		render();
		let resolution = maxRes / (10 / renderQuality);
		let pixelWidth = canvasElem1d.width / resolution;
		let texPixelWidth = (resolution / gameOverTexture.length) * pixelWidth;

		for (let i = 0; i < gameOverTexture.length; ++i) {
			let startPos = Math.round(i * texPixelWidth);
			let endPos = Math.round((i + 1) * texPixelWidth);
			ctx1d.beginPath();
			let color =
				"rgba(" +
				gameOverTexture[i].r +
				"," +
				gameOverTexture[i].g +
				"," +
				gameOverTexture[i].b +
				"," +
				gameOverOpacity +
				")";
			ctx1d.fillStyle = color;
			ctx1d.rect(startPos, 0, endPos - startPos, canvasElem1d.height);
			ctx1d.fill();
		}

		if (show2d) {
			ctx2d.font = "50px Arial";
			ctx2d.fillStyle = "black";
			ctx2d.fillText("Game Over", 22, 52);
			ctx2d.fillStyle = "white";
			ctx2d.fillText("Game Over", 20, 50);
		}
	}

	requestAnimationFrame(runGame);
}
runGame();
