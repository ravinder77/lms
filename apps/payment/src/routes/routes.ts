import { Router } from 'express';
import {confirmPayment, createPaymentIntent} from "../controller/paymentController.js";

const router = Router();

router.post("/create-intent", createPaymentIntent);
router.post("/confirm", confirmPayment);


export default router;