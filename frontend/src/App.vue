<script setup lang="ts">
import { onMounted, ref } from 'vue';

const error = ref('');
const username = ref('');
const password = ref('');
const loading = ref(true);
const currentUser = ref<{ username: string } | null>(null);

const query = new URLSearchParams(window.location.search);

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      loading.value = false;
      return;
    }

    const res = await fetch('https://auth.lanny.dev/@me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });

    currentUser.value = await res.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
  } finally {
    loading.value = false;
  }
});

const asCurrent = async () => {
  if(query.has('redirect')) window.location.href = query.get('redirect')! + '?token=' + localStorage.getItem('token');
};

const logout = () => {
  localStorage.removeItem('token');
  currentUser.value = null;
};

const login = async () => {
  try {
    const res = await fetch('https://auth.lanny.dev/login', {
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
    if (!data.token) return error.value = data.message;

    localStorage.setItem('token', data.token);
    window.location.reload();
  } catch (err) {
    console.log(err);
  }
};
</script>

<template>
  <div class="flex flex-col w-full items-center justify-center min-h-screen bg-gray-900">
    <div v-if="currentUser" class="flex flex-col p-8 justify-center items-center bg-gray-800 rounded-lg shadow-lg">
      <button
        @click="asCurrent()"
        class="flex justify-center cursor-pointer items-center w-full px-5 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition mb-4 shadow"
      >
        <img
          src="https://cdn.discordapp.com/avatars/238217641997631490/549547c7a383b0429bc02c27eb15da2f.webp"
          alt="avatar"
          class="w-10 h-10 rounded-full mr-3 border-2 border-white"
        />
        <span class="font-semibold text-lg">Continue as <span class="text-blue-200">{{ currentUser.username }}</span></span>
      </button>
      <a
        @click="logout()"
        class="flex cursor-pointer justify-center w-full text-gray-400 rounded hover:text-blue-400 transition"
      >
        Log out
      </a>
    </div>
    <div v-else class="flex flex-col items-center bg-gray-800 rounded-lg p-10 shadow-lg">
      <h1 class="text-5xl font-bold mb-5 text-gray-100">Authorization</h1>
      <h2 v-if="error" class="text-lg text-red-400 mb-2">{{ error }}</h2>
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
        @click="login"
        class="flex cursor-pointer font-bold text-2xl justify-center items-center w-full px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition mb-4 shadow"
      >
        Login
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
