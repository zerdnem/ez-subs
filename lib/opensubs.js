var openSubs = require('subtitler');
var Q = require('q');



module.exports = {
    get: function(LANGUAGE, QUERY){
        var deferred = Q.defer();
        var subs = [];
        openSubs.api.login()
            .done(function(TOKEN){
                openSubs.api.searchForTitle(TOKEN, LANGUAGE, QUERY)
                    .done(function(results){
                        if (typeof results[0] != 'undefined') {
                            results.forEach(function(subtitles){
                                var fileName = subtitles.SubFileName;
                                var subLink = subtitles.SubDownloadLink.split('.gz').join('.srt');
                                subs.push({filename: fileName, link: subLink});
                                deferred.resolve(subs);
                            });
                        } else {
                            deferred.resolve(false);
                        }
                    });
            });
        return deferred.promise;
    }
}; 


