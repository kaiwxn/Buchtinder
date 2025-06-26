import { useEffect, useState } from "react";

type Friend = {
    id: number;
    name: string;
    createdAt: Date;
    bookCount: number;
};

const BACKUP_PROFILE_IMAGE_SRC =
    "https://as1.ftcdn.net/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg";

function Friends() {
    const [friends, setFriends] = useState<Friend[]>([]);

    const fetchFriends = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:5000/friends/get?user_id=${sessionStorage.getItem("token")}`,
            );
            if (!response.ok) {
                throw new Error("HTTP error! Status: " + response.status);
            }
            const data = await response.json();
            setFriends(data);
        } catch (error) {
            console.error("Error fetching friends:", error);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    return (
        <div className="mt-10 min-h-screen justify-center px-4 sm:px-10 lg:px-60">
            <h1 className="text-4xl">Freunde</h1>
            
            {friends.map((friend, index) => (
                <div key={index}>
                    <div className="mt-5 flex h-24">
                        <div className="avatar flex items-center justify-center">
                            <div className="h-15 w-15 rounded-full">
                                <img
                                    src={BACKUP_PROFILE_IMAGE_SRC}
                                    alt="Cover"
                                />
                            </div>
                        </div>

                        <div className="flex p-5 pb-0">
                            <div>
                                <p className="mb-1 line-clamp-1 text-xl font-medium overflow-ellipsis hover:underline">
                                    {friend.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {friend.bookCount || "Keine"} Bücher,
                                    am {friend.createdAt ? friend.createdAt.toLocaleDateString("de-DE") : "unbekannten Zeitpunkt"} beigetreten.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="divider"/>
                </div>
            ))}
        </div>

    );
}

export default Friends;
