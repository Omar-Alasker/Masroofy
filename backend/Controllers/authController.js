import {User} from '../Models/user.js'
import bcrypt from 'bcrypt'
import Joi from 'joi'
import _ from 'lodash'


const authUser = async (req, res) => {
    const { error } = validateAuth(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message })
    try{
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message: 'Invalid email or password!'})
        
        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword) return res.status(400).json({message: 'Invalid email or password!'})
        
        const token = user.generateAuthToken()
        res.status(200).json({token, user: _.pick(user, ["name", "lastName", "email", "_id"])})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: err.message})
    }
}

const validateAuth = (user) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    })
    return schema.validate(user)
}

export {authUser, validateAuth}