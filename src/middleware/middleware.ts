import type { NextFunction , Response , Request} from "express";
import { prisma } from "../client/psql.js";
import jwt from "jsonwebtoken"


const JSON_WEB_TOKEN = process.env.JSON_WEB_TOKEN || ""

export async function AuthMiddleware(req :  Request, res: Response, next: NextFunction) {
    try{
        const token =  req.headers.token;
        if(!token){
            return res.status(401).json({
                message : "Unauthorized",
                success : false
            })
        }

        const verifyToken = await jwt.verify(token as string , JSON_WEB_TOKEN);
        if(!verifyToken){
            return res.status(401).json({
                message : "Wrong Token",
                success : false
            })
        }

        if(verifyToken && typeof(verifyToken) != 'string'){
            req.userId = verifyToken.id
            return next();
        }

    }catch(e){
        console.log(e);
        return res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
    
}


export async function APICheckMiddleware(req :  Request, res: Response, next: NextFunction) {
    try{
        const apiKey = req.headers['x-api-key'];
        if(!apiKey || apiKey !== process.env.API_KEY){
            return res.status(401).json({
                message : "Unauthorized",
                success : false
            })
        }
        const VerifyApiKey = await prisma.user.findFirst({ where : { APIKEY : apiKey as string } });
        if(!VerifyApiKey){
            return  res.status(401).json({
                message : "Unauthorized",
                success : false
            })
        }

        if(VerifyApiKey){
            return next();
        }
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
}