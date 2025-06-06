import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import SideScrollingShooterGame from "./SideScrollingShooterGame";

interface ProfileData {
    name: string;
    email: string;
    bio: string;
    twitter: string;
    linkedin: string;
    avatarUrl: string;
}

function Profile() {
    const [editMode, setEditMode] = useState(false);

    const [profileBackup, setProfileBackup] = useState<ProfileData | null>(
        null,
    );

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [twitter, setTwitter] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [avatarUrl, setAvatarUrl] = useState(
        "https://via.placeholder.com/100?text=Default",
    );

    const [tempAvatar, setTempAvatar] = useState(avatarUrl);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const availableAvatars = [
        "https://www.sueddeutsche.de/2022/06/20/20f13250-8838-4f58-8483-ea1c53b7eefe.jpeg?q=60&fm=webp&width=1200&rect=0%2C447%2C1100%2C620",
        "https://i.pinimg.com/736x/0a/cd/1e/0acd1ec582097bbaf4ba3ad65e84e0c8.jpg",
        "https://wallpapers.com/images/hd/close-up-face-of-spongebob-z9s2xyajmh1fah8l.jpg",
        "https://i.pinimg.com/736x/a0/31/65/a031656761e3482583d38a8d4e4547d4.jpg",
    ];

    const [showMiniGame, setShowMiniGame] = useState(false);

    const [confirmationMessage, setConfirmationMessage] = useState("");

    useEffect(() => {
        const storedName = localStorage.getItem("profile_name");
        const storedEmail = localStorage.getItem("profile_email");
        const storedBio = localStorage.getItem("profile_bio");
        const storedTwitter = localStorage.getItem("profile_twitter");
        const storedLinkedin = localStorage.getItem("profile_linkedin");
        const storedAvatar = localStorage.getItem("profile_avatar");

        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
        if (storedBio) setBio(storedBio);
        if (storedTwitter) setTwitter(storedTwitter);
        if (storedLinkedin) setLinkedin(storedLinkedin);
        if (storedAvatar) {
            setAvatarUrl(storedAvatar);
            setTempAvatar(storedAvatar);
        }
    }, []);

    const handleEdit = () => {
        setProfileBackup({ name, email, bio, twitter, linkedin, avatarUrl });
        setEditMode(true);
    };

    const handleCancel = () => {
        if (profileBackup !== null) {
            setName(profileBackup.name);
            setEmail(profileBackup.email);
            setBio(profileBackup.bio);
            setTwitter(profileBackup.twitter);
            setLinkedin(profileBackup.linkedin);
            setAvatarUrl(profileBackup.avatarUrl);
            setTempAvatar(profileBackup.avatarUrl);
        }
        setEditMode(false);
    };

    const handleSave = () => {
        const avatarChanged = avatarUrl !== tempAvatar;
        localStorage.setItem("profile_name", name);
        localStorage.setItem("profile_email", email);
        localStorage.setItem("profile_bio", bio);
        localStorage.setItem("profile_twitter", twitter);
        localStorage.setItem("profile_linkedin", linkedin);
        localStorage.setItem("profile_avatar", tempAvatar);
        setAvatarUrl(tempAvatar);
        setConfirmationMessage("Profil wurde gespeichert!");
        setEditMode(false);
        if (avatarChanged) {
            setShowMiniGame(true);
        }

        setTimeout(() => setConfirmationMessage(""), 5000);
    };

    const closeMiniGame = () => setShowMiniGame(false);
    const handleWin = () => {
        setConfirmationMessage("Glückwunsch! Du hast gewonnen!");
        setTimeout(() => setConfirmationMessage(""), 5000);
    };
    const handleLose = () => {
        setConfirmationMessage("Game Over!");
        setTimeout(() => setConfirmationMessage(""), 5000);
    };

    const miniGameModal = (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="rounded bg-white p-4 shadow-lg">
                <SideScrollingShooterGame
                    onWin={handleWin}
                    onLose={handleLose}
                    onClose={closeMiniGame}
                    avatarUrl={avatarUrl}
                />
            </div>
        </div>
    );

    const avatarModal = (
        <div className="bg-opacity-30 fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-lg">
            <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
                <h2 className="mb-4 text-center text-2xl font-bold">
                    Avatar auswählen
                </h2>
                <div className="mb-4 grid grid-cols-2 gap-4">
                    {availableAvatars.map((url) => (
                        <img
                            key={url}
                            src={url}
                            alt="Avatar Auswahl"
                            className={`h-24 w-24 cursor-pointer rounded-full border-4 ${
                                tempAvatar === url
                                    ? "border-blue-600"
                                    : "border-transparent"
                            }`}
                            onClick={() => {
                                setTempAvatar(url);
                                setShowAvatarModal(false);
                            }}
                        />
                    ))}
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={() => {
                            setTempAvatar(avatarUrl);
                            setShowAvatarModal(false);
                        }}
                        className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
                    >
                        Abbrechen
                    </button>
                </div>
            </div>
        </div>
    );

    const confirmationOverlay =
        confirmationMessage &&
        ReactDOM.createPortal(
            <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 transform rounded bg-green-100 px-4 py-2 text-green-800 shadow">
                {confirmationMessage}
            </div>,
            document.body,
        );

    if (!editMode) {
        return (
            <>
                {confirmationOverlay}
                <div className="mx-auto max-w-2xl p-6">
                    <h1 className="mb-6 text-3xl font-bold">Dein Profil</h1>
                    <div className="mb-6">
                        <div className="flex justify-center">
                            <img
                                src={avatarUrl}
                                alt="Profilbild"
                                className="h-24 w-24 rounded-full border-4 border-blue-600"
                            />
                        </div>
                        <p className="mt-4 text-center text-2xl font-semibold">
                            {name || "Name nicht gesetzt"}
                        </p>
                        <div className="mt-4 rounded-md border bg-gray-50 p-4">
                            <p className="text-base">
                                <strong>Biografie:</strong>{" "}
                                {bio || "Keine Biografie hinterlegt"}
                            </p>
                        </div>
                        <div className="mt-4">
                            <p className="mb-1 text-base">
                                <strong>E-Mail:</strong>{" "}
                                {email || "Nicht gesetzt"}
                            </p>
                            <p className="mb-1 text-base">
                                <strong>Twitter:</strong>{" "}
                                {twitter || "Nicht gesetzt"}
                            </p>
                            <p className="mb-1 text-base">
                                <strong>LinkedIn:</strong>{" "}
                                {linkedin || "Nicht gesetzt"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleEdit}
                        className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                    >
                        Profil bearbeiten
                    </button>
                    {showMiniGame &&
                        ReactDOM.createPortal(miniGameModal, document.body)}
                </div>
            </>
        );
    }

    return (
        <>
            {confirmationOverlay}
            <div className="mx-auto max-w-2xl p-6">
                <h1 className="mb-6 text-3xl font-bold">Profil bearbeiten</h1>
                <div className="mb-6">
                    <div className="mb-4 flex flex-col items-center">
                        <img
                            src={tempAvatar}
                            alt="Profilbild"
                            className="h-24 w-24 rounded-full border-4 border-blue-600"
                        />
                        <button
                            onClick={() => setShowAvatarModal(true)}
                            className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Bild ändern
                        </button>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Dein Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="bio"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Biografie
                        </label>
                        <textarea
                            id="bio"
                            placeholder="Erzähl uns etwas über dich..."
                            rows={6}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        ></textarea>
                    </div>
                    <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                E-Mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Deine E-Mail-Adresse"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="twitter"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Twitter
                            </label>
                            <input
                                type="text"
                                id="twitter"
                                placeholder="Twitter-Handle"
                                value={twitter}
                                onChange={(e) => setTwitter(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="linkedin"
                                className="block text-sm font-medium text-gray-700"
                            >
                                LinkedIn
                            </label>
                            <input
                                type="text"
                                id="linkedin"
                                placeholder="LinkedIn Profil URL"
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex space-x-4">
                    <button
                        onClick={handleSave}
                        className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                    >
                        Profil speichern
                    </button>
                    <button
                        onClick={handleCancel}
                        className="rounded-md bg-gray-400 px-6 py-3 text-gray-800 hover:bg-gray-500"
                    >
                        Abbrechen
                    </button>
                </div>
                {showMiniGame &&
                    ReactDOM.createPortal(miniGameModal, document.body)}
                {showAvatarModal &&
                    ReactDOM.createPortal(avatarModal, document.body)}
            </div>
        </>
    );
}

export default Profile;
