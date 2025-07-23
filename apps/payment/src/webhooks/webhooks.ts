import {Stripe} from "stripe";
import axios from "axios";
const COURSE_SERVICE_URL = process.env.COURSE_SERVICE_URL!;

async function  handleCheckoutSessionCompleted(session: Stripe.Checkout.Session):Promise<void> {

    const enrollmentId = session.metadata?.enrollmentId;
    const paymentId = session.payment_intent as string;

    if(!enrollmentId) {
        throw new Error(`Enrollment id ${enrollmentId} not found.`);
    }

    try{
        await axios.post(`${COURSE_SERVICE_URL}/api/v1/courses/payment-callback`,  {
           enrollmentId,
            paymentId,
            status: "success",
        })
        console.log(`Enrollment ${enrollmentId} successful.`);
    }catch(err){
        console.error("Failed to notify course service", err);
        // retry or mark for review

    }
}

// handle expired checkout, user abandoned cart, timed out, etc
async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session):Promise<void> {
    const enrollmentId = session.metadata?.enrollmentId;

    if(!enrollmentId) {
        throw new Error(`Enrollment id ${enrollmentId} not found.`);
    }
    try {
        await axios.post(`${COURSE_SERVICE_URL}/api/v1/courses/payment-callback`, {
            enrollmentId,
            status: "failed",
        })
        console.log(`Enrollment ${enrollmentId} failed.`);
    } catch(err){
        console.error("Failed to notify course service", err);
    }
}



export {handleCheckoutSessionCompleted, handleCheckoutSessionExpired}