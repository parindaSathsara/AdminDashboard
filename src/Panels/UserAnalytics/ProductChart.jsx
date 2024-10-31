import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ProductChart = ({ data }) => {
  const chartRef = useRef(null);
  let chartInstance = null;

  // Process data to handle null product names
  const processedData = data.map(item => ({
    ...item,
    productName: item.productName || `Product ID: ${item.product_id}` // Fallback for null values
    
  }));

  const chartData = {
    labels: processedData.map(item => item.productName),
    datasets: [{
      label: 'Trigger Count',
      data: processedData.map(item => parseInt(item.total_trigger_count)),
      backgroundColor: ['#B22222', '#CB2727', '#DE5151', '#E78484', '#F1B7B7'], 
      borderRadius: 4,
    }]
  };

  const options = {
    indexAxis: 'y', // Makes the chart horizontal
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Count: ${context.raw}`;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Trigger Count'
        },
        beginAtZero: true,
        ticks: {
          stepSize: 5
        }
      },
      y: {
        ticks: {
          callback: function(value) {
            // Truncate long product names
            const label = this.getLabelForValue(value);
            return label.length > 30 ? label.substr(0, 27) + '...' : label;
          }
        }
      }
    }
  };

  useEffect(() => {
    // Get the canvas element
    const ctx = chartRef.current.getContext('2d');

    // Destroy previous chart instance if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Create new chart
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: options
    });

    // Cleanup on component unmount
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [data]); // Dependency on data prop to update when data changes

  return (
    <div style={{ height: '400px', width: '100%', maxWidth: '1000px' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ProductChart;