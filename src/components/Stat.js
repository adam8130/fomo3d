import { useEffect, useState } from 'react';
import { useStore } from '../zustand/store';
import moment from 'moment';

import ROE_coin from '../assets/roe.webp';
import Question_Icon from '../assets/circle-question.svg'
import { Shovel } from 'lucide-react';

const StatInfo = [
  "• Total Invested: The total amount of ROE invested by all players in purchasing Elves so far.",
  "• Distributed Rewards: The total amount of rewards distributed so far.",
  "• Digging Depth: The total accumulated digging depth by sending Elves so far.",
]

export function Stat() {

  const { contract, roundId, setInfoDialog } = useStore()

  const [statInfo, setStatInfo] = useState({
    totalInvested: 0,
    distributedRewards: 0,
    timePurchased: 0
  })

  useEffect(() => {
    if (!contract) return

    const init = async () => {
      const statInfo = await contract.getStats()

      const totalInvested = statInfo.totalInvested.toNumber() / 1000000
      const distributedRewards = statInfo.totalDistributed.toNumber() / 1000000
      const timePurchased = statInfo.totalDigged.toNumber()
      // console.log(statInfo)

      setStatInfo({
        totalInvested,
        distributedRewards,
        timePurchased
      })
    }
    init()
  }, [contract])

  return (
    <div className="py-3 p-5 flex flex-col gap-[18px] text-white relative">
      <h1 className="text-[20px] pb-3 border-b border-[#22222290]">
        Stats until Round #{roundId + 1} (Current)
      </h1>
      <div className="h-[400px] flex flex-col p-4 bg-[rgba(10,10,10,.4)] gap-[24px]">
        <div className="flex justify-between items-center gap-[6px] relative">
          <span className="text-[18px]">Total Invested</span>
          <div className="text-[32px] flex items-center gap-[8px]">
            <span className="max-lg:text-[24px] [text-shadow:0_0_8px_#a178f9]">
              {statInfo.totalInvested}
            </span>
            <img className="w-[35px] h-[35px]" src={ROE_coin} alt="ROE" />
          </div>
          {/* <p className="absolute right-0 top-[42px]">500,000 USDT</p> */}
        </div>
        <div className="flex justify-between items-center gap-[6px] relative">
          <span className="text-[18px]">Distributed Rewards</span>
          <div className="text-[32px] max-lg:text-[24px] flex items-center gap-[8px]">
            <span className="[text-shadow:0_0_8px_#a178f9]">
              {statInfo.distributedRewards}
            </span>
            <img className="w-[35px] h-[35px]" src={ROE_coin} alt="ROE" />
          </div>
          {/* <p className="absolute right-0 top-[42px]">500,000 USDT</p> */}
        </div>
        <div className="flex justify-between items-center gap-[6px] relative">
          <span className="text-[18px]">Digging Depth</span>
          <div className="text-[32px] max-lg:text-[24px] flex items-center gap-[8px]">
            <span className="text-[32px] max-lg:text-[24px] [text-shadow:0_0_8px_#a178f9]">
              {statInfo.timePurchased}
            </span>
            <Shovel className="w-[28px] h-[28px] mx-[3.5px] fill-[rgba(240,240,240,5)]" strokeWidth={2.5} />
          </div>
        </div>
      </div>
      <img className="absolute right-5 top-5 w-[20px] h-[20px]" src={Question_Icon} alt="information" onClick={() => setInfoDialog(StatInfo)} />
    </div>
  )
}