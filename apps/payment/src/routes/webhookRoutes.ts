import {webhookHandler} from "../controller/stripeWebhookController.js";


const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

import {Router} from "express";

const router = Router();

router.post("/stripe", webhookHandler);

export default router;