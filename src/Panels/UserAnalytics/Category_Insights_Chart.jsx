import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Category_Insights_Chart = ({ apiData = [] }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!apiData.length || !chartRef.current) return;

       
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');

        const labels = apiData.map(item => item.maincat_type);
        const values = apiData.map(item => parseInt(item.total_trigger_count));

        chartInstance.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Top clicked categories',
                    data: values,
                    backgroundColor: [
                        '#272757',
                        '#40408E',
                        '#4C4CAA',
                        '#7F7FC6',
                        '#B6B6DE'
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#333',
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    title: {
                        display: true,
                        color: '#333',
                        font: {
                            size: 16
                        }
                    }
                },
                cutout: '60%'
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [apiData]);

    return (

        <div className="relative aspect-square w-50">
            <canvas ref={chartRef} />
        </div>
    );
};

export default Category_Insights_Chart;