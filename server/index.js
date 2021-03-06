const express = require('express');
const mime = require('mime-types');
// const path = require('path');

const getItems = require('./get-items');
const getFile = require('./get-file');

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

app.get('/', (req, res) => {
    res.status(200).send('This REST API service is ready serve on <b>' + req.headers.host + '</b>');
});

// ***************************************************
// Route for sending drawing file
// ***************************************************
app.get('/drawing/:part/:rev?', (req, res) => {
    const part = req.params.part;
    let rev = req.params.rev || '';
    // res.sendFile('12901951.F.PDF', {
    //     root: 'G:/PDM/Draw'
    // });
    if (rev.length === 0) {
        getItems.getDefaultRevForPart(part).then((revLetter) => {
            rev = revLetter;
            // console.log('rev=' + rev);
            handleDrawingGetRoute(res, part, rev);
        });
    } else {
        handleDrawingGetRoute(res, part, rev);
    }
    // console.log('rev=' + rev);
});

const handleDrawingGetRoute = (res, part, rev) => {
    if (part.length > 0 && rev.length > 0){
        getItems.getDrawingFileName(part, rev).then((result) => {
            // console.log(result.recordset[0].Object);
            const fileName = result.recordset[0].Object || '';
            if (fileName.length > 0) {
                getFile.getDrawingFileSpec(fileName).then((fileSpec) => {
                    // console.log(filePath);
                    if (fileSpec.length > 0){
                        res.setHeader('content-type', mime.contentType(fileName));
                        res.setHeader('content-disposition', 'inline; filename="' + fileName + '"');
                        res.sendFile(fileSpec);
                    } else {
                        res.status(404).json([]);
                    }
                }).catch((err) => {
                    res.status(500).send(`The associated file '${fileName}' for this part/rev could not be found in the search path.`);
                });
            } else {
                // res.status(404).json([]);
                res.status(200).send('There is no drawing associated for this part and rev.');
            }
        }).catch((err) => {
            // res.status(404).json([]);
            res.status(200).send('There is no drawing associated for this part and rev.');
        })
    } else {
        res.status(404).json([]);
    }    
}
// *********************** End Drawing Route Handler ***************

// Route for sending Auxiliary file
app.get('/auxiliary/:part/:rev', (req, res) => {
    const part = req.params.part;
    const rev = req.params.rev;
    if (part.length > 0 && rev.length > 0) {
        getItems.getAuxFileName(part, rev).then((result) => {
            // console.log(result.recordset[0].Object);
            const fileName = result.recordset[0].Object;
            if (fileName.length > 0) {
                getFile.getAuxFileSpec(fileName).then((fileSpec) => {
                    // console.log(filePath);
                    if (fileSpec.length > 0){
                        res.setHeader('content-type', mime.contentType(fileName));
                        res.setHeader('content-disposition', 'inline; filename="' + fileName + '"');
                        res.sendFile(fileSpec);
                    } else {
                        res.status(404).json([]);
                    }
                }).catch((err) => {
                    res.status(500).send(`The associated file '${fileName}' for this part/rev could not be found in the search path.`);
                });
            } else {
                // res.status(404).json([]);
                res.status(200).send('There is no Auxiliary file associated for this part and rev.');
            }
        }).catch((err) => {
            // res.status(404).json([]);
            res.status(200).send('There is no Auxiliary file associated for this part and rev.');
        })
    } else {
        res.status(404).json([]);
        
    }
});

// Route for sending Process Plan file
app.get('/processplan/:part/:rev', (req, res) => {
    const part = req.params.part;
    const rev = req.params.rev;
    if (part.length > 0 && rev.length > 0){
        getItems.getPlanFileName(part, rev).then((result) => {
            // console.log(result.recordset[0].Object);
            const fileName = result.recordset[0].Object;
            if (fileName.length > 0) {
                getFile.getPlanFileSpec(fileName).then((fileSpec) => {
                    // console.log(filePath);
                    if (fileSpec.length > 0){
                        res.setHeader('content-type', mime.contentType(fileName));
                        res.setHeader('content-disposition', 'inline; filename="' + fileName + '"');
                        res.sendFile(fileSpec);
                    } else {
                        res.status(404).json([]);
                    }
                }).catch((err) => {
                    res.status(500).send(`The associated file '${fileName}' for this part/rev could not be found in the search path.`);
                });
            } else {
                // res.status(404).json([]);
                res.status(200).send('There is no process plan associated for this part and rev.');
            }
        }).catch((err) => {
            // res.status(404).json([]);
            res.status(200).send('There is no process plan associated for this part and rev.');
        })
    } else {
        res.status(404).json([]);
    }
});

// *********************************************************************
// Route for the returning Parameters Data for the given part and rev
// *********************************************************************
app.get('/parameters/:part/:rev', (req, res) => {
    const part = req.params.part.trim();
    const rev = req.params.rev.trim() || '';
    if (rev.length === 0) {
        getItems.getDefaultRevForPart(part).then((revLetter) => {
            rev = revLetter;
            handleParametersGetRoute(res, part, rev);
        });
    } else {
        handleParametersGetRoute(res, part, rev);
    }
});

const handleParametersGetRoute = (res, part, rev) => {
    if (part.length > 0 && rev.length > 0) {
        getItems.getItemParameters(part, rev).then((result) => {
            res.status(200).json(result.recordset);
        }).catch((err) => {
            res.status(500).json([]);
        })
    }    
}
// ***************** End Parameters Route Handler *********************

// Route for returning BOM data for the given part
app.get('/bom/:part/:rev', (req, res) => {
    const part = req.params.part.trim();
    if (part.length > 0) {
        getItems.getBomRecordsTree(part).then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json([]);
        });
    }
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
        // console.log('Error retrieving records from database', err);
        res.status(500).json([]);
    });
});

// Route for returning all available revs for the selected part
app.get('/revsforpart/:part', (req, res) => {
    const part = req.params.part;
    getItems.getRevsForPart(part).then((result) => {
        res.status(200).json(result.recordset);
    }).catch((err) => {
        console.log('Error getting revs for part ' + part, err);
        res.status(500).json([]);
    });
});

//  Route for getting the current Rev for a part
app.get('/defaultrevforpart/:part', (req, res) => {
    const part = req.params.part;
    getItems.getDefaultRevForPart(part).then(rev => {
        res.status(200).json({rev});
    }).catch((err) => {
        res.status(500).json([]);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});