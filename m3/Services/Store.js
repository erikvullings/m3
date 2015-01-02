var path = require('path');
var fs = require('fs');
// In-memory store to store the movies
var Store = (function () {
    function Store() {
    }
    //public static setSocket(socket: io.Socket) { this.socket = socket; }
    // Add a person to the collection
    Store.addPerson = function (person) {
        if (Store.existsPersonById(person.id.toString()) != null)
            return; // already present
        Store.personCollection[person.id] = person;
        Store.saveFile(Store.personStoreFile, Store.personCollection);
    };
    // Save to disk
    Store.saveFile = function (file, data) {
        fs.writeFile(file, JSON.stringify(data, null, 2), function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('JSON saved to ' + file);
            }
        });
    };
    Store.loadFile = function (file) {
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }
            Store.personCollection = data;
        });
    };
    Store.storeMovie = function (movie) {
        Store.movieCollection.push(movie);
    };
    // Get a person by id
    Store.getPersonById = function (id) {
        return Store.personCollection[id];
    };
    // Check if a person exists
    Store.existsPersonById = function (id) {
        return Store.personCollection[id] != null;
    };
    // Add a movie to the collection
    Store.addMovie = function (movie, videoFile) {
        try {
            if (videoFile)
                movie.videoFile = videoFile;
            Store.storeMovie(movie);
        }
        catch (e) {
            console.log(e);
        }
    };
    // Add a movie (as string) to the collection
    Store.addMovieData = function (collectionTitle, movieData) {
        try {
            var movie = JSON.parse(movieData);
            movie.collection = collectionTitle;
            Store.storeMovie(movie);
        }
        catch (e) {
            console.log(e);
        }
    };
    Store.sortMoviesByKey = function (key) {
        Store.movieCollection = Store.sortByKey(Store.movieCollection, key);
    };
    Store.getMovieById = function (id) {
        for (var i = 0; i < Store.movieCollection.length; i++) {
            var movie = Store.movieCollection[i];
            if (movie.id === id)
                return movie;
        }
        return null;
    };
    // Sort array by key
    // http://stackoverflow.com/questions/8175093/simple-function-to-sort-an-array-of-objects/8175221#8175221
    Store.sortByKey = function (array, key) {
        return array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    };
    // File to be used for storing the person information
    Store.personStoreFile = path.join(__dirname, 'personStore.json');
    // A static in-memory array to hold all the movies. Note that we also immediately initialize it.
    Store.movieCollection = new Array();
    Store.personCollection = {};
    Store.__StaticConstructor = (function () {
        // Load the person store from disk;
        if (!fs.existsSync(Store.personStoreFile))
            return;
        Store.loadFile(Store.personStoreFile);
    })();
    return Store;
})();
module.exports = Store;
//# sourceMappingURL=Store.js.map