const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, path.join(__dirname, "images"));
	},
	filename(req, file, cb) {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

module.exports = function (app, root) {
	// show all attachments
	app.get(root + "/images/:id", (req, res, next) => {
		res.sendFile(path.join(__dirname, "images", req.params.id));
	});

	// upload new file
	app.post(root + "/images", upload.single("upload"), (req, res, next) => {
		if (req.file) {
			res.send({
				imageURL: root + "/images/" + req.file.filename,
				status: "server",
			});
		} else {
			res.status(400).send({ error: "No file uploaded" });
		}
	});
};
