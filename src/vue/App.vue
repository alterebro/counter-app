<template>
    <div class="app">
        <h1>{{ message }}</h1>
    </div>
</template>

<script>
const App = {
    data() {
        return {
            message: 'Counter App',
        };
    },
    name: "App",
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
