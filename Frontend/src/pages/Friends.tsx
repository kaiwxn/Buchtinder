import { useEffect, useState } from "react";

import { USER_ID } from "./Login/Login";

type Friend = {
    id: number;
    name: string;
    createdAt: Date;
    bookCount: number;
};

function Friends(){

    const [friends, setFriends] = useState<Friend[]>([]);

    const fetchFriends = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/friends/get?user_id=${USER_ID}`);
            if (!response.ok) {
                throw new Error('HTTP error! Status: ' + response.status);
            }
            const data = await response.json();
            setFriends(data);
        }
        catch (error) {
            console.error('Error fetching friends:', error);
        }
    }

    useEffect(() => {
        fetchFriends();
    }, []);

    return (
        <div className="px-4 sm:px-10 lg:px-60 justify-center min-h-screen mt-10">
            <h1 className="text-4xl">Freunde</h1>
            <p>Das sind deine Freunde:</p>
            <ul className="mt-6">
                {friends.map(friend => (
                    <li key={friend.id} className="py-2 border-b">
                        Name: {friend.name}
                        
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Friends;