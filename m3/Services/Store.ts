import PersonCollection = require('../Models/IPersonCollection');
import path = require('path');
import fs = require('fs');

// In-memory store to store the movies
class Store {
    // File to be used for storing the person information
    private static personStoreFile = path.join(__dirname, 'personStore.json');

    // A static in-memory array to hold all the movies. Note that we also immediately initialize it.
    static movieCollection = new Array<MovieDB.Movie>();
    static personCollection: PersonCollection.IPersonDictionary = {};

    static __StaticConstructor = (() => {
        // Load the person store from disk;
        if (!fs.existsSync(Store.personStoreFile)) return;
        Store.loadFile(Store.personStoreFile);
    })();

    //public static setSocket(socket: io.Socket) { this.socket = socket; }

    // Add a person to the collection
    static addPerson(person: MovieDB.PersonInfo) {
        if (Store.existsPersonById(person.id.toString()) != null) return; // already present
        Store.personCollection[person.id] = person;
        Store.saveFile(Store.personStoreFile, Store.personCollection);
    }

    // Save to disk
    private static saveFile(file: string, data: any) {
        fs.writeFile(file, JSON.stringify(data, null, 2), err => {
            if (err) {
                console.log(err);
            } else {
                console.log('JSON saved to ' + file);
            }
        });
    }

    private static loadFile(file: string) {
        fs.readFile(file, 'utf8', (err, data: PersonCollection.IPersonDictionary) => {
            if (err) {
                console.log('Error: ' + err);
                return;
            }
            Store.personCollection = data;
        });
    }

    private static storeMovie(movie: MovieDB.Movie) {
        Store.movieCollection.push(movie);
    }

    // Get a person by id
    static getPersonById(id: string): MovieDB.PersonInfo {
        return Store.personCollection[id];
    }

    // Check if a person exists
    static existsPersonById(id: string): boolean {
        return Store.personCollection[id] != null;
    }

    // Add a movie to the collection
    static addMovie(movie: MovieDB.Movie, videoFile?: string) {
        try {
            if (videoFile) movie.videoFile = videoFile;
            Store.storeMovie(movie);
        } catch (e) {
            console.log(e);
        }
    }

    // Add a movie (as string) to the collection
    static addMovieData(collectionTitle: string, movieData: string) {
        try {
            var movie: MovieDB.Movie = JSON.parse(movieData);
            movie.collection = collectionTitle;
            Store.storeMovie(movie);
        }
        catch (e) {
            console.log(e);
        }
    }

    static sortMoviesByKey(key: string) {
        Store.movieCollection = Store.sortByKey(Store.movieCollection, key);
    }

    static getMovieById(id: number): MovieDB.Movie {
        for (var i = 0; i < Store.movieCollection.length; i++) {
            var movie = Store.movieCollection[i];
            if (movie.id === id) return movie;
        }
        return null;
    }

    // Sort array by key
    // http://stackoverflow.com/questions/8175093/simple-function-to-sort-an-array-of-objects/8175221#8175221
    private static sortByKey(array: any[], key: string) {
        return array.sort((a, b) => {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

}
// By exporting it like this, we can do
// import Store = require('Store');
// Store.addMovie(...)
export = Store;