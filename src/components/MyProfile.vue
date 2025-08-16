<template>
    <div>
        <div class="register-div">
            <form class="box register-box" @submit.prevent="handleUpdateUser">
                <div class="title-register">
                    <span class="title">Editar meu perfil</span>
                </div>

                <!-- Nome -->
                <div class="field focus-wrapper">
                    <label class="label">Nome</label>
                    <p class="control has-icons-left">
                        <input v-model="userName" class="input" type="text" placeholder="Seu nome" />
                        <span class="icon is-small is-left">
                            <i class="fas fa-user"></i>
                        </span>
                    </p>
                </div>

                <!-- Email -->
                <div class="field focus-wrapper">
                    <label class="label">Email</label>
                    <p class="control has-icons-left has-icons-right">
                        <input v-model="userEmail" class="input" type="email" placeholder="Email" readonly />
                        <span class="icon is-small is-left">
                            <i class="fas fa-envelope"></i>
                        </span>
                        <span class="icon is-small is-right">
                            <i class="fas fa-lock"></i>
                        </span>
                    </p>
                </div>

                <div class="w-100 is-flex is-justify-content-flex-end">
                    <button class="button is-primary" type="submit" :disabled="saving">
                        {{ saving ? 'Salvando...' : 'Salvar' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent, onMounted, ref } from 'vue';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { auth } from '@/services/firebaseconfig';
import useNotificador from '@/hooks/notificador'
import { TipoNotificacao } from '@/interfaces/INotificacao'

export default defineComponent({
    name: 'RegisterBox',
    setup() {
        const userName = ref<string>('');
        const userEmail = ref<string>('');

        const saving = ref(false);
        const error = ref<string>('');
        const success = ref<string>('');

        const { notificar } = useNotificador();


        async function handleUpdateUser() {
            try {
                error.value = '';
                success.value = '';
                saving.value = true;

                const user = auth.currentUser;
                if (!user) throw new Error('Nenhum usuário logado.');

                const newName = (userName.value ?? '').trim();
                if (!newName) throw new Error('Informe um nome válido.');

                await updateProfile(user, { displayName: newName });
                // Opcional: recarrega dados do usuário para refletir imediatamente
                await user.reload();

                notificar(TipoNotificacao.SUCESSO, 'Excelente!', 'Nome de usuário atualizado com sucesso!');

                success.value = 'Nome de usuário atualizado com sucesso!';
            } catch (err: any) {
                notificar(TipoNotificacao.FALHA, 'OPS!', err?.message || 'Erro ao atualizar nome de usuário.');
            } finally {
                saving.value = false;
                window.location.reload();
            }
        }

        onMounted(() => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    userEmail.value = user.email ?? '';
                    userName.value = user.displayName ?? '';
                } else {
                    userEmail.value = '';
                    userName.value = '';
                }
            });
        });

        return {
            userEmail,
            userName,
            error,
            success,
            saving,
            handleUpdateUser,
        };
    },
});
</script>

<style scoped>
.register-div {
    width: 500px;
    margin: auto;
}

.register-box {
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    border-radius: 12px;
}

.title-register {
    width: 100%;
    text-align: center;
    margin-bottom: 15px;
}

.input {
    background: #2e4a62;
    border: none;
    color: #ffffff;
}

.focus-wrapper:focus-within .icon {
    color: #dbdbdb !important;
}

input::placeholder {
    color: #acaaaa;
}

.button {
    background: transparent;
    color: #000000;
    border: 2px solid #fed674;
}

.button:hover {
    background: #fed674;
    color: #fff;
}

.button:focus {
    border: 2px solid #fed674;
    color: #000000;
    box-shadow: none !important;
}

.has-text-danger {
    color: #ff3860;
}

.link {
    color: #000000;
    padding-bottom: 2px;
    text-decoration: underline;
}

.link:hover {
    color: #FAF0CA;
}

.button:focus {
    background: #FED674;
    color: #FFF;
}


.button:disabled {
    background: #FED674;
    color: #FFF;
}

@media (max-width: 768px) {
    .register-div {
        width: 100vw;
    }

    .register-box {
        border: none;
        box-shadow: none;
        background: none;
        padding: 3rem;
    }

    .title-login {
        font-size: 1.2rem;
    }
}
</style>
