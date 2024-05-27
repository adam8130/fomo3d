import { useStore } from "../zustand/store"
import { TeamCardsOptions } from '../const/const'
import moment from "moment-timezone"

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
              {moment.unix(record.args.time.toNumber()).format('YYYY/MM/DD HH:mm')}
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
                    record.args.teamId.toNumber() === 0
                      ? { color: '#ff9cba' }
                    : record.args.teamId.toNumber() === 1
                      ? { color: '#fecb4b' }
                    : record.args.teamId.toNumber() === 2
                      ? { color: '#a178f9' }
                    : { color: '#90c052' }
                  }
                >
                  {TeamCardsOptions[record.args.teamId.toNumber()]}
                </span>
              </span>
              <span>
                {record.args.amount.toNumber() / 1000000} ROE
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}