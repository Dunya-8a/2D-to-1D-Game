let hitCooldown = 1500; // cooldown in milliseconds
let bulletSpeed = 0.1;
let enemyType = 2;
// enemy: {x, y, xVel, yVel, type, dir, state}
// null enemy = dead
// -state = death animation
// +state = regular animation
let enemies = [];

// bullet: {x, y, xVel, yVel, type}
let bulletType = 1;
let bullets = [];

// keep track of entities in each tile by storing their indexes as bit positions
let bulletOffset = 0; // the starting bit position for bullet indices
let bulletMax = 8; // keep track of a maximum of 8 bullets
let enemyOffset = bulletOffset + bulletMax;
let enemyMax = 16; // keep track of a maximum of 8 enemies

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
					if (e != null) {
						// Check if enemy is not already eliminated
						let xDist = e.x - b.x;
						let yDist = e.y - b.y;
						let dist = Math.sqrt(xDist ** 2 + yDist ** 2);

						if (dist < 0.125 + 0.25) {
							e.health -= 50; // Reduce enemy health
							if (e.health <= 0) {
								clearEnemyBits(i); // Clear bits if enemy health is 0 or less
								enemies[i] = null; // Remove enemy if health is 0 or less
							}
							return true; // Return true as the bullet hit an enemy or a wall
						}
					}
				}
			}
		}
	}
	return false;
}

