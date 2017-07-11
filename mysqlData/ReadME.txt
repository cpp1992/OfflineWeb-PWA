项目的数据库文件

需要MySql5.7以上
Sever => data import  =>  Import from self-Contained file => 选择sql 
=> 修改Default Target Schema名字为 mysql(来自config/index.js 的 数据库名字参数：dialect)

注意：表名不会导入的时候改变:table_details，表名来自于 model/myItem  sequelize.define('table_details',{......