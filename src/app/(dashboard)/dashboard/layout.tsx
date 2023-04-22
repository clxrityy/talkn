import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import Image from 'next/image';
import { Icon, Icons } from '@/components/Icons';
import SignOutButton from '@/components/SignOutButton';
import FriendRequestSidebarOptions from '@/components/FriendRequestSidebarOptions';
import { fetchRedis } from '@/helpers/redis';
import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id';
import SidebarChatList from '@/components/SidebarChatList';


interface LayoutProps {
    children: ReactNode;
}

interface SidebarOption {
    id: number
    name: string
    href: string
    Icon: Icon
}

const sidebarOptions: SidebarOption[] = [
    {
        id: 1,
        name: 'Add friend',
        href: '/dashboard/add',
        Icon: 'UserPlus'
    },
]

const Layout = async ({ children }: LayoutProps) => {

    const session = await getServerSession(authOptions);
    if (!session) notFound();

    const friends = await getFriendsByUserId(session.user.id);

    const unseenRequestCount = (
        await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`) as User[]
    ).length

    return <div className='w-full flex h-screen'>
        <div className='flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r-2 border-gray-300 bg-white m-2 container pb-3'>
            <Link href='/dashboard' className='flex h-16 shrink-0 items-center'>
                <Image src='/logo.png' width={100} height={100} alt='logo' className='h-16 w-auto hover:animate-pulse transition' />
            </Link>

            {friends.length > 0 ? (
                <div className='text-xs font-semibold leading-6 text-gray-400'>
                    Your chats
                </div>
            ) : null
            }
            <nav className='flex flex-1 flex-col'>
                <ul role='list' className='flex flex-1 flex-col gap-y-7'>


                    <li>
                        <SidebarChatList sessionId={session.user.id} friends={friends} />
                    </li>


                    <li>
                        <div className='text-xs font-semibold leading-6 text-gray-400'>
                            Overview
                        </div>

                        <ul role='list' className='-mx-2 mt-2 space-y-1'>
                            {sidebarOptions.map((option) => {
                                const Icon = Icons[option.Icon]
                                return (
                                    <li key={option.id}>
                                        <Link href={option.href} className='text-gray-700 hover:text-[#72cab7] hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                                            <span className='text-gray-400 border-gray-200 group-hover:border-[#72cab7] group-hover:text-[#72cab7] flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                                                <Icon className='h-4 w-4' />
                                            </span>
                                            <span className='truncate'>
                                                {option.name}
                                            </span>
                                        </Link>
                                    </li>
                                )
                            })}
                            <li>
                                <FriendRequestSidebarOptions sessionId={session.user.id} initialUnseenRequestCount={unseenRequestCount} />
                            </li>
                        </ul>
                    </li>

                    <li className='-mx-6 mt-auto flex items-center'>
                        <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-200 rounded-md'>
                            <div className='relative h-8 w-8 bg-gray-50 rounded-full'>
                                <Image
                                    fill
                                    referrerPolicy='no-referrer'
                                    className='rounded-full'
                                    src={session.user.image || ''}
                                    alt='Your avatar'
                                />
                            </div>
                            <span className='sr-only'>
                                Your profile
                            </span>
                            <div className='flex flex-col'>
                                <span aria-hidden='true'>
                                    {session.user.name}
                                </span>
                                <span className='text-xs text-zinc-400' aria-hidden='true'>
                                    {session.user.email}
                                </span>
                            </div>
                        </div>

                        <SignOutButton className="h-full aspect-square mr-5" />
                    </li>
                </ul>
            </nav>
        </div>
        <aside className='max-h-screen container py-16 md:py-12 w-full'>
            {children}
        </aside>
    </div>
}

export default Layout;