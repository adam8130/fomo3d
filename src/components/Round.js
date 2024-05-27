import { useEffect, useRef, useState } from "react";
import { useStore } from "../zustand/store";
import { Fomo3DContractABI } from "../plugin/abi/Fomo3DAbi";
import { signer } from "../plugin/ethers";
import { ethers } from "ethers";
import moment from "moment-timezone";

import ROE_coin from "../assets/roe.webp";
import Key_icon from "../assets/key.svg";
import Question_Icon from "../assets/circle-question.svg";

const RoundInfo = [
  "Definitions for the current round:",
  "• Jackpot: The total prize pool accumulated in the current round.",
  "• Your Keys: The number of Keys you have purchased in the current round.",
  "• Your Earnings: The rewards you have accumulated in the current round that are ready to withdraw.",
];

export function Round({ endTime }) {
  const circleRef = useRef(null);
  const [value, setValue] = useState(0);
  const [userEaring, setUserEaring] = useState(0);
  const { jackpot, roundId, userOwnedKeys, isColddowning, setInfoDialog } = useStore();

  useEffect(() => {
    const init = async () => {
      try {
        const contract = new ethers.Contract(
          process.env.REACT_APP_CONTRACT_ADDRESS,
          Fomo3DContractABI,
          signer
        );

        const userEarning = await contract.getMyEarnings();
        setUserEaring(userEarning.toNumber() / 1000000)
      } catch (err) {
        console.log(err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    let progress;
    if (value < 100) {
      progress = setInterval(() => {
        setValue((prevValue) => prevValue + 1);
        circleRef.current.style.background = `conic-gradient(
          rgb(143, 0, 160), rgb(18, 47, 192) ${value * 3.6}deg,
          rgb(12, 12, 12) ${value * 3.6}deg
        )`;
      }, 30);
    }
    return () => clearInterval(progress);
  }, [value]);

  return (
    <div className="py-3 p-5 flex flex-col gap-[18px] text-white relative">
      <h1 className="text-[20px] pb-3 border-b border-[#22222290]">
        Round #{roundId + 1}
      </h1>
      <h1 className="text-[32px] text-center">
        Contract will {!isColddowning ? "drain" : "start"} in
      </h1>
      {/* <div 
        className="mx-auto w-[150px] h-[150px] rounded-[50%] bg-red-300 flex justify-center items-center"
        style={{ background: 'linear-gradient(to bottom, #3883e0, #a178f9 33%, #ff9cba 66%, #ff9874)' }}
      >
        <span>20:59:59</span>
      </div> */}
      <div className="circle-bar col-12 col-md-4 d-flex flex-md-column text-center">
        <div ref={circleRef} className="circle-progress">
          <div className="circle-value" data-value="94">
            {endTime
              ? moment
                  .utc(moment.duration(endTime, "second").asMilliseconds())
                  .format("HH:mm:ss")
              : "--:--:--"}
          </div>
        </div>
      </div>
      <div className="flex flex-col p-4 bg-[rgba(10,10,10,.4)] gap-[24px]">
        <div className="flex justify-between items-center relative">
          <span className="text-[20px]">Jackpot</span>
          <div className="text-[32px] max-lg:text-[24px] flex items-center gap-[8px] [text-shadow:0_0_8px_#a178f9]">
            <span>{jackpot}</span>
            <img className="w-[30px] h-[30px]" src={ROE_coin} alt="ROE" />
          </div>
          {/* <p className="absolute right-0 top-[42px]"
            >500,000 USDT
          </p> */}
        </div>
        <div className="flex justify-between items-center relative">
          <span className="text-[20px]">Your Keys</span>
          <div className="text-[32px] max-lg:text-[24px] flex items-center gap-[8px]">
            <span>{userOwnedKeys}</span>
            <img className="w-[20px] h-[20px]" src={Key_icon} alt="ROE" />
          </div>
          {/* <p className="absolute right-0 top-[42px]">
            500,000 USDT
          </p> */}
        </div>
        <div className="flex justify-between items-center relative">
          <span className="text-[20px]">Your Earnings</span>
          <span className="text-[32px] max-lg:text-[24px] [text-shadow:0_0_8px_#a178f9]">
            {userEaring ? userEaring.toFixed(6) : 0} ROE
          </span>
          {/* <p className="absolute right-0 top-[42px]">
            500,000 USDT
          </p> */}
        </div>
      </div>
      <img
        className="absolute right-5 top-5 w-[20px] h-[20px]"
        src={Question_Icon}
        alt="information"
        onClick={() => setInfoDialog(RoundInfo)}
      />
    </div>
  );
}
