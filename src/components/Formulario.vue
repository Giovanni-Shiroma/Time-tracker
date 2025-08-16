<template>
    <div class="box formulario">
        <div class="columns">
            <div class="column is-5" role="form" aria-label="Formulário para criação de uma nova trafea">
                <input type="text" class="input" placeholder="Dê um nome para a sua tarefa" v-model="descricao" />
            </div>
            <div class="is-flex project-timer is-justify-content-space-between">
                <div class="column is-5">
                    <div class="select">
                        <select v-model="idProjeto">
                            <option value="">Selecione o projeto</option>
                            <option :value="projeto.id" v-for="projeto in projetos" :key="projeto.id">
                                {{ projeto.name }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="column">
                    <Temporizador @aoTemporizadorFinalizado="finalizarTarefa" :idProjeto="idProjeto"
                        :descricaoTarefa="descricao" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import Temporizador from './Temporizador.vue'
import { useStore } from 'vuex';
import { key } from '@/store';

export default defineComponent({
    name: 'FormBox',
    emits: ['aoSalvarTarefa'],
    components: {
        Temporizador
    },
    setup(props, { emit }) {
        const store = useStore(key);

        const descricao = ref("")
        const idProjeto = ref("")

        const projetos = computed(() => store.state.projeto.projetos)

        const finalizarTarefa = (tempoDecorrido: number): void => {
            emit('aoSalvarTarefa', {
                duracaoEmSegundos: tempoDecorrido,
                descricao: descricao.value,
                projeto: projetos.value.find(proj => proj.id === idProjeto.value),
            })
            descricao.value = ''
        }

        return {
            descricao,
            idProjeto,
            projetos,
            finalizarTarefa,
            store
        }
    }
});
</script>

<style scoped>
.formulario {
    color: var(--texto-primario);
    background-color: var(--bg-primario);
}

.project-timer {
    width: 100%;
}

@media (max-width: 525px) {
    .project-timer {
        flex-direction: column;
        align-items: center;
    }
}
</style>