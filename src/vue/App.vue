<template>
    <div class="app">
        <pre>{{ counter.start }}
{{ counter.end }}</pre>

        <div v-show="!counter.start">
            <ul>
                <li v-for="item in items">{{ item.count }} - {{ item.start }} - {{ item.end }}</li>
            </ul>
            <button @click="counterStart()">start!</button>
        </div>

        <div v-show="counter.start">

            <button @click="counterIncrease()">{{ counter.count }}</button>
            <button @click="counterStop()">Stop &amp; Save</button>
            <button @click="counterReset()">Cancel</button>

        </div>

    </div>
</template>

<script>
const App = {
    data() {
        return {
            appName: 'Counter App',

            counter : {
                count : 0,
                start : false,
                end: false
            },
            items : JSON.parse(localStorage.getItem('counter-app-items')) || []
        };
    },
    name: "App",
    methods: {

        counterStart : function() {
            console.log('start!');
            this.counter.start = Date.now();
        },
        counterIncrease : function() {
            this.counter.count++;
            console.log('increase!');
        },
        counterStop : function() {
            console.log('stop and save!');
            this.counter.end = Date.now();
            this.items.push(this.counter);
            this.counterReset();
            this.counterSave();
        },
        counterSave : function() {
            console.log( JSON.stringify(this.items) );
            localStorage.setItem('counter-app-items', JSON.stringify(this.items));
        },
        counterReset : function() {
            this.counter = {
                count : 0,
                start : false,
                end: false
            }
        },

    },
    created() {}
};

export default App;
</script>

<style lang="scss">
$primary-color: white;
$bg: black;

html, body {
    margin: 0;
    padding: 0;
}

h1 {
  color: $primary-color;
  background-color: $bg;
  margin: 0;
}
</style>
