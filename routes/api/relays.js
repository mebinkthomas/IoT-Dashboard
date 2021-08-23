const express = require('express');
const auth = require('../../middlewares/auth_app');
const Relay = require('../../models/Relay');
const { check, validationResult } = require('express-validator');
const { Op } = require("sequelize");
const router = express.Router();

//add new relay
router.post('/add', [auth, [
    check('relayName', 'Relay name is required').not().isEmpty(),
    check('relayLabel', 'Label is required').not().isEmpty()
]],async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try {

        let relayName = req.body.relayName;
        relayName = relayName.trim();
        if(relayName.indexOf(' ') >0){
            relayName = relayName.split(' ').join('_');
        }

        const relayExists = await Relay.findOne({where:{ [Op.and]:[{relayName}, {user: req.user.id}] } ,raw: true});
        if(relayExists){
            return res.status(400).json({errors: [{'msg':'Switch already exists'}]});
        }        
        const relay = await Relay.create({
            user: req.user.id, 
            relayName,
            relayLabel: req.body.relayLabel
         });
         res.json({msg: 'success'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//update relay status
router.put('/:relay_name', [auth, [
    check('relayStatus', 'Relay status is required').not().isEmpty()
]],async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try {
        await Relay.update({ relayStatus: req.body.relayStatus }, {where: { [Op.and]:[ {relayName: req.params.relay_name}, {user: req.user.id} ] }});
        res.status(200).json({ msg: 'updated' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    
});

//get relay status
router.get('/:relay_name', auth, async (req, res)=>{
    try {
        const relay = await Relay.findOne({where:{ [Op.and]:[{relayName: req.params.relay_name}, {user: req.user.id}] } ,raw: true});
        res.status(200).json(relay);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
//get all relays
router.get('/', auth, async (req, res)=>{
    try {
        const relays = await Relay.findAll({where: {user: req.user.id}, raw: true});
        res.json(relays);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

});

//delete relay
router.delete('/:id', auth, async (req, res)=>{
    try {
        await Relay.destroy({ where: { [Op.and]:[ {id: req.params.id}, {user: req.user.id} ] } });
        res.json({msg: 'success'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;