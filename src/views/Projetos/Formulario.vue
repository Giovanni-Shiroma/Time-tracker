<template>
    <section>
        <form @submit.prevent="salvar">
            <div class="field">
                <label for="nomeDoProjeto" class="label">
                    Nome do projeto
                </label>
                <input type="text" class="input" v-model="nomeDoProjeto" id="nomedoProjet" />
            </div>
            <div class="field">
                <button class="button" type="submit">
                    Salvar
                </button>
            </div>
        </form>
    </section>
</template>

<script lang="ts">
import { TipoNotificacao } from '@/interfaces/INotificacao';
import { useStore } from '@/store';
import { ADICIONA_PROJETO, ALTERA_PROJETO } from '@/store/tipo-mutacoes';
import { defineComponent } from 'vue';
import useNotificador from '@/hooks/notificador'

export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Projetos',
    props: {
        id: {
            type: String,
        }
    },
    mounted() {
        if (this.id) {
            console.log('teste')
            const projeto = this.store.state.projetos.find(proj => proj.id == this.id)
            this.nomeDoProjeto = projeto?.name || ''
        }
    },
    data() {
        return {
            nomeDoProjeto: '',
        }
    },
    methods: {
        salvar() {
            if (this.nomeDoProjeto !== '') {
                if (this.id) {
                    this.store.commit(ALTERA_PROJETO, {
                        id: this.id,
                        name: this.nomeDoProjeto,
                    });
                } else {
                    this.store.commit(ADICIONA_PROJETO, this.nomeDoProjeto);
                }
            } else {
                this.notificar(TipoNotificacao.FALHA, 'Ops!', 'O seu projeto precisa de um nome!');
                return;
            }
            this.nomeDoProjeto = '';
            this.notificar(TipoNotificacao.SUCESSO, 'Excelente!', 'O projeto foi cadastrado com sucesso!');
            this.$router.push('/projetos');
        },
    },
    setup() {
        const store = useStore()
        const { notificar } = useNotificador()
        return {
            store,
            notificar
        }
    }
})
</script>

<style scoped>
.field .label {
    color: var(--texto-primario);
}
</style>