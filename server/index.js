const express = require('express');
const path = require('path');

const getItems = require('./get-items');
const port = process.env.PORT || 9000;

const app = express();

// const root = 'G:/PDM/Draw'
// const root = path.resolve(__dirname, 'pdf-viewer/web');

//const root = path.resolve(__dirname, '..', 'public')    // Development
// const root = path.resolve(__dirname, '..', 'build')     // Production

// app.use(express.static(root));
// app.use('/drawing', express.static('G:/PDM/Draw'));

// The following middleware is enable CORS so that the react application
// hosted anywhere can talk to this server
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/drawing', (req, res) => {
    res.sendFile('12901951.F.PDF', {
        root: 'G:/PDM/Draw'
    });
});

// Route for returning partnumber and revs for the text input on the homepage.
app.get('/suggestitems/:prefix', (req, res) => {
    const prefix = req.params.prefix;
    // // Callback way
    // getItems.getItemsFromRef(prefix, (err, result) => {
    //     if (err) {
    //         res.status(500).send('Error retrieving records from database', err);
    //         return;
    //     }
    //     res.status(200).send(result);
    // });

    // Promise way
    getItems.getItemsFromRef(prefix).then((result) => {
        res.status(200).json(result.recordset);
    }).catch((err) => {
        console.log('Error retrieving records from database', err);
        res.status(500).json([]);
    });
})

// Route for returning all available revs for the selected part
app.get('/revsforpart/:part', (req, res) => {
    const part = req.params.part;
    getItems.getRevsForPart(part).then((result) => {
        res.status(200).json(result.recordset);
    }).catch((err) => {
        console.log('Error getting revs for part ' + part, err);
        res.status(500).json([]);
    });
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});