<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const currentUser = ref<{ username: string } | null>(null);

const router = useRouter();
const query = new URLSearchParams(window.location.search);

onMounted(async () => {
  const token = localStorage.getItem('token');
  if(!token) return router.push('/login');

  try {
    const res = await fetch('https://auth.lanny.dev/api/@me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });

    const json = await res.json();
    if(!res.ok) throw new Error(json.message || 'Failed to fetch user data');

    currentUser.value = json;
  } catch (e: any) {
    localStorage.removeItem('token');
    await router.push('/login');
  }
});

const asCurrent = () => {
  if(query.has('redirect')) window.location.href = query.get('redirect')! + '?token=' + localStorage.getItem('token');
  else router.push('/profile');
};

const logout = () => {
  localStorage.removeItem('token');
  currentUser.value = null;
  router.push('/login');
};
</script>

<template>
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
  <div v-else>Loading...</div>
</template>

<style scoped>

</style>