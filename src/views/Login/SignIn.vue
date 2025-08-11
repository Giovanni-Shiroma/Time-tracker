<template>
    <div class="login">
        <div class="box-content">
            <LoginBox></LoginBox>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import LoginBox from '../../components/LoginBox.vue';

export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'login',
    components: {
        LoginBox
    },
})

</script>

<style scoped>
.login {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(#2E4A62, #FED674);
}

.projetos {
    padding: 1.25rem;
}

.title {
    color: var(--texto-primario) !important;
}

.box-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
}
</style>