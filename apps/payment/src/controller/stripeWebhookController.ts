import {Stripe} from "stripe";
import {Request, Response} from "express";
import {
    handleCheckoutSessionCompleted,
    handleCheckoutSessionExpired,
} from "../webhooks/webhooks.js";

async function webhookHandler(req: Request, res: Response): Promise<void> {

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;


    const sig = req.headers['stripe-signature'];
    if (!sig) {
        res.status(400).json({
            success: false,
            message: "Missing Stripe signature"
        })
        return;
    }
    let event: Stripe.Event;

    try{
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
           endpointSecret,
        )
    } catch( error ) {
        console.error("Webhook signature verification failed", error);
        res.status(400).json({
            success: false,
            message: "Webhook Error",
        })
        return;
    }

    //Handle the event
    try {
        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckoutSessionCompleted(event.data.object);
                break;
            case 'checkout.session.expired':
                await handleCheckoutSessionExpired(event.data.object);
                break;
            default:
                console.log("Unhandled event", event.type);

        }
        res.status(200).json({received: true, event});
    } catch (error) {
        console.error("Error Handling the webhook", error);
        res.status(500).json({
            success: false,
            message: "WEBHOOK_ERROR",
        })
    }







}



export {webhookHandler};