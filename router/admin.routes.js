const { Router } = require("express");
const {
  addAdmin,
  getAdminById,
  getAllAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/admin.controller");

const router = Router();

router.post("/", addAdmin);
router.get("/", getAllAdmin);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);
router.get("/:id", getAdminById);

module.exports = router;
