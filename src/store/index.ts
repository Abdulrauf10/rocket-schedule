import { createStore } from 'vuex';
import rocketStore from './modules/rocketStore';

const store = createStore({
  modules: {
    rockets: rocketStore,
  },
});

store.commit('rockets/LOAD_LOCAL_ROCKETS');
store.dispatch('rockets/combineRockets');

export default store;
