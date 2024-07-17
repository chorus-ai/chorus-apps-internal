const { Router } = require("express");
const router = Router();

const authRouter = require("./auth");
const userRouter = require("./user");
const featureRouter = require("./feature");
const bucketRouter = require("./bucket");
const logRouter = require("./log");

const cadaProjectRouter = require("./cada/project");
const cadaEventRouter = require("./cada/event");
const cadaFileRouter = require("./cada/file");
const cadaAdminRouter = require("./cada/admin");

const omopConceptRouter = require("./omop/concept");
const omopPersonRouter = require("./omop/person");

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/features", featureRouter);
router.use("/buckets", bucketRouter);
router.use("/logs", logRouter);

router.use("/cada/projects", cadaProjectRouter);
router.use("/cada/events", cadaEventRouter);
router.use("/cada/files", cadaFileRouter);
router.use("/cada/admin", cadaAdminRouter);

router.use("/omop/concepts", omopConceptRouter);
router.use("/omop/person", omopPersonRouter);

module.exports = router;
