const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../../middlewares/auth_app');
const Sensor = require('../../models/Sensor');
const { Op } = require('sequelize');
const router = express.Router();

//add new sensor
router.post('/add', [auth, [
    check('sensorName', 'Sensor name is required').not().isEmpty(),
    check('sensorLabel', 'Label is required').not().isEmpty(),
    check('sensorStyle', 'Sensor style is required').not().isEmpty(),
    check('symbol', 'Unit is required').not().isEmpty()
]], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try {
        let sensorName = req.body.sensorName;
        sensorName = sensorName.trim();
        if(sensorName.indexOf(' ') >0){
            sensorName = sensorName.split(' ').join('_');
        }

        const sensorExists = await Sensor.findOne({where:{ [Op.and]:[{sensorName}, {user:req.user.id}] }, raw: true});
        if(sensorExists){
            return res.status(400).json({errors: [{'msg':'Sensor already exists'}]});
        }
        const sensor = await Sensor.create({
            user: req.user.id,
            sensorName,
            sensorLabel: req.body.sensorLabel,
            sensorStyle: req.body.sensorStyle,
            symbol: req.body.symbol
        });
        res.json({msg: 'success'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//get sensor data
router.get('/:sensor_name', auth, async (req, res)=>{
    try {
        const sensor = await Sensor.findOne({where:{ [Op.and]:[{sensorName: req.params.sensor_name}, {user:req.user.id}] }, raw: true});
        res.json(sensor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//get all sensors
router.get('/', auth, async (req, res)=>{
    try {
        const sensors = await Sensor.findAll({where: {user: req.user.id}, raw: true});
        res.json(sensors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

});

//update sensor data
router.put('/:sensor_name', [auth, [
    check('sensorValue', 'Sensor value is required').not().isEmpty()
]], async (req, res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        try {
            await Sensor.update({sensorValue: req.body.sensorValue}, {where: { [Op.and]:[{sensorName: req.params.sensor_name}, {user:req.user.id}] }});
            res.json({msg: 'Success'});
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
});

//delete sensor
router.delete('/:id', auth, async (req, res)=>{
    try {
        await Sensor.destroy({ where: { [Op.and]:[{id: req.params.id}, {user: req.user.id}] } });
        res.json({msg: 'success'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;