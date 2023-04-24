import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";


const Page = async ({ }) => {

    const session = await getServerSession(authOptions);

    if (!session) notFound();

    const friends = await getFriendsByUserId(session.user.id);

    const friendsWithLastMsg = await Promise.all(
        friends.map(async (friend) => {
            const [lastMsgRaw] = await fetchRedis('zrange', `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`, -1, -1) as string[];

            const lastMsg = JSON.parse(lastMsgRaw) as Message;

            return {
                ...friend,
                lastMsg
            }
        })
    )

    return <div className="container py-12">
        <h1 className="font-bold text-5xl mb-8">
            Recent chats
        </h1>
        {friendsWithLastMsg.length === 0 ? (
            <p className="text-sm text-zinc-500">
                Nothing to show at the moment...
            </p>
        ) : friendsWithLastMsg.map((friend) => (
            <div key={friend.id} className="relative bg-zinc-50 border border-zinc-200 p-3 rounded-md hover:bg-zinc-200 hover:border-zinc-400 transition ease-out">
                <div className="absolute right-4 inset-y-0 flex items-center">
                    <ChevronRight className="h-7 w-7 text-zinc-600" />
                </div>

                <Link
                    href={`/dashboard/chat/${chatHrefConstructor(session.user.id, friend.id)}`}
                    className="relative sm:flex"
                >
                    <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                        <div className="relative h-10 w-10 mt-1">
                            <Image
                                referrerPolicy="no-referrer"
                                className="rounded-full"
                                alt={`${friend.name} profile picture`}
                                src={friend.image}
                                fill
                            />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold">
                            {friend.name}
                        </h4>
                        <p className="mt-1 max-w-md text-zinc-500">
                            <span className="text-zinc-500 font-semibold">
                                {friend.lastMsg.senderId === session.user.id ? 'You: ' : ''}
                            </span>
                            {friend.lastMsg.text}
                        </p>
                    </div>
                </Link>
            </div>
        ))}
    </div>
}

export default Page;