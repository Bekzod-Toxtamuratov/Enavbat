// const {Router}=require("express");

// const {addToken}=require("../controllers/token.controller");

// const router = Router();

// router.post("/token",addToken);

// module.exports = router;

const { Router } = require("express");
const {
  addToken,
  getTokenById,
  getAllToken,
  deleteToken,
  updateToken,
} = require("../controllers/token.controller");

const router = Router();

router.post("/", addToken);
router.get("/", getAllToken);
router.get("/:id", getTokenById);

router.put("/:id", updateToken);
router.delete("/:id", deleteToken);

module.exports = router;
