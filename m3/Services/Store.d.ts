import PersonCollection = require('../Models/IPersonCollection');
declare class Store {
    private static personStoreFile;
    static movieCollection: MovieDB.Movie[];
    static personCollection: PersonCollection.IPersonDictionary;
    static __StaticConstructor: void;
    static addPerson(person: MovieDB.PersonInfo): void;
    private static saveFile(file, data);
    private static loadFile(file);
    private static storeMovie(movie);
    static getPersonById(id: string): MovieDB.PersonInfo;
    static existsPersonById(id: string): boolean;
    static addMovie(movie: MovieDB.Movie, videoFile?: string): void;
    static addMovieData(collectionTitle: string, movieData: string): void;
    static sortMoviesByKey(key: string): void;
    static getMovieById(id: number): MovieDB.Movie;
    private static sortByKey(array, key);
}
export = Store;
