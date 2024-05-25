import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'
import { Purchase } from './components/Purchase';
import { Vault } from './components/Vault';
import { Round } from './components/Round';
import { Team } from './components/Team';
import { RecentPlayers } from './components/RecentPlayers';
import { Stat } from './components/Stat';
import { Loading } from './components/Loading';
import { TextDialog } from './components/TextDialog';
import { InfoDialog } from './components/InfoDialog';

import { ethers } from 'ethers';
import { signer } from './plugin/ethers';
import { Fomo3DContractABI } from './plugin/abi/Fomo3DAbi';
import { toNumber } from 'ethers/utils'
import { useStore } from "./zustand/store";

import moment from 'moment';

import Background from './assets/background.webp';
import ROE_coin from './assets/roe.webp';
import Timer_icon from './assets/timer.svg';

const Gradient_Text = '[background-image:linear-gradient(85deg,#3883e0_0%,#a178f9_34%,#ff9cba_66%,#ff9874_100%)]'

const Left_Pannel = [
  'Purchase',
  'Vault'
]

const Right_Pannel = [
  'Round',
  'Team',
  'Recent Players',
  'Stat'
]

const marqueeVariants = {
  animate: {
    x: ['100%', '-200%'],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: 'loop',
        duration: 25,
        ease: 'linear'
      }
    }
  }
};

