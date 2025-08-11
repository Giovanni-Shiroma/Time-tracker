<template>
    <div>
        <div class="login-div">
            <form class="box login-box" @submit.prevent="handleLogin">
                <div class="title-login">
                    <span class="title">Login</span>
                </div>
                <div class="field focus-wrapper">
                    <label class="label">Email</label>
                    <p class="control has-icons-left">
                        <input v-model="email" class="input" type="email" placeholder="Email" />
                        <span class="icon is-small is-left">
                            <i class="fas fa-envelope"></i>
                        </span>
                    </p>
                </div>

                <div class="field focus-wrapper">
                    <label class="label">Password</label>
                    <p class="control has-icons-left has-icons-right">
                        <input v-model="password" class="input" :type="showPassword ? 'text' : 'password'"
                            placeholder="********" />
                        <span class="icon is-small is-left">
                            <i class="fas fa-lock"></i>
                        </span>
                        <span @click="togglePassword" class="icon is-small is-right"
                            :style="'cursor: pointer; pointer-events: auto !important;'">
                            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                        </span>
                    </p>
                </div>
                <div class="is-flex is-align-items-center is-justify-content-space-between">
                    <small>
                        <router-link to="/login/recover" class="link">Esqueceu a senha?</router-link>
                    </small>

                    <div class="w-100 is-flex is-justify-content-flex-end">
                        <button class="button is-primary" :class="load ? 'is-loading' : ''">Sign in</button>
                    </div>
                </div>
            </form>

            <div class="w-100 is-flex is-justify-content-center">
                <small>
                    Não tem uma conta? <router-link to="/login/register" class="link">Criar uma conta</router-link>
                </small>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { auth } from '@/services/firebaseconfig';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import useNotificador from '@/hooks/notificador'
import { TipoNotificacao } from '@/interfaces/INotificacao'

export default defineComponent({
    name: 'LoginBox',
    setup() {
        const email = ref('');
        const password = ref('');
        const error = ref('');
        const router = useRouter();
        const showPassword = ref(false);
        const load = ref(false);
        const { notificar } = useNotificador();

        function togglePassword() {
            showPassword.value = !showPassword.value
        }

        const handleLogin = async () => {
            error.value = '';

            if (!email.value || !password.value) {
                notificar(TipoNotificacao.FALHA, 'Ops!', 'Preencha todos os campos.');
                return;
            }

            try {
                load.value = true;
                await signInWithEmailAndPassword(auth, email.value, password.value);
                router.push('/');
            } catch (err: unknown) {
                console.error(err);
                if (err instanceof FirebaseError) {
                    load.value = false;
                    switch (err.code) {
                        case 'auth/user-not-found':
                            notificar(TipoNotificacao.FALHA, 'Ops!', 'Usuário não encontrado.');
                            break;
                        case 'auth/wrong-password':
                            notificar(TipoNotificacao.FALHA, 'Ops!', 'Senha incorreta.');
                            break;
                        case 'auth/invalid-email':
                            notificar(TipoNotificacao.FALHA, 'Ops!', 'Email inválido.');
                            break;
                        case 'auth/invalid-credential':
                            notificar(TipoNotificacao.FALHA, 'Ops!', 'Credencial inválida.');
                            break;
                        default:
                            notificar(TipoNotificacao.FALHA, 'Ops!', 'Erro inesperado.');
                    }
                } else {
                    load.value = false;
                    error.value = 'Erro desconhecido';
                }
            }
        };

        return {
            email,
            password,
            error,
            showPassword,
            handleLogin,
            togglePassword,
            load,
        };
    },
})

</script>

<style scoped>
.login-div {
    width: 500px;
}

.login-box {
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    border-radius: 12px;
}

.title-login {
    width: 100%;
    text-align: center;
    margin-bottom: 15px;
}

.input {
    background: #2E4A62;
    border: none;
    color: #FFFFFF;
}

input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #2E4A62 inset !important;
    -webkit-text-fill-color: white !important;
    transition: background-color 5000s ease-in-out 0s;
}

input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px #2E4A62 inset !important;
    -webkit-text-fill-color: white !important;
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
    border: 2px solid #FED674;
}

.button:hover {
    background: #FED674;
    color: #FFF;
}

.button:focus {
    border: 2px solid #FED674;
    color: #000000;
    box-shadow: none !important;
}

.link {
    color: #000000;
    padding-bottom: 2px;
    text-decoration: underline;
}

.link:hover {
    color: #FAF0CA;
}
</style>