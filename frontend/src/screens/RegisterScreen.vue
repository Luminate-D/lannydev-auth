<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';

const error = ref('');
const success = ref('');
const username = ref('');
const password = ref('');
const router = useRouter();

onBeforeMount(() => {
  if(localStorage.getItem('token')) router.push('/');
});

const register = async () => {
  error.value = '';
  success.value = '';
  if(username.value.length < 3 || username.value.length > 64) {
    return error.value = 'Username must be between 3 and 64 characters.';
  }

  if(password.value.length < 8 || password.value.length > 2048) {
    return error.value = 'Password must be between 8 and 2048 characters.';
  }

  try {
    const res = await fetch('https://auth.lanny.dev/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });

    const data = await res.json();
    if (!res.ok) return error.value = data.message || 'Registration failed.';
    success.value = 'Registration successful! You can now log in.';
    username.value = '';
    password.value = '';
  } catch (err: any) {
    console.log(err);
    error.value = err.message;
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="flex flex-col items-center bg-gray-800 rounded-lg p-10 shadow-lg">
    <h1 class="text-5xl font-bold mb-5 text-gray-100">Registration</h1>
    <h2 v-if="error" class="text-lg text-red-400 mb-2">{{ error }}</h2>
    <h2 v-if="success" class="text-lg text-green-400 mb-2">{{ success }}</h2>
    <input
      type="text"
      v-model="username"
      placeholder="Username"
      class="mb-3 px-4 py-2 border border-gray-700 bg-gray-900 text-gray-200 rounded w-full focus:outline-none focus:border-blue-500"
    />
    <input
      type="password"
      v-model="password"
      placeholder="Password"
      class="mb-4 px-4 py-2 border border-gray-700 bg-gray-900 text-gray-200 rounded w-full focus:outline-none focus:border-blue-500"
    />
    <button
      @click="register"
      class="flex cursor-pointer font-bold text-2xl justify-center items-center w-full px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition mb-4 shadow"
    >
      Register
    </button>
    <button
      @click="goToLogin"
      class="text-blue-400 hover:underline text-lg mt-2"
      style="background: none; border: none; padding: 0;"
    >
      Login
    </button>
  </div>
</template>

<style scoped>
</style>