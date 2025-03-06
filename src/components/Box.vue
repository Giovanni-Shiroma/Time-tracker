<template>
    <div class="box has-text-weight-bold" :style="estilos">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import  {defineComponent} from "vue"

export default defineComponent({
    name: 'BoxTarefas',
    data () {
        return {
            estilos: {
                background: '#ffcd77'
            }
        }
    }
})
</script>


<style scoped>
    /* .box {
        background: #ffcd77;
    } */
</style>