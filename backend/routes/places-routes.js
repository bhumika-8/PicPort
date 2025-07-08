import express from "express";
import {check} from "express-validator";

import { createPlace, deletePlaceById, getPlaceById,getPlacesByUserId, updatePlaceById } from "../controllers/places-controllers.js";
import fileUpload from "../middleware/file-upload.js";
import checkauth from "../middleware/check-auth.js";
const router = express.Router();


router.get("/:pid",getPlaceById);


router.get("/user/:uid",getPlacesByUserId)
router.use(checkauth);
router.post('/',
   fileUpload.single('image') ,
    [check('title').notEmpty(),check('description').isLength(5),check('address').notEmpty()],createPlace)

router.patch("/:pid",[check('title').notEmpty(),check('description').isLength(5)],updatePlaceById);

router.delete("/:pid",deletePlaceById);


export default router;