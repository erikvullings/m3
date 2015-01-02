var fs = require('fs');
var path = require('path');
var async = require('async');
var moviedb = require('moviedb');
var Store = require('./Store');
var TmbdMovieScanner = (function () {
    function TmbdMovieScanner() {
        this.isScanning = false;
        this.movieDb = moviedb('5df65b75a231df5de7ab80ce5817105c');
        // For testing purposes
        //this.movieDb.searchMovie({ query: "Aliens" }, (err, movies) => {
        //    if (err) {
        //        console.log('Error: ' + err);
        //        return;
        //    }
        //    console.log(movies);            
        //});
        //this.movieDb.movieInfo({ id: 666 }, (err, curMovie) => {
        //    if (err) {
        //        console.log('Error: ' + err);
        //        return;
        //    }
        //    console.log(curMovie.overview);
        //});
    }
    TmbdMovieScanner.prototype.parentPath = function (fullPath) {
        return path.join(fullPath, '..');
    };
    // Determine the file name based on the path
    TmbdMovieScanner.prototype.filmName = function (entry) {
        var pathElements = entry.path.substring(0, entry.path.length - 4).replace(/\/$/, '').replace('.', ' ').split(path.sep); // use the system default path separator to split it up
        var i;
        var index;
        for (i = 0; i < pathElements.length; i++) {
            var name = pathElements[i].toLowerCase().replace('.', ' '); // e.g. "My.movie.is.great" ==> "my movie is great"
            if (name.indexOf('video_ts') > -1)
                continue;
            index = name.indexOf('(');
            if (index > 0)
                name = name.substring(0, index - 1).trim(); // 'sin city (2005)' ==> 'sin city'
            index = name.indexOf('S0');
            if (index > 0)
                name = name.substring(0, index - 1).trim(); // 'dark angel S02D03' ==> 'dark angel' 
            return name;
        }
        return pathElements[0];
    };
    TmbdMovieScanner.prototype.loadFile = function (collectionTitle, file) {
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }
            Store.addMovieData(collectionTitle, data);
        });
    };
    TmbdMovieScanner.prototype.createFolder = function (folder) {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, 766);
        }
    };
    // Save the file to disk
    TmbdMovieScanner.prototype.saveFile = function (file, data) {
        fs.writeFile(file, JSON.stringify(data, null, 2), function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('JSON saved to ' + file);
            }
        });
    };
    // Get the movie info from TMBD, save the results, and add it to the movies collection.
    TmbdMovieScanner.prototype.getMovieInfo = function (collectionTitle, file, entry) {
        var _this = this;
        this.movieDb.searchMovie({ query: this.filmName(entry) }, function (err, res) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }
            if (res.results.length <= 0)
                return;
            var movieId = res.results[0].id;
            _this.movieDb.movieInfo({ id: movieId }, function (err2, curMovie) {
                if (err2) {
                    console.log('Error: ' + err2);
                    return;
                }
                _this.movieDb.movieCasts({ id: movieId }, function (err3, castCrew) {
                    if (err3) {
                        console.log('Error: ' + err3);
                        return;
                    }
                    curMovie.castCrew = castCrew;
                    // Create a copy of 'this', as in the below async call, 'this' is undefined.
                    async.every(castCrew.cast, function (cast) {
                        if (Store.existsPersonById(cast.id.toString()))
                            return;
                        _this.movieDb.personInfo({ id: cast.id }, function (err4, person) {
                            if (err4) {
                                console.log('Error: ' + err4);
                                return;
                            }
                            //console.log(person);
                            Store.addPerson(person);
                        });
                    }, function (err5) {
                        if (err5) {
                            console.log('Error: ' + err5);
                            return;
                        }
                        this.saveFile(file, curMovie);
                        curMovie.collection = collectionTitle;
                        Store.addMovie(curMovie, entry.fullPath);
                    });
                    //for (var i = 0; i < castCrew.cast.length; i++) {
                    //    this.movieDb.personInfo({ id: castCrew.cast[i].id }, (err, info) => {
                    //        if (err) {
                    //            console.log('Error: ' + err);
                    //            return;
                    //        }
                    //        console.log(info);                           
                    //    });
                    //}
                });
            });
        });
    };
    TmbdMovieScanner.prototype.movieScanner = function (collectionTitle, dir) {
        var _this = this;
        if (this.isScanning)
            return;
        this.isScanning = true;
        var readdirp = require('readdirp');
        var dataFolder = 'mc2';
        var dataFile = 'movie.json';
        readdirp({ root: dir, fileFilter: ['*.iso', '*.img', '*.mkv', '*.mp4', '*.wmv', 'VIDEO_TS.IFO'] }).on('data', function (entry) {
            var fileName;
            // do something with each movie file entry
            var diff = entry.fullParentDir.substring(dir.length); // do not create the mc2 path next to the root path
            if (entry.name.toLowerCase() === 'video_ts.ifo' && diff.length > 0) {
                // We are dealing with a DVD
                fileName = path.join(entry.fullParentDir, '..', dataFolder);
            }
            else {
                // We are dealing with a file
                fileName = path.join(entry.fullParentDir, dataFolder);
            }
            _this.createFolder(fileName);
            fileName = path.join(fileName, dataFile);
            fs.exists(fileName, function (exists) {
                if (exists) {
                    fs.stat(fileName, function (err, stats) {
                        if (err) {
                            console.log('Error: ' + err);
                            return;
                        }
                        var fileSizeInBytes = stats['size'];
                        if (fileSizeInBytes > 0)
                            _this.loadFile(collectionTitle, fileName);
                        else
                            _this.getMovieInfo(collectionTitle, fileName, entry);
                    });
                }
                else
                    _this.getMovieInfo(collectionTitle, fileName, entry);
            });
        }).on('end', function () {
            //Store.sortMoviesByKey('title');
        });
    };
    return TmbdMovieScanner;
})();
exports.TmbdMovieScanner = TmbdMovieScanner;
//# sourceMappingURL=TmbdMovieScanner.js.map