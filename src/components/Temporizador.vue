<template>
    <div class="is-flex is-align-items-center is-justify-content-end">
        <Cronometro :tempoEmSegundos="tempoEmSegundos" />
        <button class="button ml-4" @click="alternar">
            <span class="icon">
                <i :class="cronometroRodando ? 'fas fa-stop' : 'fas fa-play'"></i>
            </span>
            <span>{{ cronometroRodando ? 'stop' : 'start' }}</span>
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
        },
        descricaoTarefa: {
            type: String,
            required: true,
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
            // const projeto = this.projetos.find((p) => p.id == this.idProjeto);
            // if (!projeto) {
            //     this.notificar(TipoNotificacao.ATENCAO, 'OPS!', 'Selecione um projeto antes de finalizar a tarefa!')
            //     return;
            // }
            if (this.descricaoTarefa === '') {
                this.notificar(TipoNotificacao.ATENCAO, 'Ops!', 'De um nome para sua tarefa')
                return;
            }

            // começar a contagem
            // 1seg = 1000ms
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
        },
        alternar() {
            if (this.cronometroRodando) {
                this.finalizar();
            } else {
                this.iniciar();
            }
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
