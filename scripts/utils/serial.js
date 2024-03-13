// document.addEventListener('DOMContentLoaded', () => {
// Connect to the Socket.IO server
const socket = io("http://127.0.0.1:3000");

let values, potentioValue, imuValue;
let imuChange = "static";
let prevImuValue = null;

// Listen for data event
socket.on("data", function (data) {
	// console.log(data);
	// values = data.split(",");
	// let newPotentioValue = parseFloat(values[0]); // Converts string to a floating-point number
	// newPotentioValue = mapPotentiometer(newPotentioValue, -0.005, 0.005);

	// let newImuValue = parseFloat(values[1]);
	// newImuValue = mapIMU(newImuValue);

	// let imuStep = 0.2;
	// // if (newImuValue > imuValue + imuStep) {

	// // } else if (newImuValue < imuValue - imuStep) {

	// // } else if (newImuValue > imuValue - imuStep && newImuValue < imuValue + imuStep) {
	// // }

	// // Update potentioValue only if the new value is different
	// if (newPotentioValue != potentioValue) {
	// 	potentioValue = newPotentioValue;
	// 	// console.log(`potentioValue: ${potentioValue}`);
	// }

	// // Update imuValue only if the new value is different
	// if (newImuValue != imuValue) {
	// 	imuValue = newImuValue;
	// 	// console.log(`imuValue: ${imuValue}`);
	// }
	values = data.split(",");
	potentioValue = parseFloat(values[0]); // Converts string to a floating-point number
	potentioValue = mapPotentiometer(potentioValue, -100, 100);

	imuValue = parseFloat(values[4]);

	console.log(prevImuValue, imuValue, imuChange);

	if (prevImuValue !== null) {
		// Ensure prevImuValue has been set
		if (Math.abs(imuValue - prevImuValue) > 0.015) {
			imuChange = imuValue > prevImuValue ? "right" : "left";
			prevImuValue = imuValue; // Update prevImuValue only when the difference is greater than 0.2
		} else {
			imuChange = "static";
		}
	} else {
		prevImuValue = imuValue; // Initialize prevImuValue on the first run
	}

	// // imuValue = mapIMU(imuValue);
	// let stepImuValue;

	// let imuDifference = imuValue - stepImuValue;

	// switch (imuDifference) {
	// 	case imuDifference > 0.2:
	// 		imuChange = "right";
	// 		break;
	// 	case imuDifference < -0.2:
	// 		imuChange = "left";
	// 		break;
	// 	case imuDifference > -0.2 && imuDifference < 0.2:
	// 		imuChange = "static";
	// 		break;
	// }

	// let imuStep = 0.2;

	// // // Update imuValue only if the new value is different
	// if (stepImuValue - imuValue > imuStep || stepImuValue - imuValue < -imuStep) {
	// 	stepImuValue = imuValue;
	// 	// console.log(`imuValue: ${imuValue}`);
	// }

	// if (newImuValue > imuValue + imuStep) {

	// } else if (newImuValue < imuValue - imuStep) {

	// } else if (newImuValue > imuValue - imuStep && newImuValue < imuValue + imuStep) {
	// }

	// Update potentioValue only if the new value is different
	// if (newPotentioValue != potentioValue) {
	// 	potentioValue = newPotentioValue;
	// 	// console.log(`potentioValue: ${potentioValue}`);
	// }
});
