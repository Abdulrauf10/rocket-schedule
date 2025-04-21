import type { Rocket } from '@/types/rockets';
import { getAllRockets, filterRockets } from '@/services/api';

export default {
  namespaced: true,
  state: () => ({
    apiRockets: [] as Rocket[],
    localRockets: [] as Rocket[],
    combinedRockets: [] as Rocket[],
    loading: false,
    error: false,
    lastQuery: null as any,
  }),

  mutations: {
    SET_API_ROCKETS(state: any, rockets: any) {
      state.apiRockets = rockets;
    },
    SET_LOCAL_ROCKETS(state: any, rockets: any) {
      state.localRockets = rockets;
      localStorage.setItem('localRockets', JSON.stringify(state.localRockets));
    },
    ADD_LOCAL_ROCKET(state: any, rocket: Rocket) {
      state.localRockets.push(rocket);
      localStorage.setItem('localRockets', JSON.stringify(state.localRockets));
    },
    SET_COMBINED_ROCKETS(state: any, rockets: any) {
      state.combinedRockets = rockets;
    },
    SET_LOADING(state: any, value: boolean) {
      state.loading = value;
    },
    SET_ERROR(state: any, value: boolean) {
      state.error = value;
    },
    SET_QUERY(state: any, query: any) {
      state.lastQuery = query;
    },
    LOAD_LOCAL_ROCKETS(state: any) {
      const stored = localStorage.getItem('localRockets');
      state.localRockets = stored ? JSON.parse(stored) : [];
    },
  },

  actions: {
    async fetchAllRockets({ commit, dispatch }: any) {
      commit('SET_LOADING', true);
      try {
        const rockets = await getAllRockets();
        commit('SET_API_ROCKETS', rockets);
        dispatch('combineRockets');
      } catch (e) {
        console.log(e);
        commit('SET_ERROR', true);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async filterRocketsAction({ commit, dispatch }: any, query: any) {
      commit('SET_LOADING', true);
      commit('SET_QUERY', query);
      try {
        const rockets = await filterRockets(query);
        commit('SET_API_ROCKETS', rockets);
        dispatch('combineRockets');
      } catch (e) {
        console.log(e);
        commit('SET_ERROR', true);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    combineRockets({ state, commit }: any) {
      let local = state.localRockets;

      if (state.lastQuery) {
        local = local.filter((r: any) => {
          const q = state.lastQuery;
          if (
            q.name &&
            !r.name.toLowerCase().includes(q.name.$regex.toLowerCase())
          )
            return false;
          if (q.country && r.country !== q.country) return false;
          if (q.cost_per_launch && r.cost_per_launch > q.cost_per_launch.$lte)
            return false;
          return true;
        });
      }

      commit('SET_COMBINED_ROCKETS', [...local, ...state.apiRockets]);
    },
  },

  getters: {
    rockets: (state: any) => state.combinedRockets,
    getRocketById: (state: any) => (id: any) => {
      return [...state.localRockets, ...state.apiRockets].find(
        (r) => r.id === id,
      );
    },
  },
};
