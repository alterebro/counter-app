<template>
    <div class="app">

        <Header></Header>
        <main v-show="currentView.settings">
            <Settings></Settings>
        </main>

        <main v-show="currentView.app">
            <section v-show="!counter.start">

                <dl>
                    <template v-for="(group, g) in db">
                        <dt>
                            <span>
                                <a @click="groupRemove(g)"><i class="icon icon-delete">Remove</i></a>
                                <a @click="groupEdit(g)"><i class="icon icon-edit">Edit</i></a>
                            </span>

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
                                                <span>
                                                    <a href="#" @click="itemRemove(item.group, item.id)"><i class="icon icon-delete">Remove</i></a>
                                                    <a href="#" @click="itemEdit(item.group, item.id)"><i class="icon icon-edit">Edit</i></a>
                                                    <strong>{{ item.start }}</strong> ({{ item.duration }})
                                                </span>
                                                <span>{{ item.count }}</span>
                                            </li>
                                        </ul>
                                    </details>
                                </li>
                            </ul>
                        </dd>
                    </template>
                </dl>

                <div class="new-group-button">
                    <button @click="groupNew()"><i class="icon icon-add">Add</i> &nbsp; New Counter</button>
                </div>

            </section>
            <section v-show="counter.start" class="counter-view">
                <div class="counter-count" @click="counterIncrease()">
                    {{ counter.count }}
                </div>
                <div class="counter-buttons">
                    <button @click="counterStop()"><i class="icon icon-save">Save</i> &nbsp; Stop &amp; Save</button>
                    <hr>
                    <button @click="counterIncrease()" title="Counter Increase"><i class="icon icon-add">Add</i></button>
                    <button @click="counterDecrease()" title="Counter Decrease"><i class="icon icon-remove">Remove</i></button>
                    <button @click="counterReset()" title="Cancel Counter and Close"><i class="icon icon-close">Close</i></button>
                </div>
            </section>
        </main>

    </div>
</template>

<script>
import tinytime from 'tinytime';
import { Data } from './Store.js';
import Header from './Header.vue';
import Settings from './Settings.vue';

const App = {
    data() {
        return Data;
    },
    name: "App",
    components: {
        Header,
        Settings
    },
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

                        let _date = tinytime('{YYYY}-{Mo}-{DD}', { padMonth: true, padDays: true }).render( new Date(el.start) );
                        let _el = {
                            'count' : el.count,
                            'start' : tinytime('{h}:{mm} {a}').render( new Date(el.start) ),
                            'duration' : tinytime('{mm}:{ss}s').render( new Date(el.end - el.start) ),
                            'id' : j,
                            'group' : i,
                        }

                        if ( _items.filter(function(a){ return a.date == _date }).length === 0 ) {

                            _items.push({ "date" : _date, "total" : el.count, "items" : [ _el ] })

                        } else {

                            let _existingItem = _items.filter(function(a){ return a.date == _date })[0];
                                _existingItem.total = parseInt(_existingItem.total) + parseInt(el.count);
                                _existingItem.items.push(_el)
                        }

                    });

                    // Reverse order inner items
                    _items.forEach((item, i) => { item.items = [...item.items.reverse()]; });

                    // Append'em in reverse order also...
                    _output.push([..._items].reverse());
                });

            return _output;
        }
    },

    methods: {

        changeView : function(path) {
            // Shared method
            this.switchView(path);
        },

        // Counter
        counterStart : function(id) {
            this.currentCounter = id;
            this.counter.start = Date.now();
            // this.noSleep.enable();
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
            // this.noSleep.disable();
        },

        // DB
        dbSave : function() {
            this.databaseSave(); // (Shared)
        },

        // Items
        itemEdit : function(group, id) {
            let _number = window.prompt('Count', this.db[group].elements[id].count );
            if ( !isNaN(_number) ) {
                this.db[group].elements[id].count = parseInt(_number);
                this.dbSave();
            }
        },
        itemRemove : function(group, id) {
            this.db[group].elements.splice(id, 1);
            this.dbSave();
        },

        // Groups
        groupNew : function() {
            let _timestamp = tinytime('{YYYY}.{Mo}.{DD}', { padMonth: true, padDays: true });
            let _group = window.prompt('Name of the new counter', _timestamp.render( new Date() ) + ' Counter' );
            if (!!_group) {
                this.db.push({
                    "name" : _group,
                    "elements" : []
                });
                this.dbSave();
            }
        },
        groupEdit : function(group) {
            let _name = window.prompt('Name of the counter', this.db[group].name );
            if (!!_name) {
                this.db[group].name = _name;
                this.dbSave();
            }
        },
        groupRemove : function(group) {
            if (window.confirm("Do you really want to remove the counter?")) {
                this.db.splice(group, 1)
                this.dbSave();
            }
        }
    },
    created() {
        this.changeView('/');

        if ('serviceWorker' in navigator) {
            let swPath = `service-worker.js`;
            navigator.serviceWorker.register(swPath).then(
                (registration) => { console.log('ServiceWorker registration successful with scope: ', registration.scope); },
                (err) => { console.log('ServiceWorker registration failed: ', err); }
            );
        }
    }
};

