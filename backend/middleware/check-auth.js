import jwt from 'jsonwebtoken';
import HttpError from "../models/http-error.js";

const checkauth=(req,res,next)=>{
    if(req.method==='OPTIONS'){
        return next();
    }
    try{
        const token=req.headers.authorization.split(' ')[1];
        if(!token){
            throw new Error('Authentication failed!');
        }
        const decodedtoken=jwt.verify(token,process.env.JWT_SECRET);
        req.userData={userId:decodedtoken.userId};
        next();
    }catch(err){
        const error=new HttpError('Authentication failed!',401);
        return next(error);
    }


};

export default checkauth;