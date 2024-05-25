import { useStore } from "../zustand/store"
import { toNumber } from 'ethers/utils'
import { TeamCardsOptions } from '../const/const'
import moment from "moment"

export function RecentPlayers() {
  const { boughtRecords } = useStore()

  return (
    <div className="py-3 p-5 flex flex-col gap-[18px] text-white relative">
      <h1 className="text-[20px] pb-3 border-b border-[#22222290]">
        Recent Players
      </h1>
      <div className="flex flex-col bg-[rgba(10,10,10,.4)]">
        {boughtRecords?.map((record, idx) => (
          <div key={idx} className="w-full flex flex-col p-3 pb-0 text-[14px]">
            <p>
              {moment.unix(toNumber(record.args.time)).format('YYYY/MM/DD HH:MM')}
            </p>
            <div className="w-full flex flex-col">
              <p className="">Address:</p>
              <p className="w-[95%] text-[13px] text-[#ffa95e] text-wrap break-words">
                {record.args.player}
              </p>
            </div>
            <p className="flex justify-between pb-[18px] border-b border-[#22222290]">
              <span className="flex items-center gap-[6px]">
                <span>{'Team: '}</span>
                <span 
                  style={
                    toNumber(record.args.teamId) === 0
                      ? { color: '#ff9cba' }
                    : toNumber(record.args.teamId) === 1
                      ? { color: '#fecb4b' }
                    : toNumber(record.args.teamId) === 2
                      ? { color: '#a178f9' }
                    : { color: '#90c052' }
                  }
                >
                  {TeamCardsOptions[toNumber(record.args.teamId)]}
                </span>
              </span>
              <span>
                {toNumber(record.args.amount) / 1000000} ROE
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}