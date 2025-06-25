// pages/manager/TeamOverview.jsx
import React, { useEffect, useState } from "react";
import TeamMemberCard from "../../components/TeamMemberCard";
import { axiosInstance } from "../../lib/axios";

const TeamOverview = () => {
  const [team, setTeam] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axiosInstance.get("/manager/team");
        setTeam(res.data);
      } catch (err) {
        console.error("Error fetching team:", err);
      }
    };

    fetchTeam();
  }, []);

  const filteredTeam = team.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6">Team Overview</h1>

        <input
          type="text"
          placeholder="Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 mb-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <div className="grid gap-4">
          {filteredTeam.length > 0 ? (
            filteredTeam.map((member) => <TeamMemberCard key={member._id} member={member} />)
          ) : (
            <p className="text-center text-gray-500">No team members found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamOverview;
