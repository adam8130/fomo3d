export function TeamCard({ icon, title, desc, activated }) {
  return (
    <div 
      className="w-full h-full pt-4 pb-4 flex flex-col gap-[8px] items-center bg-[rgba(40,40,40,.3)] rounded cursor-pointer"
      style={ activated ? { background: '#ffa95e', boxShadow: '0 0 8px #ffa95e' } : {} }
    >
      <img className="w-[60px] h-[60px]" src={icon} alt={title} />
      <p className='text-[14px]'>{title}</p>
      <p className='text-[12px] max-sm:text-[10px] mt-[-6px] max-sm:mt-[-4px] text-center px-2'>{desc}</p>
    </div>
  )
}