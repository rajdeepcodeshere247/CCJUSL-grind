import React from 'react'

function Loading() {
  return (
    <div className='grid place-items-center h-[80vh] px-4'>
      <div className='flex flex-col items-center gap-8'>

        {/* Animated bars */}
        <div className='flex items-end gap-1.5'>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className='w-1 bg-red-400 animate-pulse rounded-none'
              style={{
                height: `${[24, 40, 56, 40, 24][i]}px`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>

        {/* Label */}
        <div className='flex items-center gap-4 text-white/40 text-xs tracking-widest font-mono'>
          <div className='h-px w-12 bg-white/20'></div>
          <span>LOADING</span>
          <div className='h-px w-12 bg-white/20'></div>
        </div>

      </div>
    </div>
  )
}

export default Loading