import React from 'react'

const LayoutStore = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='py-20 bg-gradient-to-bl from-brand01/60 via-neutral01 to-neutral01'>
      {children}
    </div>
  )
}

export default LayoutStore