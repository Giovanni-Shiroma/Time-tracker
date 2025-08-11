<template>
    <div class="login">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'login',
})

</script>

<style scoped>
.projetos {
    padding: 1.25rem;
}

.title {
    color: var(--texto-primario) !important;
}
</style>