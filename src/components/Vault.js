import { useEffect, useState } from "react"
import { useStore } from "../zustand/store"
import { ethers } from "ethers"
import { Fomo3DContractABI } from "../plugin/abi/Fomo3DAbi"
import { signer } from "../plugin/ethers"

import Question_Icon from '../assets/circle-question.svg'

const VaultInfo = [
  "• Expected Benefit: The additional reward amount you can receive at the end of the current round, influenced by the team chosen by the last Elf buyer and the number of Elves you purchased. This cannot be withdrawn until the round ends.",
  "• Available Benefits: The accumulated profit-sharing amount from each Elf, the extra reward amount from the previous round, and the winning prize if you are the winner. Can be withdrawn at any time.",
  "• Referral Bonus: The bonus for the referrer. If another player enters your wallet address when purchasing Elves, you will receive the referral bonus. Can be withdrawn at any time.",
  "• Total Gains: The current amount you can withdraw. You must withdraw the entire amount at once; partial withdrawals are not allowed.",
]

export function Vault() {

  const { setTextDialog, setIsLoading, setInfoDialog } = useStore()
  const [vaultInfo, setVaultInfo] = useState({
    expectedBenefits: 0,
    availableBenefits: 0,
    referralBouns: 0,
    totalGains: 0
  })

  useEffect(() => {
    const init = async () => {
      try {
        const contract = new ethers.Contract(
          process.env.REACT_APP_CONTRACT_ADDRESS, 
          Fomo3DContractABI, 
          signer
        )
  
        const vaultInfo = await contract.getVault()
  
        const expectedBenefits = vaultInfo.expected.toNumber() / 1000000
        const availableBenefits = vaultInfo.avaliable.toNumber() / 1000000
        const referralBouns = vaultInfo.referral.toNumber() / 1000000
        const totalGains = availableBenefits + referralBouns
  
        setVaultInfo({
          expectedBenefits,
          availableBenefits,
          referralBouns,
          totalGains
        })
      } catch (err) {
        console.log(err)
      }
    }
    init()
  }, [])

  const handleWithdraw = async () => {
    try {
      const contract = new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS, 
        Fomo3DContractABI, 
        signer
      )
      setIsLoading(true)
      const withdrawTX = await contract.withdraw()
      await withdrawTX.wait()
      console.log(withdrawTX)

      setIsLoading(false)
      setTextDialog({
        title: 'Transaction is successful',
        text: 'Your transaction has been successfully completed .'
      })
    } catch (err) {
      console.log(err)
      setIsLoading(false)
      setTextDialog({
        title: 'Transaction failed',
        text: "Oops there's something went wrong ."
      })
    }
  }

  return (
    <div className="py-3 p-5 flex flex-col gap-[18px] text-white relative">
      <h1 className="text-[20px] pb-3 border-b border-[#22222290]">Vault</h1>
      <div className="h-[400px] flex flex-col p-4 bg-[rgba(10,10,10,.4)] gap-[18px]">
        <div className="flex justify-between gap-[6px] items-center">
          <span className="text-[18px]">Expected Benefits</span>
          <span className="text-[30px] max-lg:text-[24px]">
            {vaultInfo.expectedBenefits ? vaultInfo.expectedBenefits.toFixed(6) : 0} ROE
          </span>
        </div>
        <div className="flex justify-between gap-[6px] items-center">
          <span className="text-[18px]">Available Benefits</span>
          <span className="text-[30px] max-lg:text-[24px]">
            {vaultInfo.availableBenefits ? vaultInfo.availableBenefits.toFixed(6) : 0} ROE
          </span>
        </div>
        <div className="flex justify-between gap-[6px] items-center pb-[18px] border-b border-[#22222290]">
          <span className="text-[18px]">Referral Bouns</span>
          <span className="text-[30px] max-lg:text-[24px]">
            {vaultInfo.referralBouns ? vaultInfo.referralBouns.toFixed(6) : 0} ROE
          </span>
        </div>
        <div className="flex justify-between gap-[6px] items-center relative">
          <span className="text-[18px]">Total Gains</span>
          <span className="text-[30px] max-lg:text-[24px] [text-shadow:0_0_8px_#a178f9]">
            {vaultInfo.totalGains ? vaultInfo.totalGains.toFixed(6) : 0} ROE
          </span>
          {/* <p className="absolute right-0 top-[42px]">
            500,000 USDT
          </p> */}
        </div>
        <button 
          className="mt-[28px] w-full py-2 border border-[#ffa95e] text-[#ffa95e] hover:bg-[#ffa95e20] hover:text-white rounded-md transition-3"
          onClick={() => handleWithdraw()}
        >
          Withdraw
        </button>
      </div>
      <img className="absolute right-5 top-5 w-[20px] h-[20px]" src={Question_Icon} alt="information" onClick={() => setInfoDialog(VaultInfo)} />
    </div>
  )
}
