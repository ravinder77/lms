import {Request, Response} from "express";
import {Stripe} from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


// create Payment Intent
async function createPaymentIntent (req: Request, res: Response): Promise<void> {


    const {amount, currency = "usd", metadata={}} = req.body;

    if(!amount || currency < 50)  {
        res.status(400).send({
            success: false,
            message: 'Invalid amount. Minimum 50 cents'
        })
        return;
    }

try {

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata,
        automatic_payment_methods: {
            enabled: true,
        }
    })
    res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
    });
} catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create intent",
            error: error
        })
}

}

// endpoint to confirm payment
async function confirmPayment (req: Request, res: Response):Promise<void>  {

    const {paymentIntentId, paymentMethodId} = req.body;

    if(!paymentIntentId) {
        res.status(400).json({
            success: false,
            message: "Payment intent id is missing"
        })
        return;
    }

    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
            payment_method: paymentMethodId,
            return_url: process.env.RETURN_URL || "http://localhost:3000/success",
        })

        res.status(200).json({
            status: paymentIntent.status,
            clientSecret: paymentIntent.client_secret,
        })

    }catch(error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to confirm payment intent",
        })
    }

}


export {createPaymentIntent, confirmPayment};