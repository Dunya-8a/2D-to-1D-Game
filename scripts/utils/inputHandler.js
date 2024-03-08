let keys = {
	forward: false,
	backward: false,
	left: false,
	right: false,
	shoot: false,
};

function updateKey(keyCode, value) {
	switch (keyCode) {
		case 38: // up key
		case 87: // W key; fallthrough
			keys.forward = value;
			break;
		case 40: // down key
		case 83: // S key; fallthrough
			keys.backward = value;
			break;
		case 37: // left key
		case 65: // A key; fallthrough
			keys.left = value;
			break;
		case 39: // right key
		case 68: // D key; fallthrough
			keys.right = value;
			break;
		case 32: // space key
		case 90: // Z key; fallthrough
		case 88: // X key; fallthrough
			keys.shoot = value;
			break;
	}
}

window.onkeydown = function (e) {
	updateKey(e.keyCode, true);
	e.preventDefault();
};

window.onkeyup = function (e) {
	updateKey(e.keyCode, false);
};

let buttonL = document.getElementById("buttonL");
let buttonR = document.getElementById("buttonR");
let buttonF = document.getElementById("buttonF");
let buttonB = document.getElementById("buttonB");
let buttonS = document.getElementById("buttonS");
// check for touch device
if ("ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
	document.getElementById("controls").style.display = "none";
	buttonL.ontouchstart = function () {
		keys.left = true;
		this.style.backgroundColor = "#555";
	};
	buttonL.ontouchend = function () {
		keys.left = false;
		this.style.backgroundColor = "";
	};

	buttonR.ontouchstart = function () {
		keys.right = true;
		this.style.backgroundColor = "#555";
	};
	buttonR.ontouchend = function () {
		keys.right = false;
		this.style.backgroundColor = "";
	};

	buttonF.ontouchstart = function () {
		keys.forward = true;
		this.style.backgroundColor = "#555";
	};
	buttonF.ontouchend = function () {
		keys.forward = false;
		this.style.backgroundColor = "";
	};

	buttonB.ontouchstart = function () {
		keys.backward = true;
		this.style.backgroundColor = "#555";
	};
	buttonB.ontouchend = function () {
		keys.backward = false;
		this.style.backgroundColor = "";
	};

	buttonS.ontouchstart = function () {
		keys.shoot = true;
		this.style.backgroundColor = "#555";
	};
	buttonS.ontouchend = function () {
		keys.shoot = false;
		this.style.backgroundColor = "";
	};
} else {
	document.getElementById("buttonContainer").style.display = "none";
}
