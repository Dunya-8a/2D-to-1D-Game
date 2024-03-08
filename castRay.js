// casts a ray and returns the color of whatever it hits
function castRay(px, py, dir) {
	let xComp = Math.cos(dir);
	let yComp = Math.sin(dir);

	// slope of the line
	let m = yComp / xComp;

	let rx = px;
	let ry = py;

	let facingRight = xComp >= 0;
	let xWorldEdge = facingRight ? world[0].length : -1;

	let facingDown = yComp >= 0;
	let yWorldEdge = facingDown ? world.length : -1;

	while (true) {
		// continue to the next block

		// find out which block edge will be hit first
		let nextX = facingRight ? Math.floor(rx) + 1 : Math.ceil(rx) - 1;
		let nextY = facingDown ? Math.floor(ry) + 1 : Math.ceil(ry) - 1;

		let distX = Math.abs(nextX - rx);
		let distY = Math.abs(nextY - ry);

		// coords of the current block
		let bx;
		let by;

		let facingVertEdge = distY / distX > Math.abs(m);
		if (facingVertEdge) {
			// vertical edge collision
			rx = nextX;
			ry = py + (rx - px) * m;

			bx = facingRight ? rx : rx - 1;
			by = Math.floor(ry);
		} else {
			// horizontal edge collision
			ry = nextY;
			rx = px + (ry - py) / m;

			by = facingDown ? ry : ry - 1;
			bx = Math.floor(rx);
		}

		// return black if we hit the world edge
		if (bx == xWorldEdge || by == yWorldEdge) {
			return { r: 0, g: 0, b: 0 };
		}

		// check for a collision in the current block
		if (world[by][bx] == 0) {
			// console.log(by)
			// console.log(bx)
			// console.log(world);
			// console.log(world[by][bx]);
			continue;
		}

        // Visualize the ray
		let cX = canvasElem2d.width / 2;
		let cY = canvasElem2d.height / 2;

		ctx2d.beginPath();
		ctx2d.fillStyle = "orange";
		ctx2d.rect(
			cX + (bx - player.x) * 32,
			cY + (by - player.y) * 32,
			32,
			32
		);
		ctx2d.fill();

		ctx2d.beginPath();
		ctx2d.strokeStyle = "red";
		ctx2d.moveTo(cX, cY);
		ctx2d.lineTo(cX + (rx - player.x) * 32, cY + (ry - player.y) * 32);
		ctx2d.stroke();

		if (world[by][bx] == 2) {
			return portalColor;
		}

		let color = null;

		// a negative tile indicates there are entities inside
		if (world[by][bx] < 0) {
			// let tileBits = -world[by][bx];

			// isolate enemy and bullet bits, adjust to 0 offset
			// assumes bulletOffset < enemyOffset
			// let enemyBits = tileBits >> enemyOffset;
			// let bulletBits =
			// 	(tileBits & ~(enemyBits << enemyOffset)) >> bulletOffset;

			// // find where the ray intersects an enemy or bullet
			// let xInt = 0;
			// let yInt = 0;
			// // look for bullets first because they are likely to be closer
			// for (let i = 0; i < bulletMax; ++i) {
			// 	if (bulletBits == 0) {
			// 		// stop looking if there are no bullets
			// 		break;
			// 	}

			// 	if ((bulletBits & 1) == 0) {
			// 		bulletBits >>= 1;
			// 		continue;
			// 	}
			// 	// go to the next bit
			// 	bulletBits >>= 1;

			// 	let b = bullets[i];

			// 	let bDistX = b.x - player.x;
			// 	let bDistY = b.y - player.y;
			// 	let bDist = Math.sqrt(bDistX ** 2 + bDistY ** 2);

			// 	// find the angle between the bullet and the player
			// 	let xCompB = bDistX / bDist;
			// 	let yCompB = bDistY / bDist;

			// 	// find the distance between the bullet and the ray
			// 	let dist =
			// 		Math.abs((rx - px) * (py - b.y) - (px - b.x) * (ry - py)) /
			// 		Math.sqrt((rx - px) ** 2 + (ry - py) ** 2);

			// 	if (dist > 0.125) {
			// 		// the bullet does not collide with the ray
			// 		continue;
			// 	}

			// 	// the ray hits the bullet! return the color
			// 	let blue = (dist / 0.125) * 255;
			// 	color = { r: 255, g: 255, b: blue };
			// 	break;
			// }

			// if (color == null) {
			// 	// look for enemies
			// 	for (let i = 0; i < enemyMax; ++i) {
			// 		if (enemyBits == 0) {
			// 			// stop looking if there are no enemies
			// 			break;
			// 		}
			// 		if ((enemyBits & 1) == 0) {
			// 			// skip over this bit
			// 			enemyBits >>= 1;
			// 			continue;
			// 		}
			// 		// go to the next bit
			// 		enemyBits >>= 1;

			// 		let e = enemies[i];

			// 		// find the line from the enemy perpendicular to the player
			// 		// use player.x instead of px for 3D anaglyph
			// 		let eDistX = e.x - player.x;
			// 		let eDistY = e.y - player.y;

			// 		// let cX = canvasElem2d.width / 2
			// 		// let cY = canvasElem2d.height / 2

			// 		// calculate where the two lines intersect
			// 		if (eDistX == 0) {
			// 			// player x == enemy x
			// 			yInt = e.y;
			// 			xInt = px + (yInt - py) / m;
			// 		} else if (eDistY == 0) {
			// 			// player y == enemy y
			// 			xInt = e.x;
			// 			yInt = py + (xInt - px) * m;
			// 		} else {
			// 			// find distance between player and enemy
			// 			let eDist = Math.sqrt(eDistX ** 2 + eDistY ** 2);

			// 			// find the perpendicular angle
			// 			let xCompE = -eDistY / eDist; // -sin
			// 			let yCompE = eDistX / eDist; // cos

			// 			let a1 = -yComp;
			// 			let b1 = xComp;

			// 			let a2 = -yCompE;
			// 			let b2 = xCompE;

			// 			// ctx2d.beginPath()
			// 			// ctx2d.strokeStyle = "yellow"
			// 			// let startX = e.x + (-3 * xCompE)
			// 			// let startY = e.y + (-3 * yCompE)
			// 			// ctx2d.moveTo(cX + (startX - player.x) * 32, cY + (startY - player.y) * 32)
			// 			// let endX = e.x + (3 * xCompE)
			// 			// let endY = e.y + (3 * yCompE)
			// 			// ctx2d.lineTo(cX + (endX - player.x) * 32, cY + (endY - player.y) * 32)
			// 			// ctx2d.stroke()

			// 			// ctx2d.beginPath()
			// 			// ctx2d.strokeStyle = "yellow"
			// 			// startX = px + (-3 * xComp)
			// 			// startY = py + (-3 * yComp)
			// 			// ctx2d.moveTo(cX + (startX - player.x) * 32, cY + (startY - player.y) * 32)
			// 			// endX = px + (3 * xComp)
			// 			// endY = py + (3 * yComp)
			// 			// ctx2d.lineTo(cX + (endX - player.x) * 32, cY + (endY - player.y) * 32)
			// 			// ctx2d.stroke()

			// 			// find c values for both lines in the form ax + by = c
			// 			let c1 = a1 * px + b1 * py;
			// 			let c2 = a2 * e.x + b2 * e.y;

			// 			//console.log((a1 * c2 - a2 * c1) / (a1 * b2 - a2 * b1) + ", " + py)

			// 			// let c1 = xComp * e.x + yComp * e.y
			// 			// let c2 = xCompE * px + yCompE * py

			// 			// compute the intersection x and y
			// 			yInt = (a2 * c1 - a1 * c2) / (a2 * b1 - a1 * b2);
			// 			xInt = e.x + (yInt - e.y) * (xCompE / yCompE);

			// 			//console.log(xInt + ", " + yInt)
			// 			// let temp = yInt
			// 			// yInt = xInt
			// 			// xInt = temp
			// 		}

			// 		// ctx2d.beginPath()
			// 		// ctx2d.fillStyle = "orange"
			// 		// ctx2d.rect(cX + (bx - player.x) * 32, cY + (by - player.y) * 32, 32, 32)
			// 		// ctx2d.fill()

			// 		// ctx2d.beginPath()
			// 		// ctx2d.strokeStyle = "red"
			// 		// ctx2d.moveTo(cX, cY)
			// 		// ctx2d.lineTo(cX + (xInt - player.x) * 32, cY + (yInt - player.y) * 32)
			// 		// ctx2d.stroke()

			// 		// find distance between enemy and interception
			// 		let dist = Math.sqrt((xInt - e.x) ** 2 + (yInt - e.y) ** 2);

			// 		if (dist > 0.25) {
			// 			continue;
			// 		}

			// 		let colorIndex = Math.floor(
			// 			(dist / 0.25) * enemyTexture1D.length
			// 		);
			// 		color = enemyTexture1D[colorIndex];
			// 	}
			// }

			if (color == null) {
				continue;
			}
		} else {
            // determine the position of the ray on the block/tile
            // value between 0 and 1, where 0 represents the one edge of the tile and 1 represents the other edge
            // use that to determine the color
			let tilePos;
			if (facingVertEdge) {
				tilePos = ry % 1; // calculate fractional position on the tile
				if (facingRight) {
					tilePos = 1 - tilePos;
				}
			} else { // facing horizontal edge
				tilePos = rx % 1; // calculate fractional position on the tile
				if (facingDown) {
					tilePos = 1 - tilePos;
				}
			}
			let colorIndex = Math.floor(tilePos * textures1D[texIndex].length);
			color = textures1D[texIndex][colorIndex];
		}

		let distance = Math.sqrt((rx - px) ** 2 + (ry - py) ** 2);

		let brightness = 1.0 - Math.min(distance, maxViewDist) / maxViewDist;
		if (anaglyph) {
			brightness = Math.min(1.0, brightness + 0.3);
		}
		return {
			r: color.r * brightness,
			g: color.g * brightness,
			b: color.b * brightness,
		};
	}
}
