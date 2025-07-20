import express, {Express, Request, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import paymentRouter from "./routes/routes.js"
dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || "4005"

//
// app.use(cors());
app.use(helmet());

app.get("/health", (req: Request, res: Response) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString()
    })
})


// webhook endpoint needs raw body, place it before express.json
app.use("/webhooks", express.raw({type: "application/json"}));
app.use(express.json());



app.use("/api/payments", paymentRouter);


app.listen(PORT, () => {
    console.log(`Payment Service listening on port ${PORT}`);
});
