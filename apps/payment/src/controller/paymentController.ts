import {Request, Response} from "express";
import {Stripe} from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// checkout
async function createCheckoutSession (req: Request, res: Response): Promise<void> {
   const {userId, courseId, enrollmentId, amount, callbackUrl, currency, metadata} = req.body;

   const session = await stripe.checkout.sessions.create({
       payment_method_types: ['card'],
       mode: 'payment',
       line_items: [
           {
               price_data: {
                   currency: currency || 'usd',
                   product_data: {
                       name: 'Course Purchase'
                   },
                   unit_amount: amount
               },
               quantity: 1
           }
       ],
       success_url: `${callbackUrl}?status=success&enrollmentId=${metadata.enrollmentId}`,
       cancel_url: `${callbackUrl}?status=cancel&enrollmentId=${metadata.enrollmentId}`,
       metadata: {
           userId,
           courseId,
           enrollmentId
       }
   })

    res.status(200).json({
        success: true,
        data: {
            url: session.url,
        }
    })
}



export { createCheckoutSession};