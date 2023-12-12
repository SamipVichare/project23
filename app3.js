/******************************************************************************
***
*	ITE5315 – Assignment 4
*	I declare that this assignment is my own work in accordance with Humber Academic Policy.
*	No part of this assignment has been copied manually or electronically from any other source
*	(including web sites) or distributed to other students.
*
*	Name: Samip Vichare	 Student ID:N01545366	Date: 26/11/2023  	
*
*
******************************************************************************
**/
var express = require('express');
var mongoose = require('mongoose');

var moment = require('moment');
var bodyParser = require('body-parser');
var app = express();
var database = require('./config/database');

// Import the Invoice model
var Invoice = require('./models/invoice'); // Replace 'invoice' with the actual filename of your invoice model

var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

const customHelpers = require('./custom_helper');

const exphbs = require('express-handlebars');

app.engine(
  'hbs',
  exphbs.engine({
  
    extname: '.hbs',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    handlebars: customHelpers
  })
);

app.set('view engine', 'hbs');
mongoose.connect(database.url);

// Handlebars route to show all invoice-info
app.get('/invoices', (req, res) => {
    Invoice.find()
        .then(invoices => {
            res.render('invoices', { invoices: invoices });
        })
        .catch(err => res.status(500).send(err));
});

// Handlebars route to insert a new invoice
app.get('/invoices/new', (req, res) => {
    res.render('new-invoices');
});

app.post('/invoices', (req, res) => {
    const newInvoice = req.body;

    Invoice.create(newInvoice)
        .then(() => res.redirect('/invoices'))
        .catch(err => res.status(500).send(err));
});

// Handlebars route for the dashboard
app.get('/dashboard', async (req, res) => {
    try {
        const invoiceCount = await Invoice.countDocuments();

        res.render('dashboard', {
            invoiceCount: invoiceCount,
            // You can add more statistics here if needed
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log("App listening on port: " + port);
});