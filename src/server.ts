import express from "express"
import cors from "cors";
import client from "prom-client";
import { routeratelimiter } from "./limiter/RateLimiter.js";
import { MatricsesMiddleware } from "./middleware/prometheus.js";
import compilerRouter from "./router/CompilerRouter.js";
import AuthRouter from "./router/Auth.js";
export const app = express();
require('dotenv').config();

app.use(express.json())
app.use(cors());
app.use(MatricsesMiddleware);
app.use(routeratelimiter);
  
app.use("/v1/api/auth" , AuthRouter);
app.use("/v1/api/compiler" , compilerRouter);



app.get('/metrics', async (req, res) => {
    try{
        const metrics = await client.register.metrics();
        res.set('Content-Type', client.register.contentType);
        res.end(metrics);
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
})