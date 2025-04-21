<template>
  <v-btn class="mb-10 mt-10 ml-10" @click="router.back()"> Back </v-btn>
  <div class="pa-5 text-center" v-if="rocket">
    <v-img
      :src="rocket?.flickr_images?.[0] || '/assets/logo.png'"
      height="300px"
    />
    <h2 class="mt-5">{{ rocket.name }}</h2>
    <p><strong>Company:</strong> {{ rocket.company }}</p>
    <p><strong>Description:</strong> {{ rocket.description }}</p>
    <p><strong>Cost per Launch:</strong> ${{ rocket.cost_per_launch }}</p>
    <p><strong>Country:</strong> {{ rocket.country }}</p>
    <p><strong>First Flight:</strong> {{ rocket.first_flight }}</p>
  </div>

  <div v-else-if="error">
    <p>Error loading rocket data.</p>
  </div>

  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ref, onMounted } from 'vue';
import { getRocketById } from '@/services/api';
import type { Rocket } from '@/types/rockets';

const route = useRoute();
const store = useStore();
const router = useRouter();

const rocket = ref<Rocket | null>(null);
const loading = ref(true);
const error = ref(false);

onMounted(async () => {
  const id = route.params.id as string;

  try {
    const localRocket = store.getters['rockets/getRocketById'](id);

    if (localRocket && localRocket.isLocal) {
      rocket.value = localRocket;
    } else {
      rocket.value = await getRocketById(id);
    }
  } catch (e) {
    console.error(e);
    error.value = true;
  } finally {
    loading.value = false;
  }
});
</script>
