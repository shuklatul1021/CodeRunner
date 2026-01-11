import Router from "express";
import { LogInSchema, SignUpSchema } from "../types/type.js";
import { prisma } from "../client/psql.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { AuthMiddleware } from "../middleware/middleware.js";
import { API_Generator } from "../utils/APIGenerator.js";
const AuthRouter = Router();


AuthRouter.post("/sign-up" , async (req , res) => {
    try{
        const { success , data , error } = SignUpSchema.safeParse(req.body);
        if(!success){
            return res.status(400).json({
                message : "Validation Error",
                success : false,
                error : error.message
            })
        }

        const VerifyUser = await prisma.user.findFirst({ where : { email : data.email } });
        if(VerifyUser){
            return res.status(400).json({
                message : "User Already Exist",
                success : false
            })
        };

        const hashedPassword = await bcrypt.hash(data.password , 10);
        if(!hashedPassword){
            return res.status(500).json({
                message : "Internal Server Error",
                success : false
            })
        }

        const NewUser = await prisma.user.create({
            data : {
                email : data.email,
                password : hashedPassword,
                username : data.username,
                name : data.name,
                updatedAt : new Date(),
            }
        });

        return res.status(201).json({
            message : "User Created Successfully",
            success : true,
            data : {
                id : NewUser.id,
                email : NewUser.email,
                apikey : NewUser.APIKEY
            }
        });

    }catch(e){
        console.log(e)
    }
});


AuthRouter.post("/log-in" , async (req , res) => {
    try{
        const { success ,  data , error } = LogInSchema.safeParse(req.body);
        if(!success){
            return res.status(400).json({
                message : "Validation Error",
                success : false,
                error : error.message
            })
        }

        const getUser = await prisma.user.findFirst({ where : { email : data.email } });
        if(!getUser){
            return res.status(404).json({
                message : "User Not Found",
                success : false
            })
        }

        const isPasswordValid = await bcrypt.compare(data.password, getUser.password);
        if(!isPasswordValid){
            return res.status(401).json({
                message : "Invalid Password",
                success : false
            })
        }

        const signToken = await jwt.sign({ id : getUser.id } , process.env.JSON_WEB_TOKEN as string , { expiresIn : '7d' });
        if(!signToken){
            return res.status(500).json({
                message : "Internal Server Error",
                success : false
            })
        }

        return res.status(200).json({
            message : "Log In Successful",
            success : true,
            data : {
                token : signToken
            }
        })

    }catch(e){
        console.log(e);
        return res.status(401).json({
            message : "Internal Server Error",
            success : false
        })
    }
})

AuthRouter.post("/generate_apikey" , AuthMiddleware  ,async (req , res) => {
    try{
        const userId = req.userId;
        if(!userId){
            return res.status(401).json({
                message : "Unauthorized",
                success : false
            })
        }

        const apikey = API_Generator();
        if(!apikey){
            return res.status(500).json({
                message : "Internal Server Error",
                success : false
            })
        }

        const updateUser = await prisma.user.update({
            where : { id : userId },
            data : { APIKEY : apikey , updatedAt : new Date() }
        });

        if(!updateUser){
            return res.status(500).json({
                message : "Internal Server Error",
                success : false
            })
        }

        return res.status(200).json({
            message : "API Key Generated Successfully",
            success : true,
            data : {
                apikey : updateUser.APIKEY
            }
        });

    }catch(e){
        console.log(e);
        return res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
});



export default AuthRouter;