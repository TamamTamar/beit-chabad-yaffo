import React from 'react';

const UserAvatar = ({ firstName, lastName }) => {
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

    return (
        <div className="flex items-center justify-center w-10 h-10 bg-[#c28c7f] text-white rounded-full">
            <span className="text-lg font-semibold">{initials}</span>
        </div>
    );
};

export default UserAvatar;
