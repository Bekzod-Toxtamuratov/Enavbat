const { Router } = require("express");
const {
  addQueue,
  getAllQueue,
  getQueusById,
  deleteQueue,
  updateQueue,
} = require("../controllers/queue.controller");



const router = Router();

router.post("/", addQueue);
router.get("/", getAllQueue);

router.get("/:id", getQueusById);

router.put("/:id",updateQueue);

router.delete("/:id", deleteQueue);

module.exports = router;
