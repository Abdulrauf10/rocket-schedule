<template>
  <v-container>
    <v-text-field
      class="mb-5"
      v-model="search"
      label="Search rocket name"
      @input="onFilter"
    />

    <v-btn class="mb-10" @click="showModal = true">Add New Rocket</v-btn>

    <div
      v-if="loading || error"
      class="d-flex flex-column align-center justify-center text-center"
      style="height: 300px"
    >
      <div v-if="loading">Loading...</div>
      <div v-else>
        Error!
        <v-btn class="ml-2" @click="store.dispatch('rockets/fetchAllRockets')"
          >Retry</v-btn
        >
      </div>
    </div>

    <v-row v-else class="d-flex flex-wrap">
      <v-col
        v-for="rocket in rockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="d-flex justify-center"
      >
        <RocketCard
          :rocket="rocket"
          @click="goToDetail(rocket.id)"
          class="w-100"
        />
      </v-col>
    </v-row>

    <v-dialog v-model="showModal" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Add New Rocket</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="newRocket.name"
              label="Rocket Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="newRocket.company"
              label="Company"
              required
            ></v-text-field>
            <v-text-field
              v-model="newRocket.description"
              label="Description"
              required
            ></v-text-field>
            <v-text-field
              v-model="newRocket.country"
              label="Country"
              required
            ></v-text-field>
            <v-text-field
              v-model.number="newRocket.cost_per_launch"
              label="Cost per Launch"
              type="number"
              required
            ></v-text-field>
            <v-text-field
              v-model="newRocket.first_flight"
              label="First Flight (e.g. 2010-06-04)"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn @click="showModal = false">Cancel</v-btn>
          <v-btn :disabled="!valid" @click="saveRocket">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import RocketCard from '@/components/RocketCard.vue';
import { v4 as uuidv4 } from 'uuid';

const store = useStore();
const router = useRouter();

const rockets = computed(() => store.getters['rockets/rockets']);
const loading = computed(() => store.state.rockets.loading);
const error = computed(() => store.state.rockets.error);
const search = ref('');
const showModal = ref(false);
const valid = ref(false);

const newRocket = ref({
  id: '',
  name: '',
  company: '',
  description: '',
  country: '',
  cost_per_launch: 0,
  first_flight: '',
  flickr_images: ['https://images2.imgbox.com/5c/36/gbDKf6Y7_o.png'],
  isLocal: true,
});

onMounted(() => {
  store.dispatch('rockets/fetchAllRockets');
});

const onFilter = () => {
  if (!search.value) {
    store.commit('rockets/SET_QUERY', null);

    setTimeout(() => {
      store.dispatch('rockets/fetchAllRockets').then(() => {
        store.dispatch('rockets/combineRockets');
      });
    }, 800);
  } else {
    store.dispatch('rockets/filterRocketsAction', {
      name: { $regex: search.value, $options: 'i' },
    });
  }
};

const saveRocket = () => {
  if (
    newRocket.value.name &&
    newRocket.value.company &&
    newRocket.value.description &&
    newRocket.value.country &&
    newRocket.value.first_flight
  ) {
    newRocket.value.id = uuidv4();
    store.commit('rockets/ADD_LOCAL_ROCKET', { ...newRocket.value });
    store.dispatch('rockets/combineRockets');
    showModal.value = false;
    clearForm();
  }
};

const clearForm = () => {
  Object.assign(newRocket.value, {
    id: '',
    name: '',
    company: '',
    description: '',
    country: '',
    cost_per_launch: 0,
    first_flight: '',
    flickr_images: [],
    isLocal: true,
  });
};

const goToDetail = (id: string) => {
  router.push({ name: 'RocketDetail', params: { id } });
};
</script>
