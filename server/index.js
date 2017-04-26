const express = require('express');
const path = require('path');
const port = process.env.PORT || 9000;

const app = express();

// const root = 'G:/PDM/Draw'
// const root = path.resolve(__dirname, 'pdf-viewer/web');

//const root = path.resolve(__dirname, '..', 'public')    // Development
// const root = path.resolve(__dirname, '..', 'build')     // Production

// app.use(express.static(root));
// app.use('/drawing', express.static('G:/PDM/Draw'));

app.get('/', (req, res) => {
    res.sendFile('12901951.F.PDF', {
        root: 'G:/PDM/Draw'
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});