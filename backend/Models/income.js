import Joi from "joi";
import JoiObjectId from "joi-objectid";
import mongoose from "mongoose";

Joi.objectId = JoiObjectId(Joi);

const incomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    title: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50
    },
    description: {
        type: String,
        minLength: 2,
        maxLength: 255,
        set: (val) => (val === "" ? undefined : val)
    },
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true })

const Income = mongoose.model('Income', incomeSchema)

const validateIncome = (income) => {
    const schema = Joi.object({
        categoryId: Joi.objectId().required(),
        amount: Joi.number().required().min(0),
        title: Joi.string().required().min(2).max(50),
        description: Joi.string().min(2).max(255).allow(''),
        date: Joi.date().required()
    })
    return schema.validate(income)
}

const validateUpdateIncome = (income) => {
    const schema = Joi.object({
        categoryId: Joi.objectId(),
        amount: Joi.number().min(0),
        title: Joi.string().min(2).max(50),
        description: Joi.string().min(2).max(255).allow(''),
        date: Joi.date()
    })
    return schema.validate(income)
}

export { Income, validateIncome, validateUpdateIncome }