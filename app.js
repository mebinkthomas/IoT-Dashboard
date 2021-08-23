const express = require('express');
const path = require('path');
const db = require('./config/database');
const cookieParser = require('cookie-parser');

const app = express();

//connect to db
const connection = async()=>{
    try {
        await db.authenticate();
        console.log('Connected to database...');
    } catch (err) {
        console.error('Database connection error', err);
    }
}
connection();


//middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

//view engine
app.set('view engine', 'ejs');

//routes
app.get('/', (req, res)=>{
    res.redirect('/login');
});
app.use(require('./routes/auth'));
app.use('/register', require('./routes/users'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/api/relays', require('./routes/api/relays'));
app.use('/api/sensors', require('./routes/api/sensors'));



const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`));