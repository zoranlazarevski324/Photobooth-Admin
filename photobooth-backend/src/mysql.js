const mysql = require('mysql');

const mysqlCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
});

mysqlCon.connect((err) => {
    if(err){
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});

export default mysqlCon