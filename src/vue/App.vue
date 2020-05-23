<template>
    <div class="app">
        <header>
            <div>
                <h1>{{ appName }}</h1>
                <a v-show="currentView.app" href="#" @click="changeView('/settings')"><span class="material-icons"><i class="material-icons">menu</i></span></a>
                <a v-show="!currentView.app" href="#" @click="changeView('/')"><span class="material-icons">arrow_back_ios</span></a>
            </div>
        </header>

        <main v-show="currentView.settings">
            <section>
                <h2>Settings</h2>
                <h3>{{ appName }} v{{ appVersion }} by <a href="https://twitter.com/alterebro">@alterebro</a></h3>
                <hr />
                <h4>Export and export database file</h4>
                <p><a :href="dbURL" download="db.txt" @click="dbExport()">Export data / Save DB</a></p>

                <h4>Import data file (db.txt)</h4>
                <p><input type="file" @change="dbImport" accept=".txt"></p>

                <hr />
                <p>{{ appName }} v{{ appVersion }} ( <em>build: {{ appBuild }}</em> )</p>
            </section>
        </main>

        <main v-show="currentView.app">
            <section v-show="!counter.start">

                <dl>
                    <template v-for="(group, g) in db">
                        <dt>
                            <strong>{{ group.name }}</strong>
                            <button @click="counterStart(g)">Count!</button>
                        </dt>
                        <dd>
                            <ul>
                                <li v-for="(day, d) in dbjson[g]">
                                    <details>
                                        <summary><span>{{ day.date }}</span> <strong>{{ day.total }}</strong></summary>
                                        <ul>
                                            <li v-for="(item, i) in day.items">
                                                <span>{{ item.start }} ({{ item.duration }})</span>
                                                <em>{{ item.count }}</em>
                                            </li>
                                        </ul>
                                    </details>
                                </li>
                            </ul>
                        </dd>
                    </template>
                </dl>

                <!--
                <hr />
                <ul>
                    <li v-for="(group, g) in db">
                        <details>
                            <summary>
                                <strong>{{ group.name }}</strong>
                                <button @click="counterStart(g)">start!</button>
                            </summary>
                            <div>
                                <a @click="groupRemove(g)">&times; Remove</a>
                                <a @click="groupEdit(g)">&hellip; Edit</a>
                            </div>
                        </details>
                        <ul>
                            <li v-for="(item, i) in group.elements">

                                <i class="material-icons">event</i>
                                {{ item.start | startTime }}

                                <i class="material-icons">alarm</i>
                                {{ item.end | endTime(item.start) }}

                                &rarr; <strong>{{ item.count }}</strong>

                                <button @click="itemEdit(g, i)"><i class="material-icons">edit</i> Edit</button>
                                <button @click="itemRemove(g, i)"><i class="material-icons">delete</i> Remove</button>
                            </li>
                        </ul>
                    </li>
                </ul>
                <button @click="groupNew()">New Counter</button>
                <hr />
                <pre>{{ dbjson }}</pre>
                -->

            </section>
            <section v-show="counter.start">
                <div class="counter-count" @click="counterIncrease()">
                    {{ counter.count }}
                </div>
                <div class="counter-buttons">
                    <button @click="counterStop()"><i class="material-icons">save</i> &nbsp; Stop &amp; Save</button>
                    <hr>
                    <button @click="counterIncrease()"><i class="material-icons">add</i></button>
                    <button @click="counterDecrease()"><i class="material-icons">remove</i></button>
                    <button @click="counterReset()"><i class="material-icons">close</i></button>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
import tinytime from 'tinytime';
import { version, build } from "../../version.json";

const placeholderData = [
    {
        "name" : "Diamond Push-Ups",
        "elements" : [
            {"count": 14, "start": 1589996663864, "end": 1589996675936 },
            {"count": 11, "start": 1589996880494, "end": 1589996886459 }
        ]
    },{
        "name" : "Knee Push-Ups",
        "elements" : [
            {"count": 22, "start": 1590159047784, "end": 1590159054556 },
            {"count": 36, "start": 1590159102971, "end": 1590159114492 }
        ]
    }
];

