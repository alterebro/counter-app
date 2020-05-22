<template>
    <div class="app">
        <header>
            <h1 @click="changeView('/')">{{ appName }}</a></h1>
            <button @click="changeView('/settings')">&equiv;</button>
        </header>

        <main v-show="currentView.settings">
            <section>
                <h2>Settings</h2>
                <h3>{{ appName }} v{{ appVersion }}</h3>
                <ul>
                    <li><a :href="dbURL" download="db.txt" @click="dbExport()">Export data / Save DB</a></li>
                    <li><input type="file" @change="dbImport" accept=".txt">Import DB</li>
                </ul>
                <hr />
                <p>{{ appName }} v{{ appVersion }} by <a href="https://twitter.com/alterebro">@alterebro</a></p>
            </section>
        </main>

        <main v-show="currentView.app">
            <section v-show="!counter.start">
                <ul>
                    <li v-for="(group, g) in db">
                        <button @click="groupRemove(g)">&times;</button>
                        <button @click="groupEdit(g)">&hellip;</button>
                        <strong>{{ group.name }}</strong>
                        <button @click="counterStart(g)">start!</button>
                        <ul>
                            <li v-for="(item, i) in group.elements">
                                <button @click="itemRemove(g, i)">&times;</button>
                                <button @click="itemEdit(g, i)">&hellip;</button>
                                {{ item.start | startTime }} ({{ item.end | endTime(item.start) }}) &rarr; <strong>{{ item.count }}</strong>
                            </li>
                        </ul>
                    </li>
                </ul>
                <button @click="groupNew()">New Counter</button>
            </section>
            <section v-show="counter.start">
                <div class="counter-count" @click="counterIncrease()">
                    {{ counter.count }}
                </div>
                <button @click="counterIncrease()">+</button>
                <button @click="counterDecrease()">-</button>
                <button @click="counterStop()">Stop &amp; Save</button>
                <button @click="counterReset()">Cancel</button>
            </section>
        </main>
    </div>
</template>

<script>
import tinytime from 'tinytime';

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
            appVersion : '0.0.1',

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

html, body, h1, h2, h3, h4, p, ul, li {
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
    font-size: 1.3em;
    font-weight: 400;
    line-height: 1.6;
    background: $colorBg;
    color: $colorFg;
}
html, body {
    height: 100%;
    min-height: 100%;
    overflow: hidden;
}
*, *:before, *:after {
	box-sizing: inherit;
	background-repeat: no-repeat;
}
a {
    color: $colorAlpha;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

header {
    padding: 1rem;
    color: $colorBg;
    background: $colorAlpha;

    h1 {
      font-weight: 400;
    }

    a {
        color: $colorBg;
    }
}
main {
    padding: 1rem;
}

button {
    background: $colorBeta;
    color: $colorBg;
    border: none;
    padding: .5rem 1rem;
    margin: .2rem;
    border-radius: .3rem;
    cursor: pointer;
}


.counter-count {
    font-size: 9.6rem;
    user-select: none;
    cursor: pointer;
}

</style>
