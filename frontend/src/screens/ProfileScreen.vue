<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import StatefulButton from '../components/StatefulButton.vue';

const router = useRouter();
const user = ref<{
  id: number;
  username: string;
  avatarUrl: string;
  email: string | null;
  emailVerified: boolean;
  flags: number;

  createdAt: string;
  updatedAt: string;
} | null>(null);

const success = ref('');
const error = ref('');
const newAvatarUrl = ref('');
const badges = [
  { name: "System", color: "bg-red-400" },
  { name: "Verified", color: "bg-blue-500" },
];

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

const avatarChangeState = ref(false);
async function changeAvatar() {
  if(!newAvatarUrl.value || newAvatarUrl.value.trim().length > 255) {
    error.value = 'Avatar url must be a valid URL and less than 255 characters.';
    return;
  }

  avatarChangeState.value = true;

  try {
    await fetch('https://auth.lanny.dev/api/@me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token') || ''
      },
      body: JSON.stringify({ avatarUrl: newAvatarUrl.value })
    });
  } catch {} finally {
    error.value = '';
    success.value = 'Avatar changed successfully!';
    newAvatarUrl.value = '';
    avatarChangeState.value = false;
  }
}

onMounted(async () => {
  const token = localStorage.getItem('token');
  if(!token) return await router.push('/login');

  const res = await fetch('https://auth.lanny.dev/api/@me', {
    headers: { Authorization: token, 'Content-Type': 'application/json' }
  });

  if(res.ok) user.value = await res.json();
});
</script>

<template>
  <div class="min-h-screen w-3xl bg-gray-900 text-gray-100 flex flex-col items-center justify-center">
    <template v-if="user">
      <div class="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8">
        <div class="flex flex-col items-center">
          <img
            :src="user.avatarUrl"
            alt="Avatar"
            class="w-24 h-24 rounded-full border-4 border-gray-700 mb-4"
          />
          <div class="w-full flex flex-col items-center mb-4">
            <span class="text-2xl font-bold">{{ user.username }}</span>
            <span class="text-sm text-gray-400">
            {{ user.email ?? "[no email]" }}
          </span>
            <span class="mt-1 text-xs" :class="user.emailVerified ? 'text-green-400' : 'text-red-400'">
            {{ user.emailVerified ? "Email Verified" : "Email Unverified" }}
          </span>
          </div>
          <div class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="badge in badges"
            :key="badge.name"
            :class="`px-2 py-1 rounded-full text-xs font-semibold ${badge.color} text-gray-900`"
          >
            {{ badge.name }}
          </span>
          </div>
          <div class="w-full flex flex-col gap-2 mb-4">
            <button class="bg-gray-700 cursor-not-allowed text-gray-400 py-2 rounded transition">
              Change Email
            </button>
            <button class="bg-gray-700 cursor-not-allowed text-gray-400 py-2 rounded transition">
              Change Password
            </button>
          </div>
          <div class="w-full flex flex-col gap-2">
            <label class="text-sm text-gray-400">Avatar URL</label>
            <input
              type="text"
              class="bg-gray-700 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="newAvatarUrl"
              placeholder="Paste avatar URL here"
            />
            <StatefulButton text="Change Avatar" :is-loading="avatarChangeState" @click="changeAvatar" />
            <h2 v-if="error" class="text-md text-red-400 w-full text-center mt-1">{{ error }}</h2>
            <h2 v-if="success" class="text-md text-green-400 w-full text-center mt-1">{{ success }}</h2>
          </div>
        </div>
      </div>
      <button @click="logout" class="mt-8 font-bold cursor-pointer bg-red-500 hover:bg-red-700 text-white py-2 px-6 rounded transition w-full max-w-md">
        Logout
      </button>
    </template>
    <h1 v-else>Loading</h1>
  </div>
</template>

<style scoped>
</style>