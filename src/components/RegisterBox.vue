<template>
  <div>
    <div class="register-div">
      <form class="box register-box" @submit.prevent="handleCadastro">
        <div class="title-register">
          <span class="title">Cadastre-Se</span>
        </div>

        <!-- Nome -->
        <div class="field focus-wrapper">
          <label class="label">Nome</label>
          <p class="control has-icons-left">
            <input v-model="displayName" class="input" type="text" placeholder="Seu nome" />
            <span class="icon is-small is-left">
              <i class="fas fa-user"></i>
            </span>
          </p>
        </div>

        <!-- Email -->
        <div class="field focus-wrapper">
          <label class="label">Email</label>
          <p class="control has-icons-left">
            <input v-model="email" class="input" type="email" placeholder="Email" />
            <span class="icon is-small is-left">
              <i class="fas fa-envelope"></i>
            </span>
          </p>
        </div>

        <!-- Senha -->
        <div class="field focus-wrapper">
          <label class="label">Senha</label>
          <p class="control has-icons-left has-icons-right">
            <input v-model="password" class="input" :type="showPassword ? 'text' : 'password'" placeholder="********" />
            <span class="icon is-small is-left">
              <i class="fas fa-lock"></i>
            </span>
            <span @click="togglePassword" class="icon is-small is-right"
              :style="'cursor: pointer; pointer-events: auto !important;'">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </span>
          </p>
        </div>

        <!-- Confirmar senha -->
        <div class="field focus-wrapper">
          <label class="label">Confirmar senha</label>
          <p class="control has-icons-left has-icons-right">
            <input v-model="confirmPassword" class="input" :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="********" />
            <span class="icon is-small is-left">
              <i class="fas fa-lock"></i>
            </span>
            <span @click="toggleConfirmPassword" class="icon is-small is-right"
              :style="'cursor: pointer; pointer-events: auto !important;'">
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </span>
          </p>
        </div>

        <!-- Erro -->
        <div v-if="error" class="has-text-danger mb-2">{{ error }}</div>

        <div class="w-100 is-flex is-justify-content-flex-end">
          <button class="button is-primary" type="submit">Sign up</button>
        </div>
      </form>
      <div class="w-100 is-flex is-justify-content-center">
        <small>Já possui uma conta? <router-link to="/login" class="link">Logar</router-link></small>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/services/firebaseconfig';

export default defineComponent({
  name: 'RegisterBox',
  setup() {
    const displayName = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const error = ref('');
    const router = useRouter();
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);


    function togglePassword() {
      showPassword.value = !showPassword.value;
    }

    function toggleConfirmPassword() {
      showConfirmPassword.value = !showConfirmPassword.value;
    }

    const handleCadastro = async () => {
      const emailValid = computed(() => /\S+@\S+\.\S+/.test(email.value))
      error.value = '';

      if (!displayName.value || !email.value || !password.value || !confirmPassword.value) {
        error.value = 'Preencha todos os campos.';
        return;
      }
      if (!emailValid.value) {
        error.value = 'Informe um e-mail válido.'
        return
      }

      if (password.value !== confirmPassword.value) {
        error.value = 'As senhas não coincidem.';
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);

        // Atualiza o nome de exibição do usuário
        if (userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: displayName.value
          });
        }

        router.push('/login');
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof FirebaseError) {
          switch (err.code) {
            case 'auth/email-already-in-use':
              error.value = 'E-mail já está em uso';
              break;
            case 'auth/invalid-email':
              error.value = 'E-mail inválido';
              break;
            case 'auth/weak-password':
              error.value = 'A senha é muito fraca';
              break;
            default:
              error.value = 'Erro inesperado';
          }
        } else {
          error.value = 'Erro desconhecido';
        }
      }
    };

    return {
      displayName,
      email,
      password,
      confirmPassword,
      error,
      handleCadastro,
      togglePassword,
      toggleConfirmPassword,
      showPassword,
      showConfirmPassword
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
