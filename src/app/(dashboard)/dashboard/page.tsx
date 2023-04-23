import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";


const Page = async ({ }) => {

    const session = await getServerSession(authOptions);

    if (!session) notFound();

    return <div className="container p-2 m-2 flex w-full max-h-[100vh] mx-auto">
        <div id="dashboard" className="flex">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase font-semibold leading-6 text-gray-500">
                    Dashboard
                </h1>
            </div>
        </div>
    </div>
}

export default Page;