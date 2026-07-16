import React from 'react'

export default function LoadingBlock({ message = 'DECRYPTING…' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-alien/40 animate-pulse-soft font-mono select-none">
      <div className="text-xl tracking-widest font-bold">{message}</div>
      <div className="text-[10px] mt-2 opacity-50 tracking-wider">ESTABLISHING SECURE CONNECTION</div>
    </div>
  )
}
