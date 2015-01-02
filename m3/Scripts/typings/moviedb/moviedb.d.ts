// Type definitions for moviedb
// Project: https://github.com/cavestri/themoviedb-javascript-library
// Definitions by: Erik Vullings
// Definitions: https://github.com/borisyankov/DefinitelyTyped


declare module MovieDB {
    export interface IMovieDB {
        searchMovie(params: SearchOptions, callback: (err: any, movies: SearchResults) => void): void;
        movieInfo(options: InfoOptions, callback: (err: any, curMovie: Movie) => void): void;
        movieCasts(options: InfoOptions, callback: (err: any, casts: CastCrew) => void): void;
        personInfo(options: InfoOptions, callback: (err: any, info: PersonInfo) => void): void;
    }

    export interface SearchOptions {
        query: string;
    }

    export interface InfoOptions {
        id: number;
    }

    export interface SearchResults {
        page         : number;
        results      : SearchResult[];
        total_Pages  : number;
        total_results: number;
    }

    export interface SearchResult {
        adult         : boolean;
        backdrop_path : string;
        id            : number;
        original_title: string;
        release_date  : Date;
        poster_path   : string;
        popularity    : number;
        title         : string;
        vote_average  : number;
        vote_count    : number;
    }

    export interface Movie {
        collection           : string
        adult                : boolean;
        backdrop_path        : string;
        belongs_to_collection: any;
        budget               : number;
        genres               : Genre[];
        homepage             : string;
        id                   : number;
        imdb_id              : number;
        original_title       : string;
        overview             : string;
        popularity           : number;
        poster_path          : string;
        production_companies : ProductionCompany[];
        production_countries : ProductionCountry[];
        release_date         : Date;
        revenue              : number;
        runtime              : number;
        spoken_languages     : SpokenLanguage[];
        status               : string;
        tagline              : string;
        title                : string;
        vote_average         : number;
        vote_count           : number;
        // My own additions
        videoFile            : string;
        castCrew             : CastCrew;
    }

    export interface CastCrew {
        cast : Cast[];
        crew : Crew[];
    }

    export interface Cast {
        cast_id     : number;
        character   : string;
        credit_id   : string;
        id          : number;
        name        : string;
        order       : number;
        profile_path: string;
    }

    export interface Crew {
        cast_id     : number;
        department  : string;
        credit_id   : string;
        id          : number;
        name        : string;
        job         : string;
        profile_path: string;
    }

    export interface PersonInfo {
        adult         : boolean;
        also_known_as : string[];
        biography     : string;
        birthday      : Date;
        deathday      : Date;
        homepage      : string;
        id            : number;
        imbd_id       : string;
        name          : string;
        place_of_birth: any;
        popularity    : number;
        profile_path  : string;
    }

    export interface Genre {
        id  : number;
        name: string;
    }

    export interface ProductionCompany {
        id  : number;
        name: string;
    }

    export interface ProductionCountry {
        iso_3166_1: number;
        name      : string;
    }

    export interface SpokenLanguage {
        iso_639_1: number;
        name     : string;
    }

    //export interface Person {
    //    info : 
    //}
    //     , "person" : {
    //        "Info" : { "resource": "person/:id", "method": "get" }
    //      , "Credits" : { "resource": "person/:id/credits", "method": "get" }
    //      , "Images" : { "resource": "person/:id/images", "method": "get" }
    //      , "Changes" : { "resource": "person/:id/changes", "method": "get" }
    //      , "Latest" : { "resource": "person/latest", "method": "get" }

}

declare module 'moviedb' {
    function apiKeyAcceptor(key: string): MovieDB.IMovieDB;
    export = apiKeyAcceptor;
}

