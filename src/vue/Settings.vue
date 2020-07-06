<template lang="html">
    <section>
        <h2>Settings</h2>
        <h3>{{ appName }} v{{ appVersion }} by <a href="https://twitter.com/alterebro" title="Jorge Moreno. Front End Web Developer and UI Designer" target="_blank">@alterebro</a></h3>
        <hr />
        <h4>Export and export database file</h4>
        <p><a :href="dbURL" download="db.txt" @click="dbExport()">Export data / Save DB</a></p>

        <h4>Import data file (db.txt)</h4>
        <p><input type="file" @change="dbImport" accept=".txt"></p>

        <hr />
        <p>{{ appName }} v{{ appVersion }} ( <em>build: {{ appBuild }}</em> )</p>
    </section>
</template>

<script>
import { Data } from './Store.js';
export default {
    data() { return Data },
    name : 'Settings',
    methods : {
        changeView : function(path) {
            this.switchView(path);
        },
        dbSave : function() {
            this.databaseSave();
        },

        dbExport : function() {

            let _db = JSON.stringify(this.db);
            let _blob = new Blob([_db], {type: "text/plain;charset=utf-8"});
            let _url = window.URL.createObjectURL(_blob);
            this.dbURL = _url;

            return true;
            // window.URL.revokeObjectURL(_url);
        },
        dbImport : function(ev) {

            let _file = ev.target.files[0];
            let _reader = new FileReader();
                _reader.readAsText(_file);
                _reader.onload = (e) => {
                    let _db = JSON.parse(e.target.result);
                        _db.forEach((item, i) => {
                            if (!(( !!item.name && typeof(item.name) === 'string' ) && ( !!item.elements && Array.isArray(item.elements) ))) {
                                _db = false;
                            }
                        });

                    if (_db) {
                        this.db = _db;
                        this.dbSave();
                        this.changeView('/');
                    }
                }
        }
    }
}
</script>

<style lang="scss" scoped>
section {

}
</style>
