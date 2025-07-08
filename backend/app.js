import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import placesRoutes from "./routes/places-routes.js";
import userRoutes from "./routes/users-routes.js";
import HttpError from "./models/http-error.js";
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use(express.urlencoded({ extended: true }));


app.use("/api/users",userRoutes);
app.use("/api/places",placesRoutes);

app.use((req,res,next)=>{
    const error=new HttpError('Could not find this route',404);
    throw error;
});




app.use((error,req,res,next)=>{
  if(req.file){
    fs.unlink(req.file.path,()=>{
      
    });
  }
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code||500);
    res.json({message:error.message||"ERROR"});

})

mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log('Connected to MongoDB');
   app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
})
.catch((err) => {
  console.error('Error connecting to the database!');
 
  console.error(err.message); 
});


