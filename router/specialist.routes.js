const { Router } = require("express");
const {
  addSpecialist,
  getSpecialistById,
  getAllSpecialist,
  updateSpecialist,
  deleteSpecialist,
  verifyOTPspec,
} = require("../controllers/specialist.controller");

const router = Router();

router.post("/verify", verifyOTPspec);
router.post("/", addSpecialist);
router.get("/", getAllSpecialist);
router.put("/:id", updateSpecialist);
router.delete("/:id", deleteSpecialist);
router.get("/:id", getSpecialistById);

module.exports = router;
