import HttpError from "../models/http-error.js";
import { v4 as uuidv4 } from 'uuid';
import { validationResult } from "express-validator";
import { getCoordsForAddress } from "../utils/location.js";
import Place from "../models/place.js";
import User from "../models/user.js";
import mongoose from "mongoose";
import fs from "fs";

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('Something went wrong', 500);
    return next(error);
  }
  if (!place) {
    const error = new HttpError('No such place exists',404);
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });

};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError('Could not fetch the required place', 404);
    return next(error);
  }
  if (!places ) {
    const error = new Error("No such place exists");
    error.code = 404;
    return next(error);
  }
  res.json({ places: places.map(place => place.toObject({ getters: true })) });
}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError('invalid values', 422));
  }

  const { title, description, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(new HttpError("Could not get coordinates.", 500));
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId

  });

  let user;
  try {
    user = await User.findById(req.userData.userId);

  } catch (err) {
    const error = new HttpError('creating place failed!', 500);
    return next(error);

  }
  if (!user) {
    const error = new HttpError('could not find the user for this id!', 404);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating place failed!', 500
    )
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('invalid credentials', 422));
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('Something went wrong', 500);
    return next(error);
  }
  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this place!', 401);
    return next(error);
  }
  place.title = title;
  place.description = description;
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError('Something went wrong', 500);
    return next(error);
  }


  res.status(200).json({ place: place.toObject({ getters: true }) });

};

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new HttpError('something went wronggggg', 500);
    return next(error);
  }
  if (!place) {
    const error = new HttpError('place not found', 404);
    return next(error);
  }
  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError('You are not allowed to delete this place!', 401);
    return next(error);
  }
  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Place.deleteOne({ _id: place.id }, { session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
    sess.endSession();
  } catch (err) {
    const error = new HttpError("something went wrong", 500);
    return next(error);
  }
  fs.unlink(imagePath, err => {

  });
  res.status(200).json({ messgae: "deleted place." });

};

export { getPlaceById, getPlacesByUserId, createPlace, updatePlaceById, deletePlaceById };