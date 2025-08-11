<template>
    <div class="profile">
        <MyProfile></MyProfile>
    </div>
</template>

<script lang="ts">

import MyProfile from '@/components/MyProfile.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Profile',
    components: {
        MyProfile
    },
})

</script>

<style scoped>
.profile {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    padding: 1.25rem;
}

.title {
    color: var(--texto-primario) !important;
}
</style>