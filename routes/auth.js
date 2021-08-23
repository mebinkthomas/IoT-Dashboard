const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const config = require('../config/config.json');
const auth = require('../middlewares/auth_app');

const router = express.Router();

//@route GET /login
//@desc returns login page
//@access public
router.get('/login', (req, res)=>{
    res.render('login');
});

//@route POST /login
//@desc authenticate user
//@access public
router.post('/login',
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
,async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {email, password} = req.body;

    try {
        const user = await User.findOne({where:{ email },raw:true });
        if(!user){
            return res.status(400).json({errors: [{ msg: 'Invalid Credentials' }]});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({errors: [{ msg: 'Invalid Credentials' }]});
        }
        const payload = {
            user: {
                id: user.id
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

});

//login for IoT devices
router.post('/iot/login',
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
,async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {email, password} = req.body;

    try {
        const user = await User.findOne({where:{ email },raw:true });
        if(!user){
            return res.status(400).json({errors: [{ msg: 'Invalid Credentials' }]});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({errors: [{ msg: 'Invalid Credentials' }]});
        }
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, config.jwtSecret, {expiresIn: 360000}, (err, token)=>{
            if(err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

});


//@route GET /logout
//@desc logout user
//@access private
router.get('/logout', auth, (req, res)=>{
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
});




module.exports = router;