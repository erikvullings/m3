import readdirp = require('readdirp');
export declare class TmbdMovieScanner {
    movieDb: MovieDB.IMovieDB;
    constructor();
    parentPath(fullPath: string): string;
    filmName(entry: readdirp.Entry): string;
    loadFile(collectionTitle: string, file: string): void;
    createFolder(folder: string): void;
    saveFile(file: string, movie: MovieDB.Movie): void;
    /**
     * Get the movie info from TMBD, save the results, and add it to the movies collection.
     */
    getMovieInfo(collectionTitle: string, file: string, entry: readdirp.Entry): void;
    private isScanning;
    movieScanner(collectionTitle: string, dir: string): void;
}
