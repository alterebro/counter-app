<template lang="html">
    <header>
        <div>
            <h1>{{ appName }}</h1>
            <a v-show="currentView.app" href="#" @click.prevent="changeView('/settings')"><i class="icon icon-menu">Menu</i></a>
            <a v-show="!currentView.app" href="#" @click.prevent="changeView('/')"><i class="icon icon-arrow-back">Back</i></a>
        </div>
    </header>
</template>

<script>
import { Data } from './Store.js';
export default {
    data() { return Data },
    name : 'Header',
    methods : {
        changeView : function(path) {
            this.switchView(path);
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./../scss/_variables.scss";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

header {
    padding: 1rem .5rem;
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
      font-size: 2.4rem;
    }
    a {
        color: $colorBg;

    }
}
</style>
