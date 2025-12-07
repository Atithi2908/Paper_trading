import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET as string;


const prisma = new PrismaClient(); 
export const signup = async(req:Request ,res:Response ) =>{
    console.log("Signup request came");
console.log("signup request");
const {name,email,password} = req.body;
console.log(name,email,password);
try{
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await prisma.user.create({
data:{email,password:hashedPassword,name},

    });
    const token = jwt.sign({userId: user.id},JWT_SECRET);
    res.status(200).json({token});
}
catch(e){
res.status(400).json({message:"User can't be created", error:e});
}
};


export const signin = async(req:Request,res:Response)=>{
    console.log("request to signin");
    const {email,password} = req.body;
    console.log(email,password);
    try{
        const user = await prisma.user.findUnique({where: {email}});
        console.log("user is");
        if(!user) return res.status(400).json({message:"Invalid Credentials"});
        const isValid =await bcrypt.compare(password,user.password);
        if(!isValid) return res.status(400).json({message:"Invalid Credentials"});
       const token = jwt.sign({userId: user.id},JWT_SECRET,{expiresIn: "30d"});
        res.json({token});
    } catch(e){
        res.status(500).json({error: e});
    }
};

export const getDetails =(req:Request,res:Response)=>{
    console.log("request came");
    const name = req.body.name ;
    res.status(200).json({message:`Your name is ${name}`});
}