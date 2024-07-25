const { Router } = require("express");
const {
  addService,
  getServiceById,
  getAllService,
  updateService,
  deleteService,
} = require("../controllers/service.controller");

const router = Router();

router.post("/", addService);
router.get("/", getAllService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);
router.get("/:id", getServiceById);

module.exports = router;
