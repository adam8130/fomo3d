import { useEffect, useState } from 'react'
import { useStore } from '../zustand/store'

import Apple_Icon from '../assets/apple.webp'
import Banana_Icon from '../assets/banana.webp'
import Grape_Icon from '../assets/grape.webp'
import Lemon_Icon from '../assets/lemon.webp'
import Key_icon from '../assets/key.svg'

export function Team() {

  const { contract } = useStore()
  const [teamInfo, setTeamInfo] = useState({
    apple: {
      key: 0,
      player: 0
    },
    banana: {
      key: 0,
      player: 0
    },
    grape: {
      key: 0,
      player: 0
    },
    lemon: {
      key: 0,
      player: 0
    }
  })

  useEffect(() => {
    if (!contract) return

    const getCurrentRound = async () => {
      const roundId = await contract.CURRENT_ROUND_ID()
      const currentRound = await contract.getRound(roundId)
      setTeamInfo({
        apple: {
          key: currentRound.teamKeys[0].toNumber(),
          player: currentRound.teamPlayers[0].toNumber()
        },
        banana: {
          key: currentRound.teamKeys[1].toNumber(),
          player: currentRound.teamPlayers[1].toNumber()
        },
        grape: {
          key: currentRound.teamKeys[2].toNumber(),
          player: currentRound.teamPlayers[2].toNumber()
        },
        lemon: {
          key: currentRound.teamKeys[3].toNumber(),
          player: currentRound.teamPlayers[3].toNumber()
        }
      })
    }
    getCurrentRound()
  }, [contract])

  return (
    <div className="py-3 p-5 flex flex-col gap-[18px] text-white relative">
      <h1 className="text-[20px] pb-3 border-b border-[#22222290]">
        Team
      </h1>
      <div className="flex flex-wrap gap-[2%]">
        <div className="w-[49%] h-full pt-4 pb-6 flex flex-col gap-[8px] items-center bg-[rgba(40,40,40,.3)] rounded cursor-pointer">
          <img className="w-[60px] h-[60px] mb-[8px]" src={Apple_Icon} alt='Apple Team' />
          <p className='text-[20px]'>Apple Team</p>
          <div className='text-[14px] flex items-center gap-[6px]'>
            <span>{teamInfo['apple'].key} key</span>
            <img className="w-[12px] h-[12px]" src={Key_icon} alt='key' />
          </div>
          <h3 className="text-[20px] [text-shadow:0_0_8px_#a178f9]">
            {teamInfo['apple'].player} Players
          </h3>
        </div>
        <div className="w-[49%] h-full pt-4 pb-6 flex flex-col gap-[8px] items-center bg-[rgba(40,40,40,.3)] rounded cursor-pointer">
          <img className="w-[60px] h-[60px] mb-[8px]" src={Banana_Icon} alt='Banana Team' />
          <p className='text-[20px]'>Banana Team</p>
          <div className='text-[14px] flex items-center gap-[6px]'>
            <span>{teamInfo['banana'].key} key</span>
            <img className="w-[12px] h-[12px]" src={Key_icon} alt='key' />
          </div>
          <h3 className="text-[20px] [text-shadow:0_0_8px_#a178f9]">
            {teamInfo['banana'].player} Players
          </h3>
        </div>
        <div className="mt-[4%] w-[49%] h-full pt-4 pb-6 flex flex-col gap-[8px] items-center bg-[rgba(40,40,40,.3)] rounded cursor-pointer">
          <img className="w-[60px] h-[60px] mb-[8px]" src={Grape_Icon} alt='Grape Team' />
          <p className='text-[20px]'>Grape Team</p>
          <div className='text-[14px] flex items-center gap-[6px]'>
            <span>{teamInfo['grape'].key} key</span>
            <img className="w-[12px] h-[12px]" src={Key_icon} alt='key' />
          </div>
          <h3 className="text-[20px] [text-shadow:0_0_8px_#a178f9]">
            {teamInfo['grape'].player} Players
          </h3>
        </div>
        <div className="mt-[4%] w-[49%] h-full pt-4 pb-6 flex flex-col gap-[8px] items-center bg-[rgba(40,40,40,.3)] rounded cursor-pointer">
          <img className="w-[60px] h-[60px] mb-[8px]" src={Lemon_Icon} alt='Lemon Team' />
          <p className='text-[20px]'>Lemon Team</p>
          <div className='text-[14px] flex items-center gap-[6px]'>
            <span>{teamInfo['lemon'].key} key</span>
            <img className="w-[12px] h-[12px]" src={Key_icon} alt='key' />
          </div>
          <h3 className="text-[20px] [text-shadow:0_0_8px_#a178f9]">
            {teamInfo['lemon'].player} Players
          </h3>
        </div>
      </div>
    </div>
  )
}