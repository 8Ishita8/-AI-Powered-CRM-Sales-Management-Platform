import { Router } from "express";
import { LeadController } from "../controllers/lead.controller";
import { CallController } from "../../calls/controllers/call.controller";
import { authenticate } from "../../../middleware/auth.middleware";
import { validateRequest } from "../../../middleware/validation.middleware";
import { createLeadSchema } from "../validators/createLead.schema";
import { updateLeadSchema } from "../validators/updateLead.schema";
import { assignLeadSchema } from "../validators/assignLead.schema";
import { createCallSchema } from "../../calls/validators/call.validator";

const router = Router();
const leadController = new LeadController();
const callController = new CallController();

// All lead routes require authentication
router.use(authenticate);

router.post("/", validateRequest({ body: createLeadSchema }), leadController.createLead);
router.get("/", leadController.getLeads);
router.get("/:id", leadController.getLeadById);
router.patch("/:id", validateRequest({ body: updateLeadSchema }), leadController.updateLead);
router.patch("/:id/assign", validateRequest({ body: assignLeadSchema }), leadController.assignLead);

// Call Record Route associated with a Lead
router.post("/:id/calls", validateRequest({ body: createCallSchema }), callController.logCall);

export default router;
