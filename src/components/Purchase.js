import { useEffect, useRef, useState } from 'react'
import { ROEContractABI } from '../plugin/abi/RoeABI'
import { Fomo3DContractABI } from '../plugin/abi/Fomo3DAbi'
import { ethers } from 'ethers'
import { changeNetwork, provider, signer } from '../plugin/ethers'
import { motion } from 'framer-motion'
import { useStore } from '../zustand/store'
import { TeamCard } from './TeamCard'
import { TeamCardsOptions } from '../const/const'

import Apple_Icon from '../assets/apple.webp'
import Banana_Icon from '../assets/banana.webp'
import Lemon_Icon from '../assets/lemon.webp'
import Grape_Icon from '../assets/grape.webp'
import Question_Icon from '../assets/circle-question.svg'

const BuyKeysOptions = [
  1, 
  2, 
  5, 
  10, 
  100
]

const info = [
  "1. Each round begins with a 3-hour cooldown period. During this time, players who purchase Keys will not increase the Key price, and no rewards will be distributed until the game officially starts.",
  "2. After the cooldown period ends, a 24-hour countdown timer will begin. Each Key purchase will add 30 seconds to the timer, but the countdown will never exceed 24 hours.",
  "3. After the cooldown period, each Key purchase will increase the Key price by 1%.",
  "4. When purchasing a Key, players must choose a team. The rewards from purchased Keys will be distributed according to the chosen team’s reward distribution ratio. Subsequent Key purchases will partially reward all Key holders in the current round.",
  "5. Each Key purchase has a chance to trigger a lucky airdrop reward.",
  "6. After the cooldown period, every 33rd Key buyer and every multiple of 33 will receive a discount on the Key price.",
  "7. When the timer reaches zero, the game ends. The player who made the last Key purchase determines the winning team and becomes the winning player. The winning team determines the distribution of the jackpot, and the winning player receives the winning prize from the jackpot.",
]

const TeamInfo = [
  "When purchasing a Key, players must choose one of the following teams, each with different reward distribution ratios:",
  "• Apple Team: 45% to the jackpot, 31% to the current round’s players. Higher emphasis on the jackpot.",
  "• Banana Team: 30% to the jackpot, 46% to the current round’s players. Higher emphasis on the current round’s players.",
  "• Grape Team: 50% to the jackpot, 26% to the current round’s players. Highest emphasis on the jackpot.",
  "• Lemon Team: 38% to the jackpot, 38% to the current round’s players. Balanced distribution.",
]

