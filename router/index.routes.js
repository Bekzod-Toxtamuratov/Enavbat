const { Router } = require("express");

const router = Router();

const clientRoute = require("./client.routes");
const adminRoute = require("./admin.routes");
const specialistRoute = require("./specialist.routes");
const serviceRoute = require("./service.routes");
const spec_social = require("./spec_social.routes");
const socialRoute = require("./social.routes");
const optRoute = require("./otp.routes");
const spec_working_daysRoute = require("./spec_working_day.routes");
const tokenRouter = require("./token.routes");
const scec_serviceRoute = require("./spec_service.routes");
const queueRouter = require("./queue.routes");

router.use("/client", clientRoute);
router.use("/admin", adminRoute);
router.use("/specialist", specialistRoute);
router.use("/service", serviceRoute);
router.use("/spec_social", spec_social);
router.use("/social", socialRoute);
router.use("/otp", optRoute);
router.use("/spec_working_day", spec_working_daysRoute);
router.use("/token", tokenRouter);
router.use("/spec_service", scec_serviceRoute);
router.use("/queue", queueRouter);

module.exports = router;
