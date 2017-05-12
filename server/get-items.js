const sql = require('mssql');
const dateFormat = require('dateformat');
const dbconfig = require('./dbconfig');

const storedProcItems = 'PartNumberSuggestions';
const storedProcRevs = 'GetRevisionsForPart';
const storedProcDrawing = 'GetDrawingFileName';
const storedProcAux = 'GetAuxFileName';
const storedProcPlan = 'GetPlanFileName';
const storedProcParameters = 'GetParameters';
const storedProcBOM = 'GetMultiLevelBOM';

// // Callback method
// const getItemsFromRef = (prefix, callback) => {
//     const connectionPool = new sql.ConnectionPool(dbconfig);
//     connectionPool.connect().then(() => {
//         const request = new sql.Request(connectionPool);
//         request.input('LikeValue', sql.VarChar(255), prefix);
//         request.execute(storedProcItems).then((result) => {
//             // console.log(result);
//             callback(undefined, result.recordset);
//         }).catch((err) => {
//             console.log('Error retrieving records from the table.', err);
//             callback(err);
//         })
//     }).catch((err) => {
//         console.log('Error connecting to sql database.', err);
//         callback(err);
//     });
// }

// Promise based method
const getItemsFromRef = (prefix) => {
    return new Promise((resolve, reject) => {
        const connectionPool = new sql.ConnectionPool(dbconfig);
        connectionPool.connect().then(() => {
            const request = new sql.Request(connectionPool);
            request.input('LikeValue', sql.VarChar(255), prefix);
            request.execute(storedProcItems).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });
}

const getRevsForPart = (part) => {
    return new Promise((resolve, reject) => {
        const connectionPool = new sql.ConnectionPool(dbconfig);
        connectionPool.connect().then(() => {
            const request = new sql.Request(connectionPool);
            request.input('Part', sql.VarChar(255), part);
            request.execute(storedProcRevs).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });
}

const getDrawingFileName = (part, rev) => {
    return new Promise((resolve, reject) => {
        const connectionPool = new sql.ConnectionPool(dbconfig);
        connectionPool.connect().then(() => {
            const request = new sql.Request(connectionPool);
            request.input('Part', sql.VarChar(255), part);
            request.input('Rev', sql.VarChar(255), rev);
            request.execute(storedProcDrawing).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });    
}

const getAuxFileName = (part, rev) => {
    return new Promise((resolve, reject) => {
        const connectionPool = new sql.ConnectionPool(dbconfig);
        connectionPool.connect().then(() => {
            const request = new sql.Request(connectionPool);
            request.input('Part', sql.VarChar(255), part);
            request.input('Rev', sql.VarChar(255), rev);
            request.execute(storedProcAux).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });    
}

const getPlanFileName = (part, rev) => {
    // console.log(part + '/' + rev);
    return new Promise((resolve, reject) => {
        const connectionPool = new sql.ConnectionPool(dbconfig);
        connectionPool.connect().then(() => {
            const request = new sql.Request(connectionPool);
            request.input('Part', sql.VarChar(255), part);
            request.input('Rev', sql.VarChar(255), rev);
            request.execute(storedProcPlan).then((result) => {
                // console.log(result);
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });    
}

const getItemParameters = (part, rev) => {
    return new Promise((resolve, reject) => {
        const connectionPool = new sql.ConnectionPool(dbconfig);
        connectionPool.connect().then(() => {
            const request = new sql.Request(connectionPool);
            request.input('Part', sql.VarChar(255), part);
            request.input('Rev', sql.VarChar(255), rev);
            request.execute(storedProcParameters).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });    
}

const getBomRecordsFlat = (part) => {
    return new Promise((resolve, reject) => {
        const connectionPool = new sql.ConnectionPool(dbconfig);
        connectionPool.connect().then(() => {
            const request = new sql.Request(connectionPool);
            request.input('Part', sql.VarChar(255), part);
            request.execute(storedProcBOM).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });
}

const getBomRecordsTree = (part) => {
    return new Promise((resolve, reject) => {
        getBomRecordsFlat(part).then((result) => {
            const bomInput = result.recordset;
            if (bomInput.length === 0) {
                reject(`No BOM records found for part ${part}.`);
                return;
            }
            let bomTree = [];
            let parentObj = {
                LEVEL: 0,
                COMPONENT: part,
                folder: true,
                open: true,
                children: []
            };
            bomTree.push(parentObj);
            // let bomChildren = bomTree[0].children;
            // console.log('bomChildren', bomChildren);
            // bomChildren will be starting point recursing the array
            // bomChildren = getNestedChildren(bomInput, part);
            // bomTree.push(bomChildren);
            // resolve(bomTree);
            let bomChildren = recurseBomRecords(bomInput, part);
            bomTree[0].children = bomChildren;
            resolve(bomTree);
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    });
}

const recurseBomRecords = (bomFlat, parent) => {
    let out = [];
    bomFlat.forEach((record) => {
        if (record.PARENT === parent && record.COMPONENT !== 'DCR') {
            let childObj = getChildObjForParent(bomFlat, record);
            out.push(childObj);
            if (childObj.children !== undefined) {
                let children = recurseBomRecords(bomFlat, childObj.COMPONENT)
                childObj.children = children;
                out.push(childObj);
            }
        }
    })
    return out;
}

const getChildObjForParent = (bomInput, record) => {
    let childObj = {
        LEVEL: '_'.repeat(record.Level) + record.Level,
        COMPONENT: record.COMPONENT,
        PT_USE: record.PT_USE,
        QTY: record.QTY,
        UM: record.UM,
        SEQN: record.SEQN,
        COM_TYP: record.COM_TYP,
        MB: record.COMP_MB,
        IN_EFFECT: dateFormat(record.IN_EFFECT, 'shortDate'),
        OUT_EFFECT: dateFormat(record.OUT_EFFECT, 'shortDate')
    };
    childObj.REV = getBomRevForItem(bomInput, record.COMPONENT);
    if (!isBomLeafNode(bomInput, record.COMPONENT)) {
        childObj.children = [];
        childObj.folder = true;
        childObj.open = true;
    }
    return childObj;
}

const getBomRevForItem = (bomFlat, part) => {
    let revValue = '';
    if (bomFlat.length > 0 && part.length > 0) {
        const dcrRecord = bomFlat.filter((record) => {
            return record.PARENT === part && record.COMPONENT === 'DCR';
        });
        if (dcrRecord.length > 0) {
            revValue = dcrRecord[0].PT_USE.replace('REV', '').trim();
            // revValue = dcrRecord[0].PT_USE;
        }
    }
    return revValue
}

const isBomLeafNode = (bomFlat, component) => {
    let retValue = false;
    if (bomFlat.length > 0) {
        const children = bomFlat.filter((record) => {
            return record.PARENT === component && record.COMPONENT !== 'DCR';
        })
        retValue = (children.length > 0) ? false : true;
    }
    return retValue;
}

module.exports = {
    getItemsFromRef, 
    getRevsForPart, 
    getDrawingFileName, 
    getAuxFileName,
    getPlanFileName,
    getItemParameters,
    getBomRecordsFlat,
    getBomRecordsTree
};