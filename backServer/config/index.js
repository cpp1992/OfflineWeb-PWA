
'use strict'

var all = {
    sequelize:{
        username: 'root',
        password: '1234',
        database: 'mydb',
        host: "localhost",
        dialect: 'mysql',
        define: {
            underscored: false,
            timestamps: true,
            paranoid: true
        }
    }
};

module.exports = all;





