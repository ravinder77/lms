import { Router } from 'express';
import {confirmPayment, createCheckoutSession, createPaymentIntent} from "../controller/paymentController.js";

const router = Router();

router.post("/create-checkout-session", createCheckoutSession)
router.post("/create-intent", createPaymentIntent);
router.post("/confirm/:paymentIntentId", confirmPayment);


export default router;