const App = {
    data() {
        return {
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
            db : JSON.parse(localStorage.getItem('counter-app-items')) || placeholderData,
            dbURL : '#db'
        };
    },
    name: "App",
    filters : {

        startTime(value) {
            let _timestamp = tinytime('{YYYY}.{Mo}.{DD}@{H}:{mm}', { padMonth: true });
            return _timestamp.render( new Date(value) );
        },
        endTime(value, start) {
            let _timestamp = tinytime('{mm}m{ss}s');
            return _timestamp.render( new Date(value - start) );
        }

    },

    computed : {

        dbjson : function() {

            let _output = [];
            let _db = this.db;
                _db.forEach( function(g, i) {

                    let _items = [];
                    g.elements.forEach( function(el, j) {

                        let _date = tinytime('{YYYY}-{Mo}-{DD}', { padMonth: true }).render( new Date(el.start) );
                        let _el = {
                            'count' : el.count,
                            'start' : tinytime('{h}:{mm} {a}').render( new Date(el.start) ),
                            'duration' : tinytime('{mm}:{ss}s').render( new Date(el.end - el.start) ),
                            'id' : j
                        }

                        if ( _items.filter(function(a){ return a.date == _date }).length === 0 ) {

                            _items.push({ "date" : _date, "total" : el.count, "items" : [ _el ] })

                        } else {

                            let _existingItem = _items.filter(function(a){ return a.date == _date })[0];
                                _existingItem.total = parseInt(_existingItem.total) + parseInt(el.count);
                                _existingItem.items.push(_el)
                        }

                    });


                    // _items.forEach((item, i) => {
                    //     item.items = [...item.items.reverse()];
                    // });

                    _output.push([..._items].reverse());
                });

            return _output;
        }
    },

    methods: {

        changeView : function(path) {

            console.log(path);

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

        // Counter
        counterStart : function(id) {
            this.currentCounter = id;
            this.counter.start = Date.now();
        },
        counterIncrease : function() {
            this.counter.count++;
        },
        counterDecrease : function() {
            this.counter.count--;
            this.counter.count = (this.counter.count < 0) ? 0 : this.counter.count;
        },
        counterStop : function() {
            this.counter.end = Date.now();
            this.db[this.currentCounter].elements.push(this.counter);
            this.counterReset();
            this.dbSave();
        },
        counterReset : function() {
            this.counter = {
                count : 0,
                start : false,
                end: false
            }
        },

        // DB
        dbSave : function() {
            localStorage.setItem('counter-app-items', JSON.stringify(this.db));
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
        },

        // Items
        itemEdit : function(group, id) {
            let _number = window.prompt('Count', this.db[group].elements[id].count );
            if ( !isNaN(_number) ) {
                this.db[group].elements[id].count = _number;
                this.dbSave();
            }
        },
        itemRemove : function(group, id) {
            this.db[group].elements.splice(id, 1);
            this.dbSave();
        },

        // Groups
        groupNew : function() {
            let _timestamp = tinytime('{YYYY}.{Mo}.{DD}', { padMonth: true });
            let _group = window.prompt('Name of the new counter', _timestamp.render( new Date() ) + ' Counter' );
            this.db.push({
                "name" : _group,
                "elements" : []
            });
            this.dbSave();
        },
        groupEdit : function(group) {
            let _name = window.prompt('Name of the counter', this.db[group].name );
            this.db[group].name = _name;
            this.dbSave();
        },
        groupRemove : function(group) {
            if (window.confirm("Do you really want to remove the counter?")) {
                this.db.splice(group, 1)
            }
            this.dbSave();
        }
    },
    created() {
        this.changeView('/');
    }
};

export default App;
</script>

<style lang="scss">

$colorBg : #f7f7f7;
$colorFg : #303030;
$colorAlpha : #20325e;
$colorBeta : #23466a;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

html, body, h1, h2, h3, h4, p, dl, dt, dd, ul, li {
    margin: 0;
    padding: 0;
}
li { list-style-type: none; }
article, footer, header, main, section {
	display: block;
}
button {
    font: inherit;
	color: inherit;
	margin: 0;
    padding: 0;
    text-transform: none;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

html {
    line-height: 1;
	text-size-adjust: 100%;
	box-sizing: border-box;
	font-size: 62.5%;
	word-break: break-word;
    cursor: default;
}
body {
    font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", "Droid Sans", "Helvetica Neue", Arial, sans-serif;
    font-size: 1.4em;
    font-weight: 400;
    line-height: 1.6;
    background: $colorBg;
    color: $colorFg;
}
html, body {}
*, *:before, *:after {
	box-sizing: inherit;
	background-repeat: no-repeat;
}
a {
    color: $colorAlpha;
    text-decoration: underline;
    cursor: pointer;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

header {
    padding: 1rem;
    color: $colorBg;
    background: $colorAlpha;

    > div {
        max-width: 64rem;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1rem;
    }

    h1 {
      font-weight: 400;
    }
    a {
        color: $colorBg;
    }
}
main {
    max-width: 64rem;
    margin: 0 auto;
    padding: 1rem;
}

button {
    background: $colorBeta;
    color: $colorBg;
    border: none;
    padding: .5rem 1.5rem;
    margin: 0;
    border-radius: .3rem;
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    justify-content: space-between;

    .material-icons {
        font-size: 14px;
    }
}


.counter-count {
    font-size: 12.8rem;
    user-select: none;
    cursor: pointer;
    text-align: center;
}
.counter-buttons {
    text-align: center;
}


dt {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
}
dd {
    margin: 0 0 2rem 0;
}
details {
    :active {
        outline: none;
    }
    > summary {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-bottom: solid #ccc 1px;
        padding: .5rem;

        strong {
            flex: 1 1 auto;
            text-align: right;
        }
    }
    > ul {
        padding: 0 .5rem 0 2rem;

        > li {
            color: #999;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            em {
                flex: 1 1 auto;
                text-align: right;
                font-style: normal;
            }
        }
    }
}


</style>
