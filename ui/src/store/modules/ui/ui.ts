import { RootState } from '@/store/store.interfaces';
import { ActionContext, Module } from 'vuex';
import {
  DrawerConfig,
  FullscreenOverlayConfig,
  ModalConfig,
  OverlayConfig,
  UiState,
} from './ui.interfaces';

export const UiStoreState: () => UiState = () => ({
  overlays: [],
});

export const UiStoreMutations = {};

export const UiStoreActions = {
  openOverlay(
    { state }: ActionContext<UiState, RootState>,
    payload: DrawerConfig | ModalConfig | FullscreenOverlayConfig
  ) {
    const index = state.overlays.findIndex((o) => o.id === payload.id);
    if (index > -1) {
      state.overlays.splice(index, 1, payload);
    } else {
      state.overlays.push(payload);
    }
  },
  closeOverlay(
    { state }: ActionContext<UiState, RootState>,
    payload: OverlayConfig['id'] | OverlayConfig
  ) {
    const id = typeof payload === 'string' ? payload : payload.id;
    const index = state.overlays.findIndex((o) => o.id === id);
    if (index > -1) {
      state.overlays.splice(index, 1);
    }
  },
};

export const UiStoreGetters = {};

export const ui: Module<UiState, RootState> = {
  namespaced: true,
  state: UiStoreState,
  mutations: UiStoreMutations,
  actions: UiStoreActions,
  getters: UiStoreGetters,
};
