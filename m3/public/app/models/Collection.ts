module Models {
    'use strict';

    export interface ICollection {
        title : string;
        path  : string;
        movies?: Models.IMovie[];
    }
}