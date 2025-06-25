import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { User, Mail, BadgeCheck } from "lucide-react";

const ManagerTeam = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axiosInstance.get("/manager/team");
        setTeam(res.data.data);
      } catch (err) {
        console.error("Failed to fetch team:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) return <div className="text-center mt-10 text-lg font-medium text-gray-600">Loading team data...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold text-indigo-800 mb-8 text-center">👥 Your Team Overview</h2>

      {team.length === 0 ? (
        <p className="text-center text-gray-500">No employees assigned to you yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {team.map((member) => (
            <div
              key={member._id}
              className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <User className="text-indigo-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="w-4 h-4" /> {member.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-full">
                  <BadgeCheck className="w-4 h-4" />
                  {member.userType.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerTeam;