export default function App() {
  
  const [leftActiveTab, setLeftActiveTab] = useState(0)
  const [rightActiveTab, setRightActiveTab] = useState(0)
  const [endTime, setEndTime] = useState(null)
  
  const { contract, walletAddress, jackpot, roundId, boughtRecords, textDialog, isLoading, infoDialog, isColddowning } = useStore()
  const { setContract, setWalletAddress, setRoundId, setJackPot } = useStore()
  const { setUserOwnedKeys, setIsColddowning, setBoughtRecords, setTextDialog, setInfoDialog } = useStore()

  // init ethers
  useEffect(() => {
    const initContract = async () => {
      const contract = new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS, 
        Fomo3DContractABI, 
        signer
      )
      const walletAddress = await signer.getAddress()
      
      setContract(contract)
      setWalletAddress(walletAddress)
    }
    initContract()
  }, [setContract, setWalletAddress])

  useEffect(() => {
    if (!contract) return
    
    const getRemainingTime = async () => {
      const remainingColdTime = await contract.getColdDownTime()
      const remainingColdSeconds = toNumber(remainingColdTime)
      console.log('remainingColdSeconds', remainingColdSeconds)

      const remainingEndTime = await contract.getRemainingTime()
      const remainingEndSecond = toNumber(remainingEndTime)
      console.log('remainingEndSecond', remainingEndSecond)

      const isColddowning = remainingColdSeconds > 0
      console.log('isColddowning', isColddowning)
      
      let timer
      if (isColddowning) {
        setEndTime(remainingColdSeconds)
        timer = setTimeout(
          () => {
            setIsColddowning(false)
            setEndTime(remainingEndSecond)
          }, 
          (remainingColdSeconds + 1) * 1000
        )
      } 
      else {
        setEndTime(remainingEndSecond)
      }
      setIsColddowning(isColddowning)

      return () => {
        clearTimeout(timer)
      }
    }
    getRemainingTime()
  }, [setIsColddowning, contract])

  useEffect(() => {
    if (!contract) return
  
    const getCurrentRound = async () => {
      const roundInfo = await contract.getRound()
      console.log('roundInfo', roundInfo)

      const jackpot = toNumber(roundInfo.pool)
      const roundId = toNumber(roundInfo.roundId)

      setRoundId(roundId)
      setJackPot(jackpot / 1000000)
    }
    getCurrentRound()
  }, [contract, setRoundId, setJackPot, setEndTime, setIsColddowning])

  useEffect(() => {
    if (roundId === null) return

    const getUserInfo = async () => {
      const id = await contract.CURRENT_ROUND_ID()
      const userInfo = await contract.roundPlayers(id, walletAddress)
      console.log('userInfo', userInfo)

      const userOwnedKeys = toNumber(userInfo.ownedKeys)
      setUserOwnedKeys(userOwnedKeys)
    }
    getUserInfo()
  }, [roundId, contract, walletAddress, setUserOwnedKeys])

  useEffect(() => {
    if (!contract) return;

    const getBuyRecords = async () => {
      const filter = contract.filters.OnKeyBought();
      const logs = await contract.queryFilter(filter);
      console.log('logs', logs.slice(-4).reverse());
      setBoughtRecords(logs.slice(-4).reverse());
    };

    getBuyRecords();
  }, [contract, setBoughtRecords]);

  useEffect(() => {
    if (endTime !== null && endTime > 0) {

      const timer = setInterval(() => {
        setEndTime((prevTime) => prevTime - 1);
      }, 1000);
      
      return () => clearInterval(timer)
    }
  }, [endTime])

  // useEffect(() => {
  //   try {
  //     const getMaticPrice = async () => {
  //       const res = fetch('https://www.qdlianghao.com/api/token/price', {
  //         method: 'post',
  //         body: { Symbol: 'MATIC', page: 0, limit: 1 }
  //       })
  //       console.log(res)
  //     }
  //     getMaticPrice()
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }, [])

  return (
    <div className="w-full h-[120vh] max-lg:h-full flex flex-col relative">
      <div className="h-[23vh] bg-[#fdfdfd] flex flex-col items-center justify-between">
        <div className='flex items-center gap-[12px] mt-4 translate-x-[18px] '>
          <h1 className={`text-[42px] font-[900] bg-clip-text text-transparent ${Gradient_Text}`}>
            {jackpot}
          </h1>
          <img className="w-[50px] h-[50px]" src={ROE_coin} alt="ROE coin" />
        </div>
        <div className='flex items-center translate-y-[-6px]'>
          <img className="w-[35px] h-[35px]" src={Timer_icon} alt="Fomo3D Timer" />
          <span 
            className="font-[500] text-[22px]"
            style={{ color: isColddowning ? '#ea5e21' : '#5198a8' }}
          >
            {endTime ? moment.utc(moment.duration(endTime, 'second').asMilliseconds()).format('HH:mm:ss') : '--:--:--'}
          </span>
        </div>
        <div className='w-[70%] max-lg:w-[95%] bg-[#85faff40] py-2 text-center text-[#5198a8] overflow-hidden'>
          {
            boughtRecords?.length > 0 ? (
              <motion.div 
                className="w-full flex gap-[12px]"
                variants={marqueeVariants} 
                animate="animate"
              >
                {boughtRecords?.map((record, idx) => (
                  <div key={idx} className="flex gap-[8px] bg-[rgba(255,255,255,.8)] px-2 rounded">
                    <p className="flex gap-[6px]">
                      <span>Player:</span>
                      <span className='text-[#ffa95e] whitespace-nowrap'>{record.args.player}</span>
                    </p>
                    <p className="flex gap-[6px]">
                      <span>Bought:</span>
                      <span className='text-[#ffa95e] whitespace-nowrap'>
                        {toNumber(record.args.boughtKeys)} Keys
                      </span>
                    </p>
                  </div>
                ))}
              </motion.div>
            ) : (
              <span className="w-full text-center">No recent records</span>
            )
          }
        </div>
      </div>
      <div className="w-full h-[97vh] object-cover flex justify-center gap-[28px] pt-[36px] pb-[36px] max-lg:flex-col max-lg:items-center max-lg:h-full max-lg:pt-10 max-lg:pb-20" 
        style={{ background: `url(${Background}) no-repeat center center / cover` }}
      >
        <div className="w-[490px] max-lg:w-[95%] h-[630px]">
          <div className="w-full h-[40px] flex gap-[4px] bg-transparent">
            {Left_Pannel.map((item, idx) => (
              <div 
                key={idx}
                className="h-full bg-[#dfdede] flex items-center justify-center py-3 px-5 rounded-t cursor-pointer transition-3 relative"
                style={ leftActiveTab === idx ? { background: '#15141495', color: '#fff' } : {} }
                onClick={() => setLeftActiveTab(idx)}
              >
                <span>{item}</span>
                {leftActiveTab === idx && (
                  <span className="w-[65%] h-[2px] bg-[#ffa95e] absolute bottom-1 left-[50%] translate-x-[-50%]" />
                )}
              </div>  
            ))}
          </div>
          <div className="w-full h-[600px] max-lg:h-full bg-[#15141495] rounded-b">
            <motion.div
              key={leftActiveTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {
                leftActiveTab === 0 ? <Purchase /> :
                leftActiveTab === 1 ? <Vault /> : <Purchase />
              }
            </motion.div>
          </div>
        </div>
        <div className="w-[490px] max-lg:w-[95%] max-lg:mt-[24px] h-[630px]">
          <div className="w-full h-[40px] flex gap-[4px] bg-transparent">
            {Right_Pannel.map((label, idx) => (
              <div 
                key={idx}
                className="h-full bg-[#dfdede] flex items-center justify-center py-3 px-5 rounded-t cursor-pointer transition-3 relative"
                style={ rightActiveTab === idx ? { background: '#15141495', color: '#fff' } : {} }
                onClick={() => setRightActiveTab(idx)}
              >
                <span>
                  {
                    label === 'Recent Players' && window.innerWidth <= 768 
                      ? label.split(' ')[0] 
                      : label
                  }
                </span>
                {rightActiveTab === idx && (
                  <span className="w-[65%] h-[2px] bg-[#a178f9] absolute bottom-1 left-[50%] translate-x-[-50%]" />
                )}
              </div>  
            ))}
          </div>
          <div className="w-full h-[600px] max-lg:h-full bg-[#15141495] rounded-b">
            <motion.div
              key={rightActiveTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {
                rightActiveTab === 0 ? <Round endTime={endTime} /> :
                rightActiveTab === 1 ? <Team /> :
                rightActiveTab === 2 ? <RecentPlayers /> :
                rightActiveTab === 3 ? <Stat /> : <Round />
              }
            </motion.div>
          </div>
        </div>
      </div>
      {isLoading && (
        <Loading />
      )}
      {textDialog && (
        <TextDialog
          textDialog={textDialog}
          setTextDialog={setTextDialog}
        />
      )}
      {infoDialog && (
        <InfoDialog 
          setInfoDialog={setInfoDialog} 
        />
      )}
    </div>
  );
}
