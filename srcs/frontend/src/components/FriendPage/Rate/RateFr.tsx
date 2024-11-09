"use client";
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin
import classes from './RateFr.module.css';

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});

// Sample data for years and corresponding numbers
const chartData = [30, 15, 90, 65, 20]; // Numerical values for the y-axis

// Get min and max values from the data array
const minValue = Math.min(...chartData) - Math.min(...chartData)/5;
const maxValue = Math.max(...chartData) + Math.max(...chartData)/5;

const data = {
  labels: ['2019', '2020', '2021', '2022', '2023'], // Years for the x-axis
  datasets: [
    {
      label: 'Performance over Years', // Label for the dataset
      data: chartData, // Numerical values for the y-axis
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // Background color for the line
      borderColor: 'rgba(0, 0, 0, 0.6)', // Line color
      borderWidth: 2,
      fill: true, // Fill the area under the line
      tension: 0.4, // Adds some curve to the line
    },
  ],
};

// Chart options
const options = {
  responsive: true, // Ensure the chart is responsive
  maintainAspectRatio: false, // Disable the default aspect ratio so it takes 100% of the container
  scales: {
    x: {
      title: {
        display: true,
      },
    },
    y: {
      title: {
        display: true,
      },
      min: minValue, // Set min from data
      max: maxValue, // Set max from data
      ticks: {
        stepSize: 1, // Interval between ticks (optional, can be adjusted or removed)
      },
    },
  },
  plugins: {
    legend: {
      display: true, // Show legend
    },
    datalabels: {
      color: 'black', // Text color for the labels
      formatter: (value) => {
        return value; // Return the actual value to display in the chart
      },
      anchor: 'end', // Position the label at the end of the data point
      align: 'top',  // Align the label above the data point
    },
  },
};

const RateFr = () => {
  return (
    <div className={classes.container}>
      <Line data={data} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
}

export default RateFr;
