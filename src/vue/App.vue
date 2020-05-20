<template>
    <div class="app">
        <header>
            <h1>{{ appName }}</h1>
        </header>
        <main>
            <section v-show="!counter.start">
                <ul>
                    <li v-for="(item, i) in items">{{ item.count }} - {{ item.start }} - {{ item.end }} <button @click="itemRemove(i)">remove</button> </li>
                </ul>
                <button @click="counterStart()">start!</button>
            </section>
            <section v-show="counter.start">
                <button @click="counterIncrease()">{{ counter.count }}</button>
                <button @click="counterStop()">Stop &amp; Save</button>
                <button @click="counterReset()">Cancel</button>
            </section>
            <section v-show="view.settings">
                <h2>Settings</h2>
                <ul>
                    <li>Export data / Save DB</li>
                    <li>Import DB</li>
                </ul>
            </section>
        </main>
        <footer>
            <hr />
            <p>{{ appName }} v{{ appVersion }} by <a href="https://twitter.com/alterebro">@alterebro</a></p>
        </footer>
    </div>
</template>

<script>
const App = {
    data() {
        return {
            appName: 'Counter App',
            appVersion : '0.0.1',
            view: {
                settings : false
            },

            counter : {
                count : 0,
                start : false,
                end: false
            },
            items : JSON.parse(localStorage.getItem('counter-app-items')) || []
        };
    },
    name: "App",
    filters : {

    },
    methods: {
        // Counter
        counterStart : function() {
            this.counter.start = Date.now();
        },
        counterIncrease : function() {
            this.counter.count++;
        },
        counterStop : function() {
            this.counter.end = Date.now();
            this.items.push(this.counter);
            this.counterReset();
            this.counterSave();
        },
        counterSave : function() {
            localStorage.setItem('counter-app-items', JSON.stringify(this.items));
        },
        counterReset : function() {
            this.counter = {
                count : 0,
                start : false,
                end: false
            }
        },

        // Items
        itemRemove : function(id) {
            this.items.splice(id, 1);
        }
    },
    created() {}
};

export default App;
</script>

<style lang="scss">

$colorBg : #f7f7f7;
$colorFg : #303030;
$colorAlpha : #0062ee;
$colorBeta : #03dac6;

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
}

main {
    padding: 1rem;
}

footer {
    padding: 1rem;
}

</style>
