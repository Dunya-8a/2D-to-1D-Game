import { createServer } from "http";
import { readFileSync } from "fs";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { Server as SocketIOServer } from "socket.io";

try {
	const index = readFileSync("../index.html");
	const port = new SerialPort({ path: "/dev/cu.usbmodem1101", baudRate: 14400 });
	const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

	const app = createServer(function (_req, res) {
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(index);
	});

	// Specify the CORS options
	const io = new SocketIOServer(app, {
		cors: {
			origin: ["http://localhost:5500", "http://127.0.0.1:5500", "*"], // Allow only this origin to connect
			methods: ["GET", "POST"], // Allowed request methods
			// allowedHeaders: ["my-custom-header"], // Custom headers here
			credentials: true, // Allow credentials (cookies, session IDs)
		},
	});

	io.on("connection", () => console.log("Node is listening to port"));

	parser.on("data", (data) => {
		try {
			if (!data) {
				console.log("Data not found!");
			} else {
				io.emit("data", data);
			}
		} catch (error) {
			console.log("Error:", error);
		}
	});

	app.listen(3000);
} catch (error) {
	console.log("Error:", error);
}
