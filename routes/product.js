var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/productlist', function(req, res) {
    var db = req.db;
    var collection = db.get('productlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

router.get('/productnome/:nome', function(req, res) {
    var db = req.db;
    var collection = db.get('productlist');
    var prodToShow = req.params.nome;
    collection.find({ 'nome' : prodToShow }, function(e,docs){
         res.json(docs);
    });
});


/*
 * POST 
 */
router.post('/addproduct', function(req, res) {
    var db = req.db;
    var collection = db.get('productlist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE 
 */
router.delete('/deleteproduct/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('productlist');
    var prodToDelete = req.params.id;
    collection.remove({ '_id' : prodToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;