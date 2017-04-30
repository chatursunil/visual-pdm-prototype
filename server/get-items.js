const sql = require('mssql');
const dbconfig = require('./dbconfig');

const storedProc = 'PartNumberSuggestions';

// // Callback method
// const getItemsFromRef = (prefix, callback) => {
//     const connectionPool = new sql.ConnectionPool(dbconfig);
//     connectionPool.connect().then(() => {
//         const request = new sql.Request(connectionPool);
//         request.input('LikeValue', sql.VarChar(255), prefix);
//         request.execute(storedProc).then((result) => {
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
            request.execute(storedProc).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = {getItemsFromRef};