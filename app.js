const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

// Database Connection
const pool = new Pool({
    user: 'postgres',         // Aapka username
    host: 'localhost',
    database: 'my_form_db',   // Database ka naam
    password: 'Querry@1234', // database ka password
});

app.get('/',(req, res)=>{
    res.send('Your server is running')
});

// new data add karne ka route
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

// saare data ko seen karne ka route

app.get('/all-users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.send(result.rows); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Data fetch karne mein error aaya');
    }
});

// update route on based id

app.post('/update', async (req, res) => {
    const {id, name, email, message} = req.body;
    if(!id){
        return res.status(400).send('Bad Entry');
    }
    try {
        const sqlQuery = 'UPDATE users SET name=$1, email=$2, message=$3 WHERE id = $4';
        await pool.query(sqlQuery, [name, email, message, id]);
        res.send('Data successfully update ho gaya!');
        console.log('data successfully updated');
    } catch (err) {
        console.error(err);
        res.status(500).send('Update karne mein error aaya.');
    }
});

// delete route based on id 
app.post('/delete', async(req, res)=>{
    const{id} = req.body;
    if(!id){
        return res.status(400).send('You have not enter the id');
    }
    try {
        const sqlQuery = 'delete from users where id=$1';
        const result = await pool.query(sqlQuery,[id]);
        if(result.rowCount===0){
            return res.send('id does not exit in database');
        }
        res.send('user has been deleted successfully');
        console.log(id);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internel server error');
    }
});


app.listen(8080, () => {
    console.log('Server is running');
});