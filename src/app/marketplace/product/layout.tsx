import React from 'react'

const ProductLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-gradient-to-bl pt-16 from-brand01/40 via-neutral01 to-neutral01'>{children}</div>
  )
};

export default ProductLayout;
