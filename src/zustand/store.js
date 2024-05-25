import { create } from 'zustand'

export const useStore = create()((set) => ({
  walletAddress: null,
  roundId: null,
  jackpot: 0,
  userOwnedKeys: 0,
  endTime: null,
  isColddowning: null,
  boughtRecords: [],
  isLoading: false,
  textDialog: false,
  infoDialog: false,

  setContract: (contract) => set({ contract: contract }),
  setWalletAddress: (address) => set({ walletAddress: address }),
  setRoundId: (id) => set({ roundId: id }),
  setJackPot: (amount) => set({ jackpot: amount }),
  setUserOwnedKeys: (amount) => set({ userOwnedKeys: amount }),
  setEndTime: (time) => set({ endTime: time }),
  setIsColddowning: (state) => set({ isColddowning: state }),
  setBoughtRecords: (records) => set({ boughtRecords: records }),
  setIsLoading: (state) => set({ isLoading: state }),
  setTextDialog: (state) => set({ textDialog: state }),
  setInfoDialog: (state) => set({ infoDialog: state }),
}))