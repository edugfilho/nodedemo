var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/orderlist', function(req, res) {
    var db = req.db;
    var collection = db.get('orderlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * POST 
 */
router.post('/addorder', function(req, res) {
    var db = req.db;
    var collection = db.get('orderlist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE 
 */
router.delete('/deleteorder/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('orderlist');
    var orderToDelete = req.params.id;
    collection.remove({ '_id' : orderToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;