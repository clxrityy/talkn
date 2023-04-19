import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { FC } from 'react'


const page = async() => {

    const session = await getServerSession(authOptions);
    if (!session) notFound();

    // ids of people who sent current logged in user a friend request
    const incomingSenderIds = (await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`)) as string[];


    return <div>page</div>
}

export default page;