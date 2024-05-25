export function TextDialog({ textDialog, setTextDialog }) {
  return (
    <div 
      className="w-screen h-screen fixed top-0 left-0 bg-[rgba(10,10,10,.6)] flex justify-center items-center z-50"
      onClick={(e) => setTextDialog(false)}
    >
      <div 
        className="w-[600px] max-sm:w-[350px] flex flex-col gap-[16px] items-center p-5 bg-[rgba(40,40,40,.95)] rounded relative"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-white text-[20px]">
          {textDialog.title}
        </span>
        <span className="text-white text-[14px] text-center">
          {textDialog.text}
        </span>
        <button 
          className="py-1 px-8 bg-[#ffa95e] text-white rounded" 
          onClick={() => {
            window.location.reload()
            setTextDialog(false)}
          }
        >
          OK
        </button>
      </div>
    </div>
  )
}