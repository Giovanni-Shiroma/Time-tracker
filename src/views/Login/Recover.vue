<template>
    <div class="recover">
        <div class="box-content">
            <RecoverPassword></RecoverPassword>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import RecoverPassword from '@/components/RecoverPassword.vue';

export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'recover',
    components: {
        RecoverPassword
    },
})

</script>

<style scoped>
.recover {
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