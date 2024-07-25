const { Router } = require("express");
const router = Router();

const {
  newOTP,
  verifyOTP,
  getAllOTP,
  getOTPById,
  deleteOTP,
  updateOTP,
} = require("../controllers/otp.controller");
// const  = require("./spec_social.routes");

router.post("/newotp", newOTP);
router.post("/verify", verifyOTP);
router.get("/", getAllOTP);
router.get("/:id", getOTPById);
router.delete("/:id", deleteOTP);
router.put("/:id", updateOTP);

module.exports = router;
