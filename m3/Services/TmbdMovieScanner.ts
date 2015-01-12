import fs = require('fs');
import path = require('path');
import async = require('async');
import readdirp = require('readdirp');
import moviedb = require('moviedb');
import Store = require('./Store');

export class TmbdMovieScanner {
    movieDb: MovieDB.IMovieDB;

    constructor() {
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

    parentPath(fullPath: string) {
        return path.join(fullPath, '..');
    }

    // Determine the file name based on the path
    filmName(entry: readdirp.Entry) {
        var pathElements = entry.path
            .substring(0, entry.path.length - 4)    // remove the extension (last 4 chars)
            .replace(/\/$/, '')                     // replace path separators
            .replace('.', ' ')                      // replace dots with spaces
            .split(path.sep);                       // use the system default path separator to split it up
        var i: number;
        var index: number;
        for (i = 0; i < pathElements.length; i++) {
            var name = pathElements[i].toLowerCase().replace('.', ' '); // e.g. "My.movie.is.great" ==> "my movie is great"
            if (name.indexOf('video_ts') > -1) continue;
            index = name.indexOf('(');
            if (index > 0) name = name.substring(0, index - 1).trim(); // 'sin city (2005)' ==> 'sin city'
            index = name.indexOf('S0');
            if (index > 0) name = name.substring(0, index - 1).trim(); // 'dark angel S02D03' ==> 'dark angel' 
            return name;
        }
        return pathElements[0];
    }

    loadFile(collectionTitle: string, file: string) {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                console.log('Error: ' + err);
                return;
            }
            Store.addMovieData(collectionTitle, data);
        });
    }

    createFolder(folder: string) {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, 766);
        }
    }

    // Save the file to disk
    saveFile(file: string, movie: MovieDB.Movie) {
        fs.writeFile(file, JSON.stringify(movie, null, 2), err => {
            if (err) {
                console.log('Error saveFile: ' + err);
                return;
            } 
            console.log('Saved \'' + movie.title + '\' to ' + file + '.');
        });
    }

    /**
     * Get the movie info from TMBD, save the results, and add it to the movies collection.
     */
    getMovieInfo(collectionTitle: string, file: string, entry: readdirp.Entry) {
        this.movieDb.searchMovie({ query: this.filmName(entry) }, (err, res) => {
            if (err) {
                console.log('Error getMovieInfo.searchMovie: ' + err);
                return;
            }
            if (res.results.length <= 0) return;
            var movieId = res.results[0].id;
            this.movieDb.movieInfo({ id: movieId }, (err2, curMovie) => {
                if (err2) {
                    console.log('Error getMovieInfo.movieInfo: ' + err2);
                    return;
                }
                this.saveFile(file, curMovie);
                curMovie.collection = collectionTitle;
                Store.addMovie(curMovie, entry.fullPath);
                //this.movieDb.movieCasts({ id: movieId }, (err3, castCrew) => {
                //    if (err3) {
                //        console.log('Error: ' + err3);
                //        return;
                //    }
                //    curMovie.castCrew = castCrew;
                //    // Create a copy of 'this', as in the below async call, 'this' is undefined.
                //    async.every(castCrew.cast, (cast) => {
                //        if (Store.existsPersonById(cast.id.toString())) return;
                //        this.movieDb.personInfo({ id: cast.id }, (err4, person) => {
                //            if (err4) {
                //                console.log('Error: ' + err4);
                //                return;
                //            }
                //            //console.log(person);
                //            Store.addPerson(person);
                //        });
                //    },
                //        function (err5) {
                //            if (err5) {
                //                console.log('Error: ' + err5);
                //                return;
                //            }
                //            this.saveFile(file, curMovie);
                //            curMovie.collection = collectionTitle;
                //            Store.addMovie(curMovie, entry.fullPath);
                //        });
                //    //for (var i = 0; i < castCrew.cast.length; i++) {
                //    //    this.movieDb.personInfo({ id: castCrew.cast[i].id }, (err, info) => {
                //    //        if (err) {
                //    //            console.log('Error: ' + err);
                //    //            return;
                //    //        }
                //    //        console.log(info);                           
                //    //    });
                //    //}

                //});
            });
        });
    }

    private isScanning: boolean = false;

    public movieScanner(collectionTitle: string, dir: string) {
        if (this.isScanning) return;
        this.isScanning = true;
        var readdirp = require('readdirp');
        var dataFolder = 'mc2';
        var dataFile = 'movie.json';
        readdirp({ root: dir, fileFilter: ['*.iso', '*.img', '*.mkv', '*.mp4', '*.wmv', 'VIDEO_TS.IFO'] })
            .on('data', (entry: readdirp.Entry) => {
                var fileName: string;
                // do something with each movie file entry
                var diff = entry.fullParentDir.substring(dir.length); // do not create the mc2 path next to the root path
                if (entry.name.toLowerCase() === 'video_ts.ifo' && diff.length > 0) {
                    // We are dealing with a DVD
                    fileName = path.join(entry.fullParentDir, '..', dataFolder);
                } else {
                    // We are dealing with a file
                    fileName = path.join(entry.fullParentDir, dataFolder);
                }
                this.createFolder(fileName);
                fileName = path.join(fileName, dataFile);
                fs.exists(fileName, (exists: boolean) => {
                    if (exists) {
                        fs.stat(fileName, (err, stats) => {
                            if (err) {
                                console.log('Error: ' + err);
                                return;
                            }
                            var fileSizeInBytes = stats['size'];
                            if (fileSizeInBytes > 0)
                                this.loadFile(collectionTitle, fileName);
                            else
                                this.getMovieInfo(collectionTitle, fileName, entry);
                        });
                    } else
                        this.getMovieInfo(collectionTitle, fileName, entry);
                });
            })
            .on('end', () => {
                //Store.sortMoviesByKey('title');
            });
    }
}