import React, {useState} from 'react'
import Send from './Send'
import Recipients from './Recipients'
import RecentTx from './RecentTx'
import GlobalTx from './GlobalTx'

const Main = () => {
  const [route, setRoute] = useState('send');

  return (
    <div className='w-full mt-12 flex flex-col justify-center items-center'>
      <div className='flex justify-around text-log font-medium items-center bg-gray-900 border-2 border-b-0 text-white border-opacity-50 border-blue-800 rounded-t-lg w-1/2'>
      {/* send */}
        <li onClick={() => setRoute('send')} className={`list-none cursor-pointer py-2 w-1/4 ${route == 'send' ? "bg-black bg-opacity-60" : "bg-gray-900"} text-center rounded-tl-lg hover:bg-black hover:bg-opacity-60`}>
          Send
        </li>
      {/* Recipients */}
        <li onClick={() => setRoute('recipients')} className={`list-none cursor-pointer py-2 w-1/4 ${route == 'recipients' ? "bg-black bg-opacity-60" : "bg-gray-900"} text-center rounded-tl-lg hover:bg-black hover:bg-opacity-60`}>
          Recipients
        </li>
      {/* Recent Tx */}
        <li onClick={() => setRoute('recent_tx')} className={`list-none cursor-pointer py-2 w-1/4 ${route == 'recent_tx' ? "bg-black bg-opacity-60" : "bg-gray-900"} text-center rounded-tl-lg hover:bg-black hover:bg-opacity-60`}>
          Recent Tx
        </li>
      {/* Global Tx */}
        <li onClick={() => setRoute('global_tx')} className={`list-none cursor-pointer py-2 w-1/4 ${route == 'global_tx' ? "bg-black bg-opacity-60" : "bg-gray-900"} text-center rounded-tl-lg hover:bg-black hover:bg-opacity-60`}>
          Global Tx
        </li>
      </div>
      {/* Screen */}
      <div className='bg-black bg-opacity-60 pb-5 overflow-y-auto border-2 border-t-0 shadow-lg border-opacity-50 border-blue-800 rounded-b-lg w-1/2'>
        {(() => {
          if(route == 'send') {
            return <Send />
          } else if(route == 'recipients') {
            return <Recipients />
          } else if(route == 'recent_tx') {
            return <RecentTx />
          } else if(route == "global_tx") {
            return <GlobalTx />
          }
        })()}
      </div>

    </div>
  )
}

export default Main