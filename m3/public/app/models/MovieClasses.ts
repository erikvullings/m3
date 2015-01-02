module Models {
    export interface IEmployee {
        id         : number;
        name       : string;
        castId     : number;
        creditId   : string;
        profilePath: string;
    }

    export interface ICast extends IEmployee {
        character: string;
        order    : number;
    }

    export interface ICrew extends IEmployee {
        department: string;
        job       : string;
    }

    export interface ICastCrew {
        cast: ICast[];
        crew: ICrew[];
    }

    export interface IPersonInfo {
        adult       : boolean;
        alsoKnownAs : string[];
        biography   : string;
        birthday    : Date;
        deathday    : Date;
        homepage    : string;
        id          : number;
        imbdId      : string;
        name        : string;
        placeOfBirth: any;
        popularity  : number;
        profilePath : string;
    }

    export interface IGenre {
        id  : number;
        name: string;
    }

    export interface IProductionCompany {
        id  : number;
        name: string;
    }

    export interface IProductionCountry {
        iso31661 : number;
        name     : string;
    }

    export interface ISpokenLanguage {
        iso6391 : number;
        name    : string;
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


    export interface IMovie {
        collection           : string
        adult                : boolean;
        backdropPath         : string;
        belongsToCollection  : any;
        budget               : number;
        genres               : IGenre[];
        homepage             : string;
        id                   : number;
        imdbId               : number;
        originalTitle        : string;
        overview             : string;
        popularity           : number;
        posterPath           : string;
        productionCompanies  : IProductionCompany[];
        productionCountries  : IProductionCountry[];
        releaseDate          : Date;
        revenue              : number;
        runtime              : number;
        spokenLanguages      : ISpokenLanguage[];
        status               : string;
        tagline              : string;
        title                : string;
        voteAverage          : number;
        voteCount            : number;
        // My own additions
        videoFile            : string;
        castCrew             : ICastCrew;
    }

}