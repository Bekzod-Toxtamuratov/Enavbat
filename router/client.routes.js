const { Router } = require("express");
const {
  addClient,
  getAllClient,
  updateClient,
  deleteClient,
  getClientById,
} = require("../controllers/client.controller");

const router = Router();

router.post("/", addClient);
router.get("/", getAllClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);
router.get("/:id", getClientById);

module.exports = router;
