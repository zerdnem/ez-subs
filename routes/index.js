var express = require('express');
var router = express.Router();
var settings = require('../settings');
var openSubs = require('../lib/opensubs');
var asyncChaible = require('async-chainable');

/* GET home page. */
router.route('/')
    .get(function(req, res, next){
        var langs = settings.SUBTITLE_LANGUAGE;
        res.render('index', { langs: langs });
    })
    .post(function(req, res){

        var subs = [];
        var QUERY = req.body.subFilename;
        var LANGUAGE = req.body.subLanguage;

        asyncChaible()
            .then(function(next){
                openSubs.get(LANGUAGE, QUERY).then(function(data){
                    if (!data){return next();} 
                    data.forEach(function(subtitles){
                        var filename = subtitles.filename;
                        var link = subtitles.link;
                        console.log(filename);
                        subs.push({filename: filename, link: link});
                        next();
                    });
                });
            })
            .then(function(next){
                console.log('next function');
                next();
            })
            .end(function(err){
                if (err) { res.status(400).render('subs', { subs: subs }); }
                res.render('subs', {subs: subs});
            });
    });

module.exports = router;