export function Purchase() {

  const { contract, walletAddress, isColddowning } = useStore()
  const { setTextDialog, setIsLoading, setInfoDialog, setWalletAddress } = useStore()

  const [selectedTeamIdx, setSelectedTeamIdx] = useState(0)
  const [selectedKeyAmount, setSelectedKeyAmount] = useState(1)
  const [bigIntKeyPrice, setBigIntKeyPrice] = useState(0)
  const [finalKeyPrice, setFinalKeyPrice] = useState(0)

  const [airdropReward, setAirdropReward] = useState(0)
  const [currentAirdropTracker, setCurrentAirdropTracker] = useState(0)

  const [purchaseDialog, setPurchaseDialog] = useState(false)

  useEffect(() => {
    if (!contract || bigIntKeyPrice) return

    const getBuyPrice = async () => {
      const price = await contract.getBuyPrice()
      const bigIntKeyPrice = price.toString()

      const airdropReward = await contract.airdropReward()
      const currentAirdropTracker = await contract.currentAirdropTracker()
      
      setAirdropReward(airdropReward.toNumber() / 1000000)
      setCurrentAirdropTracker(currentAirdropTracker.toNumber() / 100)

      setBigIntKeyPrice(bigIntKeyPrice)
      setFinalKeyPrice(bigIntKeyPrice * ((1 - (1.01 ** 1)) / (1 - 1.01)))
    }
    getBuyPrice()
  }, [contract, bigIntKeyPrice, selectedKeyAmount])

  const handleSelectKeys = (amount) => {
    const calculatedPrice = isColddowning 
      ? bigIntKeyPrice * amount 
      : bigIntKeyPrice * ((1 - (1.01 ** amount)) / (1 - 1.01))

    setFinalKeyPrice(Math.round(calculatedPrice))
    setSelectedKeyAmount(amount)
  }

  const handleSendROE = async () => {
    await provider.send('eth_requestAccounts', [])
    setPurchaseDialog(true)
  }

  const connectWallet = async () => {
    try {
      const { chainId } = await provider.getNetwork()
  
      if (chainId !== Number(process.env.REACT_APP_CHAIN_ID)) {
        return await changeNetwork()
      }
      await provider.send('eth_requestAccounts', [])
      const walletAddress = signer.getAddress()
      setWalletAddress(walletAddress)
    } catch (err) {
      console.log(err)
    }
    
  }

  return (
    <>
      <div className="py-3 p-5 flex flex-col gap-[18px] text-white relative">
        <h1 className="text-[20px] pb-3 border-b border-[#22222290]">
          Keyring
        </h1>
        <p className="text-[14px]">
          Purchase of {bigIntKeyPrice / 1000000} ROE or more have a {currentAirdropTracker}% chance to win some of  the {airdropReward} ROE airdrop pot. instantly
        </p>
        <div className="flex">
          <div className='w-[70%] h-[40px] bg-[#ffffff] text-center leading-[40px] rounded-l cursor-pointer'>
            <input 
              type="number"
              value={selectedKeyAmount}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (e.target.value.includes('.') || isNaN(v)) {
                  setSelectedKeyAmount('')
                } 
                else {
                  handleSelectKeys(v)
                }
              }}
              className="w-[50px] text-black outline-none text-center" 
              maxLength={5}
            />
            <span className='text-black'>Key{selectedKeyAmount > 1 && 's'}</span>
          </div>
          <span className="w-[30%] h-[40px] bg-[#dedede] text-center leading-[40px] rounded-r cursor-pointer text-[#1e1d1d]">
            {finalKeyPrice / 1000000} ROE
          </span>
        </div>
        <div className="flex gap-[8px]">
          {BuyKeysOptions.map((item, idx) => (
            <span 
              key={idx}
              className={`h-[40px] text-center leading-[40px] rounded cursor-pointer bg-[${selectedKeyAmount === item ? '#ffa95e' : '#dedede'}] text-[${selectedKeyAmount === item ? 'white' : '#1e1d1d'}]`}
              style={
                idx === 0 
                  ? { width: '30%' } 
                : idx === 1 
                  ? { width: '30%' }
                  : { width: '15%' }
              }
              onClick={() => handleSelectKeys(item)}
            >
              {item}
              {idx === 0 ? ' Key' : idx < 2 ? ' Keys' : ''}
            </span>
          ))}
        </div>
        <div className="flex justify-between">
          <span 
            className="w-full h-[40px] bg-[#ffa95e] text-center leading-[40px] rounded cursor-pointer text-white border border-[#ffa95e] hover:bg-[#ffa95e20] transition-3"
            onClick={() => walletAddress ? handleSendROE() : connectWallet()}
          >
            {walletAddress ? 'Send ROE' : 'Connect Wallet'}
          </span>
        </div>
        <p className="text-[14px] text-[#ffa95e] text-center font-[300] pb-3 border-b border-[#22222290]">
          Send ROE, buy lucky keys to win big rewards.
        </p>
        <h1 className="text-[20px] relative">
          Choose a Team
          <img className="absolute right-0 top-1 w-[20px] h-[20px]" src={Question_Icon} alt="information" onClick={() => setInfoDialog(TeamInfo)} />
        </h1>
        <div className="flex gap-[6px]">
          {TeamCardsOptions.map((item, idx) => (
            <div key={idx} className='w-[25%]' onClick={() => setSelectedTeamIdx(idx)}>
              <TeamCard
                key={idx} 
                icon={idx === 0 ? Apple_Icon : idx === 1 ? Banana_Icon : idx === 2 ? Grape_Icon : Lemon_Icon} 
                title={item} 
                activated={selectedTeamIdx === idx}
                desc={
                  idx === 0 ? '+ Balanced of Banana and Grape'
                  : idx === 1 ? '+ Maximize ROE to current round'
                  : idx === 2 ? '+ Most ROE to Jackpot'
                  : '+ Balanced distribution'
                }
              />
            </div>
          ))}
        </div>
        <img className="absolute right-5 top-5 w-[20px] h-[20px]" src={Question_Icon} alt="information" onClick={() => setInfoDialog(info)} />
      </div>
      {purchaseDialog && (
        <PurchaseDialog 
          contract={contract} 
          selectedKeyAmount={selectedKeyAmount} 
          selectedTeamIdx={selectedTeamIdx}
          finalKeyPrice={finalKeyPrice}
          setPurchaseDialog={setPurchaseDialog}
          setTextDialog={setTextDialog}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  )
}

