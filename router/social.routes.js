const { Router } = require("express");

const {
  addSocial,
  getSocialById,
  getAllSocial,
  updateSocial,
  deleteSocial,
} = require("../controllers/social.controller");

const router = Router();

router.get("/:id", getSocialById);
router.get("/", getAllSocial);

router.post("/", addSocial);

router.put("/:id", updateSocial);
router.delete("/:id", deleteSocial);

module.exports = router;
