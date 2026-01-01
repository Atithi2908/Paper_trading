import React from 'react';
interface CardProps{
    children: React.ReactNode
}
export default function Card({children}:CardProps){
    return <div className='bg-white p-4 sm:p-6 md:p-8 rounded-lg w-full max-w-md'>
        {children}
    </div>
}