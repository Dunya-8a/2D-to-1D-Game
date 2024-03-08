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
