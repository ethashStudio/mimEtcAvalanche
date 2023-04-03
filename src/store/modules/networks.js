export default {
  state: {
    networks: [
      {
        chainId: "0xa869",
        name: "ETC",
        code: 43113,
      },
      {
        chainId: "0x539",
        name: "ETC",
        code: 1337,
      },
      {
        chainId: "0x7a69",
        name: "ETC",
        code: 31337,
      },
    ],
    activeNetwork: "0xa869",
  },
  mutations: {
    setActiveNetwork(state, payload) {
      state.activeNetwork = payload;
    },
  },
  getters: {
    getActiveNetwork: (state) => state.activeNetwork,
    getActiveChain: (state) =>
      state.networks.find((item) => item.chainId === state.activeNetwork),
    getAvailableNetworks: (state) => state.networks,
  },
};
