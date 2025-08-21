<template>
    <div class="is-flex is-align-items-center is-justify-content-end form-actions">
        <Cronometro class="timer" :tempoEmSegundos="contador" />

        <div class="is-flex">
            <!-- Start/Pause -->
            <button class="button ml-4" @click="alternar">
                <span class="icon">
                    <i :class="cronometroRodando ? 'fas fa-pause' : 'fas fa-play'"></i>
                </span>
                <span>{{ cronometroRodando ? 'pause' : 'start' }}</span>
            </button>

            <!-- Finalizar -->
            <button class="button ml-2 is-danger" @click="finalizar" :disabled="totalSegundos === 0">
                <span class="icon">
                    <i class="fas fa-stop"></i>
                </span>
                <span>finalizar</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import Cronometro from './Cronometro.vue';
import { TipoNotificacao } from '@/interfaces/INotificacao';
import { useStore } from 'vuex';
import { key } from '@/store';
import { notificacaoMixin } from '@/mixins/notificar';

export default defineComponent({
    name: 'TimeTracker',
    emits: ['aoTemporizadorFinalizado'],
    components: { Cronometro },
    props: {
        idProjeto: { type: String, required: false },
        descricaoTarefa: { type: String, required: true }
    },
    mixins: [notificacaoMixin],

    data() {
        return {
            // Exibição
            tempoEmSegundos: 0,

            // Fonte de verdade (resiste a throttling de aba em background)
            startedAtMs: null as number | null,
            acumuladoMs: 0,

            // Controle
            cronometro: 0,
            contador: 0,
            cronometroRodando: false,
            intervalId: null as number | null,
        };
    },

    computed: {
        totalMs(): number {
            return this.acumuladoMs + (this.startedAtMs ? (Date.now() - this.startedAtMs) : 0);
        },
        totalSegundos(): number {
            return Math.floor(this.totalMs / 1000);
        }
    },

    methods: {
        // Chamada periodicamente só para "pintar" a tela
        tick(status: boolean) {
            this.tempoEmSegundos = this.totalSegundos;
            if (status) {
                clearInterval(this.cronometro)
                this.contador = this.tempoEmSegundos
            }
        },

        iniciar() {
            if (!this.descricaoTarefa?.trim()) {
                this.notificar(TipoNotificacao.ATENCAO, 'Ops!', 'Dê um nome para sua tarefa');
                return;
            }
            if (this.cronometroRodando) return; // evita duplicar

            this.startedAtMs = Date.now();
            this.cronometroRodando = true;

            this.cronometro = setInterval(() => {
                this.contador += 1
            }, 1000)
            // Atualiza a UI a cada 1s; em background o timer pode atrasar,
            // mas ao voltar o tick recalcula pelo Date.now() e “salta” corretamente.
            this.intervalId = window.setInterval(() => {
                this.tick(false)
            }, 1000);

            this.tick(false); // atualização imediata
        },

        pausar() {
            if (!this.cronometroRodando || this.startedAtMs === null) return;

            this.tick(true); // sincroniza
            this.acumuladoMs += Date.now() - this.startedAtMs;
            this.startedAtMs = null;
            this.cronometroRodando = false;

            if (this.intervalId !== null) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
            this.tick(true);
        },

        finalizar() {
            // pode finalizar rodando ou pausado
            if (this.cronometroRodando) {
                this.tick(true);
                if (this.intervalId !== null) {
                    clearInterval(this.intervalId);
                    this.intervalId = null;
                }
                this.cronometroRodando = false;
            }

            const total = this.totalSegundos;
            this.$emit('aoTemporizadorFinalizado', total);

            // reset
            this.startedAtMs = null;
            this.acumuladoMs = 0;
            this.tempoEmSegundos = 0;
            this.tick(true);
        },

        alternar() {
            if (this.cronometroRodando) this.pausar();
            else this.iniciar();
        },

        handleVisibilityChange() {
            if (!document.hidden && this.cronometroRodando) {
                this.tick(true);
                this.pausar();
                this.iniciar();
            }
        }
    },

    watch: {

    },

    mounted() {
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
    },
    beforeUnmount() {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        if (this.intervalId !== null) clearInterval(this.intervalId);
    },

    setup() {
        const store = useStore(key);
        return {
            projetos: computed(() => store.state.projeto.projetos),
            store
        };
    }
});
</script>

<style scoped>
/* estilos opcionais */
@media (max-width: 375px) {
    .form-actions {
        flex-direction: column;
    }

    .timer {
        margin-bottom: 20px;
    }
}
</style>