export default App;
</script>

<style lang="scss">
@import "./../scss/_variables.scss";

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

html, body {
    height: 100%;
    min-height: 100%;
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
}
hr {
    height: 0;
    margin: 1rem 0;
    border: none;
    border-top: solid lighten($colorFg, 60%) 1px;
}
details summary {
    outline: none;
    cursor: pointer;
}


// ~~~~~~~~~~~~~~~~~~~
// UI Layout
.app {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: 100%;
    min-height: 100%;

    header {
        width: 100%;
        flex: 0;
    }
    main {
        height: 100%;
        width: 100%;
        flex: 1;
        max-width: 64rem;
        margin: 0 auto;
        padding: .5rem 1.5rem;
    }
}

// ~~~~~~~~~~~~~~~~~~~
// Counter View
.counter-view {
    height: 100%;
    display: flex;
    flex-direction: column;

    .counter-count {
        flex: 1;
        font-size: 12.8rem;
        user-select: none;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1rem 0 0 0;
        border-radius: .5rem;

        &:active, &:focus {
            color: #fff;
            background: $colorAlpha;
        }
    }
    .counter-buttons {
        flex: 0;
        text-align: center;
        padding-top: 2rem;
        padding-bottom: .5rem;
    }
}

// ~~~~~~~~~~~~~~~~~~~
// Main List
dt {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;

    span { padding: 0 .5rem 0 0; }
    strong {
        flex: 1;
        text-align: left;
    }
}

dd {
    margin: 0 0 2rem 0;

    ul li {

        > details {

            > summary {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                border-bottom: solid lighten($colorFg, 60%) 1px;
                padding: .5rem;

                > strong {
                    flex: 1 1 auto;
                    text-align: right;
                }
            }
            > ul {

                padding: 0 0 0 2rem;

                > li {

                    color: lighten($colorFg, 30%);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: solid lighten($colorFg, 60%) 1px;
                    padding: .5rem .5rem .5rem 0;
                    vertical-align: baseline;
                }
            }
        }
    }
}

.new-group-button {
    display: flex;
    justify-content: flex-start;
    margin: 0 0 1rem;
    padding: 1rem 0;
}

// ~~~~~~~~~~~~~~~~~~~
// Icons
.icon {
    display: inline-block;
    overflow: hidden;
    mask-size: cover;
    -webkit-mask-size: cover;
    text-indent: -1000rem;
}
header .icon {
    width: 24px;
    height: 24px;
    background: #fff;
}
main dl dt span .icon {
    height: 18px;
    width: 18px;
    background: $colorAlpha;
    margin: 0 .5rem 0 0;
    position: relative;
    top: .25rem;
}
main dl dd ul li details ul li .icon {
    height: 18px;
    width: 18px;
    background: lighten($colorFg, 30%);
    margin: 0 .5rem 0 0;
    position: relative;
    top: .25rem;
}
button .icon {
    width: 14px;
    height: 14px;
    background: #fff;
}

.icon-menu {
    mask-image: url(./../images/menu.svg);
    -webkit-mask-image: url(./../images/menu.svg);
}
.icon-arrow-back {
    mask-image: url(./../images/arrow_back.svg);
    -webkit-mask-image: url(./../images/arrow_back.svg);
}
.icon-edit {
    mask-image: url(./../images/edit.svg);
    -webkit-mask-image: url(./../images/edit.svg);
}
.icon-delete {
    mask-image: url(./../images/delete.svg);
    -webkit-mask-image: url(./../images/delete.svg);
}
.icon-save {
    mask-image: url(./../images/save.svg);
    -webkit-mask-image: url(./../images/save.svg);
}
.icon-add {
    mask-image: url(./../images/add.svg);
    -webkit-mask-image: url(./../images/add.svg);
}
.icon-remove {
    mask-image: url(./../images/remove.svg);
    -webkit-mask-image: url(./../images/remove.svg);
}
.icon-close {
    mask-image: url(./../images/close.svg);
    -webkit-mask-image: url(./../images/close.svg);
}

</style>
