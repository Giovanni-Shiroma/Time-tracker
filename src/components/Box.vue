<template>
    <div class="box has-text-weight-bold" :style="estilos">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
    name: 'BoxTarefas',
    data() {
        return {
            estilos: {
                background: '#FED674'
            }
        }
    }
})
</script>


<style scoped>
/* .box {
    background: #FED674;
} */
</style>