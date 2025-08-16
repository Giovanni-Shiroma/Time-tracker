<template>
    <section>
        <form class="form-project" @submit.prevent="salvar">
            <div class="field">
                <label for="nomeDoProjeto" class="label">
                    Nome do projeto
                </label>
                <input type="text" class="input" v-model="nomeDoProjeto" id="nomedoProjet" />
            </div>
            <div class="field is-flex is-justify-content-flex-end">
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
import { defineComponent, ref } from 'vue';
import useNotificador from '@/hooks/notificador'
import { ALTERAR_PROJETOS, CADASTRAR_PROJETOS } from '@/store/tipo-acoes';
import { useRouter } from 'vue-router';

export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Projetos',
    props: {
        id: {
            type: String,
        }
    },
    setup(props) {
        const router = useRouter()

        const store = useStore()
        const { notificar } = useNotificador()

        const nomeDoProjeto = ref("");

        if (props.id) {
            const projeto = store.state.projeto.projetos.find(
                proj => proj.id == props.id
            );
            nomeDoProjeto.value = projeto?.name || '';
        }

        const lidarComSucesso = () => {
            nomeDoProjeto.value = '';
            notificar(TipoNotificacao.SUCESSO, 'Excelente!', 'O projeto foi cadastrado com sucesso!');
            router.push('/projetos');
        }

        const salvar = () => {
            if (nomeDoProjeto.value !== '') {
                if (props.id) {
                    store.dispatch(ALTERAR_PROJETOS, {
                        id: props.id,
                        name: nomeDoProjeto.value,
                    })
                        .then(() => lidarComSucesso());
                } else {
                    store.dispatch(CADASTRAR_PROJETOS, nomeDoProjeto.value)
                        .then(() => lidarComSucesso())
                }
            } else {
                notificar(TipoNotificacao.FALHA, 'Ops!', 'O seu projeto precisa de um nome!');
                return;
            }
        }

        return {
            nomeDoProjeto,
            salvar
        }
    }
})
</script>

<style scoped>
.field .label {
    color: var(--texto-primario);
}

@media (max-width: 500px) {
    .form-project {
        min-height: 22vh;
    }
}
</style>