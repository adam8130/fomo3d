import { useEffect, useState } from 'react'
import { useStore } from '../zustand/store'

import Water_Icon from '../assets/water.png'
import Fire_Icon from '../assets/fire.png'
import Earth_Icon from '../assets/earth.png'
import Elve_icon from "../assets/elves.webp";

export function Team() {

  const { contract } = useStore()
  const [teamInfo, setTeamInfo] = useState({
    water: {
      key: 0,
      player: 0
    },
    fire: {
      key: 0,
      player: 0
    },
    earth: {
      key: 0,
      player: 0
    }
  })

  useEffect(() => {
    if (!contract) return

    const getCurrentRound = async () => {
      const roundId = await contract.CURRENT_ROUND_ID()
      const currentRound = await contract.getRound(roundId)
      console.log(currentRound)
      setTeamInfo({
        water: {
          elf: currentRound.teamElfs[0]?.toNumber(),
          player: currentRound.teamPlayers[0]?.toNumber()
        },
        fire: {
          elf: currentRound.teamElfs[1]?.toNumber(),
          player: currentRound.teamPlayers[1]?.toNumber()
        },
        earth: {
          elf: currentRound.teamElfs[2]?.toNumber(),
          player: currentRound.teamPlayers[2]?.toNumber()
        },
        lemon: {
          elf: currentRound.teamElfs[3]?.toNumber(),
          player: currentRound.teamPlayers[3]?.toNumber()
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
      <div className="flex flex-col gap-[8px]">
        <div className="w-full h-full pt-4 pb-6 flex gap-[8px] justify-around items-center bg-[rgba(40,40,40,.3)] rounded cursor-pointer">
          <img 
            className="w-[58px] max-sm:w-[48px] h-[60px] max-sm:h-[48px]" 
            src={Water_Icon} 
            alt='Water Team' 
          />
          <p className='text-[18px] max-sm:text-[16px]'>Water Team</p>
          <div className='text-[20px] max-sm:text-[14px] flex items-center gap-[6px]'>
            <span>{teamInfo['water'].elf} Elf</span>
            <img className="w-[20px] h-[20px]" src={Elve_icon} alt='elf' />
          </div>
          <h3 className="text-[20px] max-sm:text-[14px] [text-shadow:0_0_8px_#a178f9]">
            {teamInfo['water'].player} Players
          </h3>
        </div>
        <div className="w-full h-full pt-4 pb-6 flex gap-[8px] justify-around items-center bg-[rgba(40,40,40,.3)] rounded cursor-pointer">
          <img 
            className="w-[58px] max-sm:w-[48px] h-[60px] max-sm:h-[48px]" 
            src={Fire_Icon} 
            alt='Fire Team' 
          />
          <p className='text-[18px] max-sm:text-[16px]'>Fire Team</p>
          <div className='text-[20px] max-sm:text-[14px] flex items-center gap-[6px]'>
            <span>{teamInfo['fire'].elf} Elf</span>
            <img className="w-[20px] h-[20px]" src={Elve_icon} alt='elf' />
          </div>
          <h3 className="text-[20px] max-sm:text-[14px] [text-shadow:0_0_8px_#a178f9]">
            {teamInfo['fire'].player} Players
          </h3>
        </div>
        <div className="w-full h-full pt-4 pb-6 flex gap-[8px] justify-around items-center bg-[rgba(40,40,40,.3)] rounded cursor-pointer">
          <img 
            className="w-[58px] max-sm:w-[48px] h-[60px] max-sm:h-[48px]" 
            src={Earth_Icon} 
            alt='Earth Team' 
          />
          <p className='text-[18px] max-sm:text-[16px]'>Earth Team</p>
          <div className='text-[20px] max-sm:text-[14px] flex items-center gap-[6px]'>
            <span>{teamInfo['earth'].elf} Elf</span>
            <img className="w-[20px] h-[20px]" src={Elve_icon} alt='elf' />
          </div>
          <h3 className="text-[20px] max-sm:text-[14px] [text-shadow:0_0_8px_#a178f9]">
            {teamInfo['earth'].player} Players
          </h3>
        </div>
      </div>
    </div>
  )
}