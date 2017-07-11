var express = require('express');
var db = require('../sqldb');
var myItem = db.myItem;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/add/myItem',function(req,res,next){
    console.log("+++++++++++++++++++++++");
    var savemyItem = {
        name:req.body.name,
        url:req.body.url,
        description:req.body.description,
        image:req.body.image,
        price:req.body.price
    };

    return db.sequelize.transaction(function(t){
        console.log("+++++++++++++++++++");
        return myItem.create(savemyItem,{
            transaction:t
        }).then(function(result){
            res.send(result);
        }).catch(function(err){
            console.log("发生错误：" + err);
        });
    })
});

router.get('/api/item/list/:search', function(req, res){
	console.log('Search:', req.params.search);
	myItem.findAll({
        where: {
            name: {
                $like: '%'+req.params.search+'%',
            },
        },
    }).then(function(list){
        res.json(list);
    });
});

router.get('/api/item/:id',function(req,res,next){
	return db.sequelize.transaction(function(t){
        return myItem.findById(req.params.id).then(function(item){
            res.send(item);
	    }).catch(function(err){
            console.log("发生错误：" + err);
        });
    });
});



module.exports = router;
