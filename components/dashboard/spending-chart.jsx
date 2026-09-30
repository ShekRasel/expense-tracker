"use client";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { money, palette } from "@/lib/format";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);
export default function SpendingChart({ data, doughnut = false }) {
  const entries = Object.entries(data);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  const chart = {
    labels: entries.map(([name]) => name),
    datasets: [
      {
        label: "Spending (BDT)",
        data: entries.map(([, value]) => value),
        backgroundColor: entries.map((_, i) => palette[i % palette.length]),
        borderWidth: 0,
        borderRadius: doughnut ? 0 : 6,
        maxBarThickness: 42,
      },
    ],
  };
  const options = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (context) => money(context.raw) } },
    },
    ...(doughnut
      ? { cutout: "78%" }
      : {
          scales: {
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: { color: "#7c8581", font: { size: 11 } },
            },
            y: {
              beginAtZero: true,
              border: { display: false },
              grid: { color: "#f0f2ef" },
              ticks: { color: "#7c8581", maxTicksLimit: 5 },
            },
          },
        }),
  };
  return doughnut ? (
    <div className="distribution">
      <div className="donut">
        <Doughnut
          data={chart}
          options={options}
          aria-label="Spending distribution by category"
          role="img"
        />
        <div className="donut-center">
          <span>Total spent</span>
          <strong>{money(total)}</strong>
        </div>
      </div>
      <div className="chart-legend">
        {entries.map(([name, value], index) => (
          <div key={name}>
            <span>
              <i style={{ background: palette[index % palette.length] }} />
              {name}
            </span>
            <b>{total ? Math.round((value / total) * 100) : 0}%</b>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="bar-chart">
      <Bar
        data={chart}
        options={options}
        aria-label="Expense amounts by category in BDT"
        role="img"
      />
    </div>
  );
}
