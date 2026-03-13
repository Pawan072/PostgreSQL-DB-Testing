const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database Connection
const pool = new Pool({
    user: 'postgres',         // Aapka username
    host: 'localhost',
    database: 'my_form_db',   // Database ka naam
    password: 'Querry@1234', // Aapka password
    // port: 5432,
});

app.get('/',(req, res)=>{
    res.send('Your server is running')
});

// Route: Form submit handle karna
app.post('/submit', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        const query = 'INSERT INTO users (name, email, message) VALUES ($1, $2, $3)';
        await pool.query(query, [name, email, message]);
        res.send('Data Database mein save ho gaya hai!');
    } catch (err) {
        console.error(err);
        res.send('Oops! Kuch gadbad ho gayi.');
    }
});

app.listen(8080, () => {
    console.log('Server is running');
});