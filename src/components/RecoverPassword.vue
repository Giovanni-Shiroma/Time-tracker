<template>
    <div>
        <div class="login-div">
            <form class="box login-box" @submit.prevent="onSubmit">
                <div class="forgot-password">
                    <div class="title-login">
                        <span class="title">Esqueceu a senha</span>
                    </div>
                    <small>
                        Preencha seu e-mail cadastrado abaixo que enviaremos um link para recuperação da senha
                    </small>
                </div>

                <div class="field focus-wrapper">
                    <label class="label">Email</label>
                    <p class="control has-icons-left">
                        <input v-model="email" class="input" type="email" placeholder="Email" autocomplete="email"
                            :disabled="load" />
                        <span class="icon is-small is-left">
                            <i class="fas fa-envelope"></i>
                        </span>
                    </p>
                </div>

                <div v-if="error" class="has-text-danger mb-2">{{ error }}</div>
                <div class="w-100 is-flex is-justify-content-flex-end">
                    <router-link v-if="success" to="/login" class="button is-primary">
                        Logar
                    </router-link>
                    <button v-else class="button-outline button is-primary" type="submit"
                        :class="load ? 'is-loading' : ''">
                        Enviar link
                    </button>
                </div>
            </form>

            <div class="w-100 is-flex is-justify-content-center">
                <small>
                    Já tem uma conta?
                    <router-link to="/login" class="link">Logar</router-link>
                </small>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/services/firebaseconfig'
import useNotificador from '@/hooks/notificador'
import { TipoNotificacao } from '@/interfaces/INotificacao'


export default defineComponent({
    name: 'ForgotPasswordBox',
    setup() {
        const email = ref('')
        const error = ref('')
        const success = ref('')
        const load = ref(false)
        const { notificar } = useNotificador()


        const emailValid = computed(() => /\S+@\S+\.\S+/.test(email.value))

        const onSubmit = async () => {
            error.value = ''
            success.value = ''
            if (!emailValid.value) {
                error.value = 'Informe um e-mail válido.'
                return
            }
            load.value = true
            try {
                await sendPasswordResetEmail(auth, email.value /*, actionCodeSettings opcional */)
                notificar(TipoNotificacao.SUCESSO, 'Excelente!', '📧 Enviamos um e-mail com o link de redefinição.');

                success.value = '📧 Enviamos um e-mail com o link de redefinição.'
            } catch (e: any) {
                // Tratamento de erros comuns do Firebase
                const code = e?.code || ''
                if (code === 'auth/user-not-found') {
                    // dica: por segurança, você pode NÃO revelar se o usuário existe
                    success.value = '📧 Se este e-mail estiver cadastrado, você receberá um link.'
                } else if (code === 'auth/invalid-email') {
                    error.value = 'E-mail inválido.'
                } else if (code === 'auth/too-many-requests') {
                    error.value = 'Muitas tentativas. Tente novamente mais tarde.'
                } else {
                    error.value = 'Não foi possível enviar o e-mail de redefinição.'
                }
            } finally {
                load.value = false
            }
        }

        return {
            email,
            error,
            success,
            load,
            emailValid,
            onSubmit,
        }
    },
})
</script>


<style scoped>
.forgot-password {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 30px;
}

.forgot-password small {
    font-size: 12px;
}

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
    background: #FED674;
    color: #FFF;
}

.button:hover {
    background: #f8dd9a;
    color: #FFF;
}

.button-outline {
    background: transparent;
    color: #000000;
    border: 2px solid #FED674;
}

.button-outline:hover {
    background: #FED674;
    color: #FFF;
}

.button-outline:focus {
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