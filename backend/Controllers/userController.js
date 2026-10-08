
import {User, validateUser} from '../Models/user.js'
import bcrypt from 'bcrypt'
import _ from 'lodash'


const registerUser = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message })
    
        try{
        const {email, password, name, lastName} = req.body
        let user = await User.findOne({email: email})
        if(user) return res.status(409).json({ message: 'user already registered!' });
        user = new User({
            name,
            lastName,
            email,
            password
        })
        
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        await user.save()

        const token = user.generateAuthToken()
        res.status(201).json({
            token,
            user: _.pick(user, ["name", "lastName", "email", "_id"])
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

export default registerUser