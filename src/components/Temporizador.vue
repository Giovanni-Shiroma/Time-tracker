<template>
    <div class="is-flex is-align-items-center is-justify-content-space-between">
        <Cronometro :tempoEmSegundos="tempoEmSegundos" />
        <button class="button" @click="iniciar" :disabled="cronometroRodando">
            <span class="icon">
                <i class="fas fa-play"></i>
            </span>
            <span>play</span>
        </button>
        <button class="button" @click="finalizar" :disabled="!cronometroRodando">
            <span class="icon">
                <i class="fas fa-stop"></i>
            </span>
            <span>stop</span>
        </button>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import Cronometro from './Cronometro.vue'
import { TipoNotificacao } from '@/interfaces/INotificacao';
import { useStore } from 'vuex';
import { key } from '@/store';
import { notificacaoMixin } from '@/mixins/notificar';

export default defineComponent({
    name: 'TimeTracker',
    emits: ['aoTemporizadorFinalizado'],
    components: {
        Cronometro
    },
    props: {
        idProjeto: {
            type: String,
            required: false,
        }
    },
    mixins: [notificacaoMixin],
    data() {
        return {
            tempoEmSegundos: 0,
            cronometro: 0,
            cronometroRodando: false,
        }
    },
    methods: {
        iniciar() {
            const projeto = this.projetos.find((p) => p.id == this.idProjeto);
            if (!projeto) {
                this.notificar(TipoNotificacao.ATENCAO, 'OPS!', 'Selecione um projeto antes de finalizar a tarefa!')
                return;
            }

            // começar a contagem
            // 1seg = 100ms
            this.cronometroRodando = true
            this.cronometro = setInterval(() => {
                this.tempoEmSegundos += 1
            }, 1000)
        },
        finalizar() {
            this.cronometroRodando = false
            clearInterval(this.cronometro)
            this.$emit('aoTemporizadorFinalizado', this.tempoEmSegundos)
            this.tempoEmSegundos = 0
        }
    },
    setup() {
        const store = useStore(key);

        return {
            projetos: computed(() => store.state.projetos),
            store
        }
    }
});

</script>
