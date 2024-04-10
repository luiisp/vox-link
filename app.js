const express = require('express');
const path = require('path');
const app = express();
const settings = require('./settings.json');
const publicSettings = settings.publicSettings || console.error('No public settings found');
const privateSettings = settings.privateSettings || console.error('No private settings found');



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    console.log(settings);
    res.render('index'); 
});

app.get('/create-room', (req, res) => {
    res.render('create'); 
});

app.get('/room', (req, res) => {

    res.render('room')

});



const port = 3000;
app.listen(port, () => {
    console.log(`Running in *${port}`);
});
