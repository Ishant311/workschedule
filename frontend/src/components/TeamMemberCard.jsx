// components/TeamMemberCard.jsx
import React from "react";

const TeamMemberCard = ({ member }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-indigo-800">{member.name}</h3>
        <p className="text-sm text-gray-600">{member.email}</p>
        <p className="text-xs mt-1 text-gray-500">Joined: {new Date(member.joinedAt).toLocaleDateString()}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium capitalize">{member.role}</p>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            member.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {member.status}
        </span>
      </div>
    </div>
  );
};

export default TeamMemberCard;
