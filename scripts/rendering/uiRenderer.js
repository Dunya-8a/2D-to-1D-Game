/**
 * Updates the game state based on the user's input and the elapsed time.
 * @param {number} timestep - The elapsed time since the last update in milliseconds.
 */

const ACCELERATION_INTERACTION_FACTOR = 30000;

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
						generateWorld(++level * 2 + 2);
						entity.x = 1.5;
						entity.y = 1.5;
						entity.xVel = 0;
						entity.yVel = 0;
						player.angVel = 0;
						player.direction = 0;
						player.points++;
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
					// TO DO: add visual damage feedback
				}
			}
		}
	}
}

// the standard timestep
let stepSt = 30;
function update(timestep) {
	// timestep ratio
	let tr = timestep / stepSt;

	// let potentioMapped = mapPotentiometer(potentioValue, -0.005, 0.005);
	// let imuMapped = mapIMU(imuValue, FOV);

	// console.log(potentioValue);
	// console.log(imuValue);
	// console.log(imuDirection);

	let currentImu = imuValue;
	// console.log(imuDifferenceAbs);
	if (keys.right || imuDirection === "right") {
		player.angVel += angAcc * tr;
	} else if (keys.left || imuDirection === "left") {
		player.angVel -= angAcc * tr;
	}
	// console.log(player.angVel)
	// if (keys.right || imuMapped > 0) {
	// 	player.angVel += angAcc * tr;
	// } else if (keys.left || imuMapped < 0) {
	// 	player.angVel -= angAcc * tr;
	// }
	player.angVel *= 1 - angFric * tr;

	player.direction += player.angVel * tr;
	// if (imuMapped) player.direction = imuMapped * tr;

	let xComp = Math.cos(player.direction);
	let yComp = Math.sin(player.direction);

	const addAcc = Math.abs(potentioValue) / ACCELERATION_INTERACTION_FACTOR;
	const newAcc = acc + addAcc;

	if (keys.forward || potentioValue > 0) {
		player.xVel += xComp * newAcc * tr;
		player.yVel += yComp * newAcc * tr;
	} else if (keys.backward || potentioValue < 0) {
		player.xVel -= ((xComp * newAcc) / 2) * tr;
		player.yVel -= ((yComp * newAcc) / 2) * tr;
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

	// make portal glow
	let portalAnimSpeed = 5 * tr;
	let brightness = portalColor.g;
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

	// white
	// portalColor.r = brightness;
	portalColor.g = brightness; // make portal green
	// portalColor.b = brightness;
}
