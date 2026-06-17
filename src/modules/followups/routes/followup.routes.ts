import { Router } from "express";
import { FollowupController } from "../controllers/followup.controller";
import { authenticate } from "../../../middleware/auth.middleware";
import { validateRequest } from "../../../middleware/validation.middleware";
import { createFollowupSchema, updateFollowupStatusSchema } from "../validators/followup.validator";

const router = Router();
const followupController = new FollowupController();

// All followup routes require authentication
router.use(authenticate);

router.post("/", validateRequest({ body: createFollowupSchema }), followupController.createFollowup);
router.get("/", followupController.getFollowups);
router.patch("/:id", validateRequest({ body: updateFollowupStatusSchema }), followupController.updateFollowupStatus);

export default router;
