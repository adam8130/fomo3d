export function Loading() {
  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-[rgba(10,10,10,.6)] flex justify-center items-center z-[100]">
      <div className='w-[90%] flex justify-center items-center gap-[24px]'>
        <div className="w-[60px] h-[60px] bg-[rgba(220,220,220,.6)] rounded-full flex justify-center items-center shrink-0">
          <div className="w-[30px] h-[30px] bg-[#ffa95e] rounded-full animate-ping" />
        </div>
        <p className="text-white text-[18px] font-[400]">
          Waiting for blockchain response, Please don't close the page .
        </p>
      </div>
    </div>
  )
}
