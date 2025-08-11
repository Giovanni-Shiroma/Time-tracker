<template>
    <div class="register">
        <div class="box-content">
            <RegisterBox></RegisterBox>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import RegisterBox from '@/components/RegisterBox.vue';

export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'register',
    components: {
        RegisterBox
    },
})

</script>

<style scoped>
.register {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(#FED674, #2E4A62);
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