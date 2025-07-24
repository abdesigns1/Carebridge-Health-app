import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function VitalsChart({ logs }) {
  if (!logs.length) {
    return <p className="text-gray-600 mt-8">No data to display.</p>;
  }

  // Sort logs oldest to newest
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  const labels = sortedLogs.map((log) =>
    new Date(log.created_at).toLocaleDateString()
  );

  const temperatureData = sortedLogs.map((log) =>
    log.temperature !== null ? log.temperature : null
  );

  const heartRateData = sortedLogs.map((log) =>
    log.heart_rate !== null ? log.heart_rate : null
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: temperatureData,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
      },
      {
        label: "Heart Rate (bpm)",
        data: heartRateData,
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Vitals Over Time",
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="bg-white rounded shadow p-4 mt-8">
      <Line options={options} data={data} />
    </div>
  );
}
