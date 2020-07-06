import { version, build } from "../version.json";
import * as dbsample from '../db-sample.json';

const data = {
    appName: 'Counter App',
    appVersion : version,
    appBuild : build,

    currentView : {},
    currentCounter : 0,
    counter : {
        count : 0,
        start : false,
        end: false
    },
    db : JSON.parse(localStorage.getItem('counter-app-items')) || dbsample.default,
    dbURL : '#db',

    // noSleep : new NoSleep()

    // --------------
    // Common methods
    switchView : function(path) {

        const paths = {
            '/' : {
                app : true,
                settings : false
            },
            '/settings' : {
                app : false,
                settings : true
            }
        }
        this.currentView = paths[path];
    },
    databaseSave : function() {
        localStorage.setItem('counter-app-items', JSON.stringify(this.db));
    }

};

export const Data = data;
