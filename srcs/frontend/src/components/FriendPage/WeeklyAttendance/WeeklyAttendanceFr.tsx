"use client";
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin
import classes from './WeeklyAttendanceFr.module.css';

const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), {
  ssr: false,
});

// Sample data for wins and losses
const matches = { win: 15, lose: 10 }; // Example match data
const data = {
  labels: ['Wins', 'Losses'], // Use descriptive labels
  datasets: [
    {
      label: 'Game Results',
      data: [matches.win, matches.lose], // Use the actual match data
      backgroundColor: [
        'rgba(0, 0, 0, 0.6)', // Color for Wins
        'rgba(255, 255, 255, 0.6)', // Color for Losses
      ],
      borderColor: 'rgba(0, 0, 0, 0.6)', // Border color for each segment
      borderWidth: 2,
    },
  ],
};

// Chart options
const options = {
  plugins: {
    legend: {
      display: true, // Show legend
    },
    datalabels: {
      color: 'black', // Text color for the labels
      formatter: (value) => {
        return value; // Return the actual value to display in the chart
      },
      anchor: 'center', // Center the label inside the segment
      align: 'center',  // Align the label to the center
    },
  },
};

const WeeklyAttendanceFr = () => {
  return (
    <div className={classes.container}>
      <Pie data={data} options={options} plugins={[ChartDataLabels]} /> {/* Pass the plugin to the Pie chart */}
    </div>
  );
}

export default WeeklyAttendanceFr;
