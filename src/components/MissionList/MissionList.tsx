import React, { useEffect, useState } from "react";
import "./MissionList.css";
import { Mission } from "../../types/mission";

interface MissionListProps {
  apiKey: string;
  baseUrl: string;
  refresh: boolean;
  missionId: string;
}

const MissionList: React.FC<MissionListProps> = ({
  apiKey,
  baseUrl,
  refresh,
}) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res = await fetch(`${baseUrl}/${apiKey}`);
        if (!res.ok) throw new Error("Failed to fetch missions");
        const data = await res.json();
        setMissions(data);
      } catch (error) {
        setError("Failed to load missions");
      }
    };
    fetchMissions();
  }, [refresh, baseUrl, apiKey]);

  const handleDelete = async (missionId: string) => {
    try {
      const response = await fetch(`${baseUrl}/${apiKey}/${missionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorMessage = `Failed to delete mission. Status code: ${response.status}`;
        throw new Error(errorMessage);
      }

      setMissions((prevMissions) =>
        prevMissions.filter((m) => m._id !== missionId)
      );
    } catch (error) {
      setError("Failed to delete mission");
    }
  };

  const handleStatusUpdate = async (
    missionId: string,
    currentStatus: Mission["status"]
  ) => {
    let newStatus: Mission["status"] | null = null;
    if (currentStatus === "Pending") newStatus = "In Progress";
    else if (currentStatus === "In Progress") newStatus = "Completed";

    if (newStatus) {
      try {
        await fetch(`${baseUrl}/${apiKey}/progress/${missionId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        setMissions((prevMissions) =>
          prevMissions.map((m) =>
            m._id === missionId ? { ...m, status: newStatus } : m
          )
        );
      } catch {
        setError("Failed to update status");
      }
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="mission-list">
      <h2>Military Missions</h2>
      <ul>
        {missions.map((mission) => (
          <li
            key={mission._id}
            className={`mission-item ${mission.status.toLowerCase()}`}
          >
            <h3>{mission.name}</h3>
            <p>Status: {mission.status}</p>
            <p>Priority: {mission.priority}</p>
            <p>Description: {mission.description}</p>
            <button
              className="delete-btn"
              onClick={() => handleDelete(mission._id)}
            >
              Delete
            </button>
            {mission.status === "Pending" && (
              <button
                className="start-btn"
                onClick={() => handleStatusUpdate(mission._id, mission.status)}
              >
                Start
              </button>
            )}
            {mission.status === "In Progress" && (
              <button
                className="complete-btn"
                onClick={() => handleStatusUpdate(mission._id, mission.status)}
              >
                Complete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MissionList;
