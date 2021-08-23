const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const config = require('../config/config.json');

const router = express.Router();

//@route GET /register
//@desc returns register page
//@access public
router.get('/', (req, res)=>{
    res.render('register');
});

//@route POST /register
//@desc register
//@access public
router.post('/',
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min:6 })
,async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    let { name,email,password } = req.body;
    try {
        const user = await User.findOne({where:{ email },raw:true });
        if(user){
            return res.status(400).json({errors: [{msg: 'User already exists'}]});
        }
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        const newUser = await User.create({ name, email, password });
        const payload = {
            user: {
                id: newUser.id
            }
        }
        jwt.sign(payload, config.jwtSecret, {expiresIn: 360000}, (err, token)=>{
            if(err) throw err;
            res.cookie('jwt', token, {httpOnly: true, maxAge: 360000 * 1000});
            res.status(200).json({msg: 'success'});
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

module.exports = router;