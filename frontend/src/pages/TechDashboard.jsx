import { Link } from 'react-router-dom';

const TechDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Technician Dashboard</h1>
      <Link to="/patient-entry" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
        + New Patient
      </Link>
    </div>
  );
};

export default TechDashboard;