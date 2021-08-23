const express = require('express');
const auth = require('../middlewares/auth_app');
const User = require('../models/User');
const Relay = require('../models/Relay');
const Sensor = require('../models/Sensor');
const router = express.Router();

//dashboard route
router.get('/', auth, async(req, res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findOne({where: {id: userId}, raw:true});
        const relays = await Relay.findAll({where:{user: userId}, raw: true});
        const sensors = await Sensor.findAll({where:{user: userId}, order: [['sensorName','ASC']], raw: true});
        const newRelays = new Array(Math.ceil(relays.length /4)).fill().map(item=>relays.splice(0,4));
        res.render('dashboard', {user, relays:newRelays, sensors});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
    
});
router.get('/addWidgets', auth, async (req, res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findOne({where: {id: userId}, raw:true});
        res.render('addWidgets', {user});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
router.get('/addWidgets/addForm', auth, async (req, res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findOne({where: {id: userId}, raw:true});
        res.render('addWidgetForm', {user});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
router.get('/sensors', auth, async (req, res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findOne({where: {id: userId}, raw:true});
        const sensors = await Sensor.findAll({where: {user: userId}, order:[['updatedAt', 'DESC']], raw: true});
        res.render('sensors', {sensors, user});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
router.get('/switches', auth, async (req, res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findOne({where: {id: userId}, raw:true});
        const relays = await Relay.findAll({where: {user: userId}, order:[['updatedAt', 'DESC']], raw: true});
        res.render('switches', {relays, user});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
router.get('/profile', auth, async(req, res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findOne({where: {id: userId}, raw:true});
        res.render('profile', {user});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
router.delete('/profile/:id', auth, async(req, res)=>{
    try {
        await Relay.destroy({where: {user: req.user.id}});
        await Sensor.destroy({where: {user: req.user.id}});
        await User.destroy({where: {id: req.user.id}});
        res.cookie('jwt', '', {maxAge: 1});
        res.json({msg: 'success'});

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
router.get('/settings', auth, async(req, res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findOne({where: {id: userId}, raw:true});
        res.render('settings', {user});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;