const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");
const auth = require("../middleware/auth");

router.post("/", auth, historyController.saveHistory);
router.get("/", auth, historyController.getHistory);
router.get("/:id", auth, historyController.getHistoryById);

module.exports = router;
