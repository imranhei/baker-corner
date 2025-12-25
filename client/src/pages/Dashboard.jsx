import React from 'react'

const Dashboard = () => {
  return (
    <div className='grid grid-cols-3 gap-4'>
      <div className='w-full bg-teal-400 h-40 flex items-center justify-center text-white font-bold rounded-lg shadow-md'>
        Receive Form
      </div>
      <div className='w-full bg-teal-400 h-40 flex items-center justify-center text-white font-bold rounded-lg shadow-md'>
        Received Item
      </div>
      <div className='w-full bg-teal-400 h-40 flex items-center justify-center text-white font-bold rounded-lg shadow-md'>
        Stock
      </div>
      <div className='w-full bg-teal-400 h-40 flex items-center justify-center text-white font-bold rounded-lg shadow-md'>
       Sales Form
      </div>
      <div className='w-full bg-teal-400 h-40 flex items-center justify-center text-white font-bold rounded-lg shadow-md'>
        Sale Item
      </div>
      <div className='w-full bg-teal-400 h-40 flex items-center justify-center text-white font-bold rounded-lg shadow-md'>
        Summary
      </div>
    </div>
  )
}

export default Dashboard