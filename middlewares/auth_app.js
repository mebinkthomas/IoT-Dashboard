const jwt = require('jsonwebtoken');
const config = require('../config/config.json');


module.exports = (req, res, next)=>{
    const token = req.cookies.jwt || req.header('x-auth-token');
    const device = req.header('x-device-name');
    if(!token){
        if(device){
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }
        return res.redirect('/login');
        
    }
    try {
        jwt.verify(token, config.jwtSecret, function(err, decoded){
            if(err) throw err;
            req.user = decoded.user;
            next();
        });
    } catch (err) {
        console.error('Jwt error');
        if(!device){
            res.redirect('/login');
        }
        res.status(401).json({ msg:'Token is not valid' });
    }
    
}