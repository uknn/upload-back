const express = require('express');
const imageRoute = express.Router();
const imageController = require("../controllers/image.controller");
const loginController = require("../controllers/login.controller");
const verifyTokenMiddleware = require("../middlewares/auth");
const checkDuplicateMiddleware = require("../middlewares/check-duplicate");
const multer = require('multer');

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    },
    destination: (req, file, cb) => {
        cb(null, 'D:/dev/uploads/');
    },
});

const upload = multer({ storage: storage });

imageRoute.get("/load", verifyTokenMiddleware.verifyToken, imageController.load)
imageRoute.post("/create", verifyTokenMiddleware.verifyToken, upload.single("file"), imageController.create)
imageRoute.delete("/delete/:id", verifyTokenMiddleware.verifyToken, imageController.deleteImage)
imageRoute.post("/auth/login", loginController.login)
imageRoute.post("/auth/register", checkDuplicateMiddleware.checkDuplicate, checkDuplicateMiddleware.checkEmailDuplicate, loginController.register)
imageRoute.post("/auth/logout", loginController.logout)

module.exports = imageRoute;