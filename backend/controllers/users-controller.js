import HttpError from "../models/http-error.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import User from "../models/user.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError('Something went wrong in retrieving the users', 500);
        return next(error);
    }
    res.json({ users: users.map(u => u.toObject({ getters: true })) });

};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        return next(new HttpError('invalid credentials', 422));
    }
    const { name, email, password } = req.body;
    const imageUrl = req.file?.path;
    let existingUser
    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        const error = new HttpError("signup failed", 500);
        return next(error);
    }

    if (existingUser) {
        return next(new HttpError("User already exists", 422));
    }
    let createdUser;
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError('Could not create user, please try aain', 500);
        return next(error);
    }
    createdUser = new User({
        name,
        email,
        password: hashedPassword,
        image: imageUrl,

        places: []
    });
    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError("something went wrong", 500);
        return next(error);

    }

    let token;
    try {
        token = jwt.sign({ userId: createdUser.id, email: createdUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError('Error in signing up, please try again letter', 500);
        return next(error);
    }


    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
    
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser
    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        const error = new HttpError("login failed", 500);
        return next(error);
    }

    if (!existingUser) {
        return next(new HttpError("Invalid credentials", 401));
    }
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError('Could not log you in, please check your credentials and try again', 500);
        return next(error);

    }
    if (!isValidPassword) {
        return next(new HttpError("Invalid credentials", 401));

    }
    let token;
    try {
        token = jwt.sign({ userId: existingUser.id, email: existingUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' });

    } catch (err) {
        const error = new HttpError('Could not login you in, please try again later', 500);
        return next(error);
    }

    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        token: token
    });


};

export { getUsers, login, signup };