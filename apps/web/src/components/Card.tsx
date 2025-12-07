import React from 'react';
interface CardProps{
    children: React.ReactNode
}
export default function Card({children}:CardProps){
    return <div className='bg-white p-8 rounded-[0.5vw]'>
        {children}
    </div>
}