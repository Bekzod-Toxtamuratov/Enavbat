const { Router } = require("express");
const {
  addSpec_service,
  getAllSpec_service,
  getSpec_ServiceById,
  updateSpec_serivce,
  deleteSpec_service,
} = require("../controllers/spec_service.controller");

const router = Router();

router.post("/", addSpec_service);
router.get("/", getAllSpec_service);

router.get("/:id", getSpec_ServiceById);
router.put("/:id", updateSpec_serivce);

router.delete("/:id", deleteSpec_service);

module.exports = router;
