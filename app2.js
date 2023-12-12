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
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const database = require('./config/database');
const Invoice = require('./models/invoice');

const port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

mongoose.connect(database.url);

// Show all invoice-info
app.get('/api/invoices', (req, res) => {
    Invoice.find()
        .then(invoices => res.json(invoices))
        .catch(err => res.status(500).send(err));
});


// Show a specific invoice based on the _id or InvoiceID
app.get('/api/invoices/:invoice_id', (req, res) => {
    const id = req.params.invoice_id;
    Invoice.findOne({ $or: [{ _id: id }, { InvoiceID: id }] })
        .then(invoice => {
            if (!invoice) {
                return res.status(404).json({ message: 'Invoice not found' });
            }
            res.json(invoice);
        })
        .catch(err => res.status(500).send(err));
});

// Insert a new invoice
app.post('/api/invoices', function(req, res) {
    const newInvoice = {
        "Invoice ID": req.body["Invoice ID"],
        Branch: req.body.Branch,
        City: req.body.City,
        "Customer type": req.body["Customer type"],
        "Product line": req.body["Product line"],
        name: req.body.name,
        image: req.body.image,
        "Unit price": req.body["Unit price"],
        Quantity: req.body.Quantity,
        "Tax 5%": req.body["Tax 5%"],
        Total: req.body.Total,
        Date: req.body.Date,
        Time: req.body.Time,
        Payment: req.body.Payment,
        cogs: req.body.cogs,
        "gross income": req.body["gross income"],
        Rating: req.body.Rating
    };

    console.log('Created new invoice');
    
    Invoice.create(newInvoice)
    .then(() => Invoice.find())
    .then(invoices => {
        console.log('Data added to the database:');
        res.json(newInvoice); // Showing the invoice data which is just inserted
    })   
    .catch(err => {
        console.error('Error adding data to the database:', err);
        res.status(500).send(err);
    });
});


// Update "Customer type" & "unit price" of an existing invoice
app.put('/api/invoices/:invoice_id', async (req, res) => {
    try {
        const id = req.params.invoice_id;
        const { CustomerType, UnitPrice, Quantity } = req.body;

        if (!CustomerType || !UnitPrice) {
            return res.status(400).json({ error: 'Customer type and unit price are required fields.' });
        }

        // Adjusting for properties with spaces in the database
        const data = {
            "Customer type": CustomerType,
            "Unit Price": UnitPrice,
            "Total": UnitPrice * (Quantity || 1),
        };

        const invoice = await Invoice.findByIdAndUpdate(id, data, { new: true });

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        res.send('Successfully! Invoice updated - ' + invoice.Name);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Delete an existing invoice based on the _id or InvoiceID
app.delete('/api/invoices/:invoice_id', (req, res) => {
    const id = req.params.invoice_id;

    Invoice.findOneAndDelete({ $or: [{ _id: id }, { InvoiceID: id }] })
        .then(invoice => {
            if (!invoice) {
                return res.status(404).json({ message: 'Invoice not found' });
            }
            res.send('Successfully! Invoice has been Deleted.');
        })
        .catch(err => res.status(500).send(err));
});

app.listen(port, () => {
    console.log("App listening on port: " + port);
});