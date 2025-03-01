const express = require('express');
const router = express.Router();

const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const adminController = require("../controllers/adminController")

const storage = multer.diskStorage({
    destination: "./public/media",
    filename: (req, file, cb) => {
      cb(null, uuidv4() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage});

const localRestrictor = require("../utils/localRestrictor")

router.use(localRestrictor.restrict)

router.get('/', adminController.loginPage)

router.post('/log-in-data', upload.none(), adminController.loginData)

router.get('/dashboard', adminController.dashboardPage)

router.get('/write', adminController.writePage)

router.get('/read-messages', adminController.readMessages)

router.get('/my-account', adminController.myAccount)

router.get('/change-usr', adminController.changeUsr)

router.get('/change-pass', adminController.changePass)

router.delete('/delete', adminController.delete)

router.delete('/delete-msg', adminController.deleteMsg)

router.post("/upload", upload.any(), adminController.upload)

router.post("/change-usr-data", upload.any(), adminController.changeUsrData)

router.post("/change-pass-data", upload.any(), adminController.changePassData)

module.exports = router;