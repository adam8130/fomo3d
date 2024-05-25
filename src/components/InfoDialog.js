import { motion } from "framer-motion";
import { useStore } from "../zustand/store";

export function InfoDialog({ setInfoDialog }) {

  const { infoDialog } = useStore()

  return (
    <div
      className="w-screen h-screen fixed top-0 left-0 bg-[rgba(10,10,10,.6)] flex justify-center items-center z-50"
      onClick={(e) => setInfoDialog(false)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-[600px] max-sm:w-[350px] max-lg:max-h-[60%] overflow-y-auto flex flex-col gap-[16px] px-6 py-6 bg-[rgba(40,40,40,.95)] text-white rounded relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-[6px]">
          {infoDialog.map((item, idx) => (
            <p key={idx}>{item}</p>
          ))}
        </div>
        <button 
          className="py-1 px-8 bg-[#ffa95e] text-white rounded" 
          onClick={() => setInfoDialog(false)}
        >
          OK
        </button>
      </motion.div>
    </div>
  );
}
