const { Router } = require("express");
const {
  addSpec_Social,
  getAllSpec_social,
  getSpec_SocialById,
  updateSpec_Social,
  deleteSpec_Social,
} = require("../controllers/spec_social.controller");

const router = Router();

router.post("/", addSpec_Social);
router.get("/", getAllSpec_social);
router.put("/:id", updateSpec_Social);
router.delete("/:id", deleteSpec_Social);
router.get("/:id", getSpec_SocialById);

module.exports = router;
