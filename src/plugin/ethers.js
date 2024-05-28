import { ethers } from 'ethers'

let provider
let signer

const ourChainId = Number(process.env.REACT_APP_CHAIN_ID)

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  signer = provider.getSigner()

  const initEthers = async () => {
    const { chainId } = await provider.getNetwork()
  
    if (chainId !== ourChainId) {
      await changeNetwork()
    }
  }
  initEthers()
  console.log('MetaMask is installed!')
} 
else {
  console.log('MetaMask is uninstalled!')
}

export const changeNetwork = async () => {
  const params = [
    {
      chainId: ethers.utils.hexStripZeros(Number((ourChainId))),
      chainName: 'amoy-matic-' + ourChainId,
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      ...JSON.parse(process.env.REACT_APP_BLOCK_NETWORK),
    },
  ]
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ethers.utils.hexStripZeros(Number((ourChainId))) }],
    })
    window.location.reload()
  } catch (switchError) {
    console.log('switchError', switchError)
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: params,
        })
      } catch (addError) {
        console.log('addError', addError)
        return addError
      }
    }
    return switchError
  }
}

export {
  provider,
  signer,
}