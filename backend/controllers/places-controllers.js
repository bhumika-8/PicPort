import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";
import { getCoordsForAddress } from "../utils/location.js";
import Place from "../models/place.js";
import User from "../models/user.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpError('Fetching place failed, please try again.', 500));
  }

  if (!place) {
    return next(new HttpError('Could not find place for the provided id.', 404));
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    return next(new HttpError('Fetching places failed, please try again later.', 500));
  }

  if (!places ) {
    return next(new HttpError('Could not find places for the provided user id.', 404));
  }

  res.json({ places: places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input passed, please check your data.', 422));
  }

  const { title, description, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(new HttpError("Could not get coordinates for address.", 500));
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file?.path, 
    creator: req.userData.userId
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    return next(new HttpError('Creating place failed, user lookup failed.', 500));
  }

  if (!user) {
    return next(new HttpError('Could not find user for provided id.', 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError('Creating place failed, please try again.', 500));
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpError('Something went wrong, could not update place.', 500));
  }

  if (place.creator.toString() !== req.userData.userId) {
    return next(new HttpError('You are not allowed to edit this place!', 401));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    return next(new HttpError('Something went wrong, could not save updated place.', 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    return next(new HttpError('Something went wrong, could not delete place.', 500));
  }

  if (!place) {
    return next(new HttpError('Could not find place for this id.', 404));
  }

  if (place.creator.id !== req.userData.userId) {
    return next(new HttpError('You are not allowed to delete this place!', 401));
  }

  // Extract Cloudinary public_id from URL
  const imageUrl = place.image;
  const publicIdMatch = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png)$/);

  let publicId;
  if (publicIdMatch && publicIdMatch[1]) {
    publicId = publicIdMatch[1]; // e.g., "picport/abcd1234"
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Place.deleteOne({ _id: place.id }, { session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
    sess.endSession();
  } catch (err) {
    return next(new HttpError('Something went wrong, could not delete place.', 500));
  }

  // 🔥 Delete the image from Cloudinary
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error("Failed to delete image from Cloudinary:", err);
    }
  }

  res.status(200).json({ message: "Deleted place and associated image." });
};


export {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById
};
