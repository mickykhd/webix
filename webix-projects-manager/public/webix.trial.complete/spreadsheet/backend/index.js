const express = require("express");

const app = express();

// parsing application/json
app.use(express.json());
// parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require("./routes")(app);

// load other assets
app.use(express.static("./"));

const port = "3000";
const host = "localhost";

app.listen(port, host, function () {
	console.log("Server is running on port " + port + "...");
	console.log(`Open http://${host}:${port}/samples in browser`);
});
