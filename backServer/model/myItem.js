'use strict'


module.exports = function(sequelize,DataTypes){
    var myItem = sequelize.define('table_details',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey: true
        },
        name:{
            type:DataTypes.CHAR
        },
        price:{
            type:DataTypes.CHAR
        },
        image:{
            type:DataTypes.CHAR
        },
		description:{
			type:DataTypes.CHAR
		},
        url:{
            type:DataTypes.CHAR
        }
    },{
        freezeTableName: true,
		timestamps: false
    });

    return myItem;
};









