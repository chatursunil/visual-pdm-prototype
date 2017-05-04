const fs = require('fs');

const drawing_paths_spec = 'g:/pdm/draw/hold;g:/pdm/draw;i:/sketches;i:/tool;g:/pdm/draw/bgm';

// The following function will return the fully qualified file spec with path information for the
// sendFile method in index.js. If the file cannot be found in any of the paths
// then it will reject the promise with 'File not found' string.
const getDrawingFileSpec = (fileName) => {
    return new Promise((resolve, reject) => {
        // make the search paths array
        const searchPaths = drawing_paths_spec.split(';').map((path) => {
            return path.trim();
        });

        let foundFile = false;
        for (let path of searchPaths) {
            try {
                fileSpec = `${path}/${fileName}`
                fs.accessSync(fileSpec, fs.F_OK)
                foundFile = true
                // resolve(`{root: '${path}'}`);
                resolve(fileSpec);
                break;
            } catch (error) {
                foundFile = false;
            }            
        }
        if (!foundFile) {
            reject('File not found');
        }
    });
}

const plan_paths_spec = 'g:/pdm/plan/chi;g:/pdm/plan/chi/copics;g:/pdm/plan/chi/ep_plans;g:/pdm/plan/peo;g:/pdm/auxil/peo';
const getPlanFileSpec = (fileName) => {
    return new Promise((resolve, reject) => {
        // make the search paths array
        const searchPaths = plan_paths_spec.split(';').map((path) => {
            return path.trim();
        });

        let foundFile = false;
        for (let path of searchPaths) {
            try {
                fileSpec = `${path}/${fileName}`
                fs.accessSync(fileSpec, fs.F_OK)
                foundFile = true
                // resolve(`{root: '${path}'}`);
                resolve(fileSpec);
                break;
            } catch (error) {
                foundFile = false;
            }            
        }
        if (!foundFile) {
            reject('File not found');
        }
    });
}

module.exports = {getDrawingFileSpec, getPlanFileSpec};