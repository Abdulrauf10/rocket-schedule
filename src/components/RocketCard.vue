<template>
  <v-card class="ma-4" @click="$emit('click')" max-width="210" min-width="200">
    <v-img
      :src="rocket?.flickr_images?.[0] || fallbackImage"
      height="180px"
      contain
    />
    <v-card-title class="text-h6 text-wrap">
      {{ rocket?.name }}
    </v-card-title>
    <v-card-subtitle class="text-body-2 text-wrap">
      {{ rocket?.company }} • {{ rocket?.country }}
    </v-card-subtitle>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { Rocket } from '@/types/rockets';

const { rocket } = defineProps<{ rocket: Rocket }>();

const fallbackImage = 'https://images2.imgbox.com/5c/36/gbDKf6Y7_o.png';
</script>
