<template>
    <Box class="is-flex is-align-items-center">
        <div class="columns clicavel" @click="tarefaClicada">
            <div class="column is-4">
                {{ tarefa?.descricao || 'Tarefa sem descrição' }}
            </div>
            <div class="column is-3">
                {{ tarefa.projeto?.name || 'N/D' }}
            </div>
            <div class="column is-4 cronometro">
                <Cronometro :tempoEmSegundos="tarefa.duracaoEmSegundos" />
            </div>
        </div>
        <div class="mr-4 is-hidden-tablet">
            <Cronometro :tempoEmSegundos="tarefa.duracaoEmSegundos" />
        </div>
        <button class="button ml-2 is-danger" @click="deletarTarefa(tarefa.id)">
            <span class="icon is-small">
                <i class=" fas fa-trash"></i>
            </span>
        </button>
    </Box>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Cronometro from './Cronometro.vue';
import ITarefa from '../interfaces/ITarefas';
import Box from './Box.vue';
import { useStore } from '@/store';

export default defineComponent({
    name: "TarefasList",
    emits: ['aoTarefaClicada'],
    components: {
        Cronometro,
        Box
    },
    props: {
        tarefa: {
            type: Object as PropType<ITarefa>,
            required: true
        }
    },

    setup(props, { emit }) {
        const store = useStore()

        const tarefaClicada = (): void => {
            emit('aoTarefaClicada', props.tarefa)
        }

        async function deletarTarefa(id: string) {
            if (id) {
                await store.dispatch('DELETAR_TAREFA', id);
            } else {
                console.error('Tarefa sem ID, não é possível deletar.');
            }
        }
        return {
            tarefaClicada,
            deletarTarefa,
        }
    },
})
</script>

<style scoped>
.clicavel {
    cursor: pointer;
    width: 100%;
    margin-bottom: 0px;
    margin-top: 0;
}

@media (max-width: 768px) {
    .clicavel {
        display: flex;
    }
}


@media (max-width: 768px) {
    .clicavel {
        display: initial;
    }

    .cronometro {
        display: none;
    }
}
</style>