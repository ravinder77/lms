import express, {Express, Request, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import paymentRouter from "./routes/paymentRoutes.js";
import webhookRouter from "./routes/webhookRoutes.js";
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT!

//
app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(helmet());

// webhook endpoint needs raw body, place it before express.json
app.use("/webhooks", express.raw({type: "application/json"}));
app.use("/webhooks", webhookRouter);


app.use(express.json());
app.use("/api/v1/payments", paymentRouter);


// GRACEFUL SHUTDOWN
process.on("SIGINT", () => {
    console.log("SIGINT RECEIVED. SHUTTING DOWN GRACEFULLY");
    process.exit(0);
})

process.on("SIGTERM", () => {
    console.log("SIGTERM RECEIVED. SHUTTING DOWN GRACEFULLY");
})


app.listen(PORT, () => {
    console.log(`Payment Service listening on port ${PORT}`);
});
