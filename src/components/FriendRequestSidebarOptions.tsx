'use client';


import { User } from 'lucide-react';
import Link from 'next/link';
import { FC, useState } from 'react';

interface FriendRequestSidebarOptionsProps {
    sessionId: string
    initialUnseenRequestCount: number
}

const FriendRequestSidebarOptions: FC<FriendRequestSidebarOptionsProps> = ({ initialUnseenRequestCount, sessionId }) => {

    const [unseenRequestCount, setUnseenRequestCount] = useState<number>(initialUnseenRequestCount)


    return <Link
        href='/dashboard/requests'
        className='text-gray-700 hover:text-[#72cab7] hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
    >
        <div className='text-gray-400 border-gray-200 group-hover:border-[#72cab7] group-hover:text-[#72cab7] flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
            <User className='h-4 w-4' />
        </div>
        <p className='truncate'>
            Friend requests
        </p>

        {unseenRequestCount > 0 ? (
            <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-[#72cab7]'>
                {unseenRequestCount}
            </div>
        ) : null}
    </Link>
}

export default FriendRequestSidebarOptions;