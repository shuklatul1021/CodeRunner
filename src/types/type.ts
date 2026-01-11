import z, { email } from "zod"


export const SignUpSchema = z.object({
    email : z.string().email(),
    name : z.string().max(20 , { message : "Maximum 20 Letter Allowed"}),
    username : z.string().max(12 , { message : "Maximum 12 Letter Allowed"}),
    password : z.string().min(6 , { message : "Minimum 6 Letter Requrire"}).max(16 , { message : "Maximum 16 Letter Allowed"}),

})

export const LogInSchema = z.object({
    email : z.string().email(),
    password : z.string().min(6 , { message : "Minimum 6 Letter Requrire"}).max(16 , { message : "Maximum 16 Letter Allowed"}),
})