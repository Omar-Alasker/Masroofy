import mongoose from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 25
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 25
    },
    email: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 1024
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, config.jwtSecret);
    return token;
};

const User = mongoose.model('User', userSchema);

const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().required().min(2).max(25),
        lastName: Joi.string().required().min(2).max(25),
        email: Joi.string().required().min(5).max(255),
        password: Joi.string().required().min(5).max(255)
    });
    return schema.validate(user);
};

export { User, validateUser };