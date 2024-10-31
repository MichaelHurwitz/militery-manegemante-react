import React, { useEffect, useState } from 'react';
import './MissionList.css';
import {Mission} from '../../types/mission'

interface MissionListProps {
  apiKey: string;
  baseUrl: string;
  refresh: boolean;
}

const MissionList: React.FC<MissionListProps> = ({ apiKey, baseUrl, refresh }) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res = await fetch(`${baseUrl}/${apiKey}`);
        if (!res.ok) throw new Error('Failed to fetch missions');
        const data = await res.json();
        setMissions(data);
      } catch (error) {
        setError('Failed to load missions');
      }
    };
    fetchMissions();
  }, [refresh, baseUrl, apiKey]);

  const handleDelete = async (missionId: string) => {
    try {
      await fetch(`${baseUrl}/${apiKey}/${missionId}`, {
        method: 'DELETE',
      });
      setMissions((prevMissions) => prevMissions.filter((m) => m.id !== missionId));
    } catch {
      setError('Failed to delete mission');
    }
  };

  const handleStatusUpdate = async (missionId: string, newStatus: Mission['status']) => {
    try {
      await fetch(`${baseUrl}/${apiKey}/progress/${missionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setMissions((prevMissions) =>
        prevMissions.map((m) => (m.id === missionId ? { ...m, status: newStatus } : m))
      );
    } catch {
      setError('Failed to update status');
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="mission-list">
      <h2>Military Missions</h2>
      <ul>
        {missions.map((mission) => (
          <li key={mission.id} className={`mission-item ${mission.status.toLowerCase()}`}>
            <h3>{mission.name}</h3>
            <p>Status: {mission.status}</p>
            <p>Priority: {mission.priority}</p>
            <p>Description: {mission.description}</p>
            <button onClick={() => handleDelete(mission.id)}>Delete</button>
            <button onClick={() => handleStatusUpdate(mission.id, 'In Progress')}>In Progress</button>
            <button onClick={() => handleStatusUpdate(mission.id, 'Completed')}>Completed</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MissionList;