function PurchaseDialog({ 
  contract,
  selectedTeamIdx,
  finalKeyPrice, 
  setPurchaseDialog,
  setTextDialog,
  setIsLoading
}) {
  const ref = useRef(null)
  const [inviteAddress, setInviteAddress] = useState('')

  const submit = async () => {
    try {
      const RoeContract = new ethers.Contract(
        process.env.REACT_APP_ROE_CONTRACT_ADDRESS, 
        ROEContractABI, 
        signer
      )
  
      let validAddress = false
      if (inviteAddress) {
        try {
          const id = await contract.CURRENT_ROUND_ID()
          const isAddress = await contract.roundRefferrals(
            id,
            inviteAddress
          )
          validAddress = isAddress ? inviteAddress : '0x0000000000000000000000000000000000000000'
        } catch (err) {
          console.log(err)
        }
      }
  
      setIsLoading(true)
      ref.current.style.display = 'none'
      const approvedTX = await RoeContract.approve(process.env.REACT_APP_CONTRACT_ADDRESS, finalKeyPrice)
      await approvedTX.wait()
      console.log(approvedTX)
  
      const Fomo3DContract = new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        Fomo3DContractABI,
        signer
      )
      const tx = await Fomo3DContract.buyKey(
        validAddress || '0x0000000000000000000000000000000000000000', 
        selectedTeamIdx, 
        finalKeyPrice
      )
      await tx.wait()
      console.log(tx)
      setIsLoading(false)
      setTextDialog({
        title: 'Transaction is successful',
        text: 'Your transaction has been successfully completed .'
      })
      setPurchaseDialog(false)
    } catch (err) {
      console.log(err)
      setIsLoading(false)
      setTextDialog({
        title: 'Transaction failed',
        text: "Oops there's something went wrong ."
      })
      setPurchaseDialog(false)
    }
  }

  return (
    <div 
      ref={ref}
      className="w-screen h-screen fixed top-0 left-0 bg-[rgba(10,10,10,.6)] flex justify-center items-center z-50"
      onClick={(e) => setPurchaseDialog(false)}
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-[500px] max-sm:w-[350px] flex flex-col gap-[16px] items-center px-4 py-6 bg-[rgba(40,40,40,.95)] text-white rounded relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[90%] flex flex-col gap-[6px]">
        <span className='text-[18px]'>Cost of purchase</span>
          <span className='text-gray-300'>
            {finalKeyPrice / 1000000} {'ROE'}
          </span>
        </div>
        <div className="w-[90%] flex flex-col gap-[6px]">
          <span className='text-[18px]'>Choosed Team</span>
          <span className='text-gray-300'>
            {TeamCardsOptions[selectedTeamIdx]}{' '}{'Team'}
          </span>
        </div>
        <div className="w-[90%] flex flex-col gap-[6px]">
          <span className='text-[18px]'>Inviter's wallet address</span>
          <input 
            type="text" 
            className="mt-2 px-2 text-gray-300 bg-[transparent] border border-gray-300 rounded outline-none" 
            value={inviteAddress} 
            onChange={(e) => setInviteAddress(e.target.value)}
          />
        </div>
        <button className="py-1 px-8 bg-[#ffa95e] text-white rounded" onClick={submit}>
          Submit
        </button>
      </motion.div>
    </div>
  )
}
