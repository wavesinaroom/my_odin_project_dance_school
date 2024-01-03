var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect("/login");
});

router.get('/logout', function(req,res,next){
  req.logout(function(err){
    if(err) {return next(err);}
    res.redirect('/')
  })
})

module.exports = router;
