import mongoose from "mongoose";
import Joi from "joi";

const categorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50
    },
    type: {
        type: String,
        enum: ['expense' , 'income'],
        required: true
    },
    icon: {
        type: String,
    },
    color: {
        type: String
    },
    monthlyLimit: {
        type: Number
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    
},{timestamps: true})


const Category = mongoose.model('Category', categorySchema)

const validateCategory = (category) => {
    const schema = Joi.object({
        name: Joi.string().required().min(2).max(50),
        type: Joi.string().required().valid('expense', 'income'),
        icon: Joi.string().allow('').optional(),
        color: Joi.string().allow('').optional(),
        monthlyLimit: Joi.number().optional()
    })
    return schema.validate(category)
}

const validateCategoryUpdate = (category) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50),
        type: Joi.string().valid('expense', 'income'),
        icon: Joi.string().allow(''),
        color: Joi.string().allow(''),
        monthlyLimit: Joi.number()
    })
    return schema.validate(category)
}

export {Category, validateCategory, validateCategoryUpdate}