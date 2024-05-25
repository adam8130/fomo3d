import { ethers } from 'ethers'

let provider
let signer

const ourChainId = process.env.REACT_APP_CHAIN_ID

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  provider = new ethers.BrowserProvider(window.ethereum)
  signer = await provider.getSigner();

  const initEthers = async () => {
    const { chainId } = await provider.getNetwork()
  
    if (chainId !== ourChainId) {
      const changed = await changeNetwork()
      if (changed) return
    }
  }
  initEthers()
  console.log('MetaMask is installed!')
} 
else {
  console.log('MetaMask is uninstalled!')
}

const changeNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ethers.toQuantity(ourChainId) }],
    })
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: ethers.toQuantity(ourChainId),
              chainName: 'amoy-matic-' + ourChainId,
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              ...JSON.parse(process.env.REACT_APP_BLOCK_NETWORK),
            },
          ],
        })
      } catch (addError) {
        console.log('addError', addError)
        return addError
      }
    }
  }
}

export {
  provider,
  signer,
}