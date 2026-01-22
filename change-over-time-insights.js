document.addEventListener('DOMContentLoaded', function () {

    // Common Chart Options
    Chart.defaults.font.family = 'Poppins';
    Chart.defaults.color = '#A3AED0';

    // Get Category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'Default';

    // Update Title (if element exists, though simple text update might be handled inline in html script too)
    // We can handle it here centrally if we want.

    // Synthetic Data Generator
    // We will define base data and tweak it based on category string hash or map

    const categoryData = {
        'Application Related issue': {
            history: {
                volume: [45, 46, 47, 48, 49, 48, 49, 50, 52],
                approval: [18, 20, 22, 24, 26, 30, 35, 38, 42],
                duration: [10, 10, 11, 11, 12, 12, 13, 13, 14]
            },
            slaBreach: 20,
            slaGauge: [75, 25], // Breached, Remaining
            slaStages: [9.5, 11.2, 8, 5.6],
            riskHigh: true,
            riskGauge: [70, 30], // High, Safe
            riskActual: [2.9, 3.1, 2.5, 3.7],
            riskPredicted: [3.5, 4.0, 3.0, 3.8]
        },
        'End User computing': {
            history: {
                volume: [30, 32, 35, 33, 36, 40, 42, 41, 44],
                approval: [15, 18, 20, 22, 25, 28, 30, 32, 35],
                duration: [8, 9, 8, 9, 10, 9, 11, 10, 10]
            },
            slaBreach: 12,
            slaGauge: [40, 60],
            slaStages: [6.5, 8.2, 5, 4.2],
            riskHigh: false,
            riskGauge: [30, 70],
            riskActual: [1.5, 2.1, 1.8, 2.2],
            riskPredicted: [2.0, 2.5, 2.0, 2.5]
        },
        'VPN Issue': {
            history: {
                volume: [60, 65, 55, 62, 70, 75, 72, 68, 65],
                approval: [40, 45, 38, 42, 50, 55, 52, 48, 45],
                duration: [5, 6, 5, 6, 7, 7, 6, 5, 6]
            },
            slaBreach: 5,
            slaGauge: [15, 85],
            slaStages: [4.0, 5.5, 3.5, 2.8],
            riskHigh: false,
            riskGauge: [45, 55],
            riskActual: [3.5, 2.8, 3.0, 2.5],
            riskPredicted: [3.8, 3.0, 3.2, 2.8]
        },
        'Logon speed': {
            history: {
                volume: [20, 22, 21, 23, 22, 24, 25, 24, 26],
                approval: [10, 12, 11, 13, 12, 14, 15, 14, 16],
                duration: [12, 12, 13, 13, 14, 14, 15, 15, 15]
            },
            slaBreach: 25,
            slaGauge: [60, 40],
            slaStages: [10.5, 12.0, 9.5, 6.0],
            riskHigh: true,
            riskGauge: [65, 35],
            riskActual: [4.0, 3.5, 4.2, 3.8],
            riskPredicted: [4.2, 3.8, 4.5, 4.0]
        },
        'Default': {
            history: {
                volume: [45, 46, 47, 48, 49, 48, 49, 50, 52],
                approval: [18, 20, 22, 24, 26, 30, 35, 38, 42],
                duration: [10, 10, 11, 11, 12, 12, 13, 13, 14]
            },
            slaBreach: 20,
            slaGauge: [75, 25],
            slaStages: [9.5, 11.2, 8, 5.6],
            riskHigh: true,
            riskGauge: [70, 30],
            riskActual: [2.9, 3.1, 2.5, 3.7],
            riskPredicted: [3.5, 4.0, 3.0, 3.8]
        }
    };

    const data = categoryData[category] || categoryData['Default'];

    // Update Text Elements if they exist (simple check)
    const breachText = document.querySelector('.gauge-center-text .gauge-sub');
    if (breachText) breachText.textContent = `${data.slaBreach} hours`;

    const riskText = document.querySelector('#riskGauge + .gauge-center-text .gauge-value');
    if (riskText) riskText.textContent = data.riskHigh ? 'High Risk' : 'Low Risk';


    // 1. History Line Chart
    const ctxHistory = document.getElementById('historyChart').getContext('2d');
    new Chart(ctxHistory, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Dec'],
            datasets: [
                {
                    label: 'Monthly change volume',
                    data: data.history.volume,
                    borderColor: '#FFB547', // Orange
                    backgroundColor: '#FFB547',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 2,
                    tension: 0
                },
                {
                    label: 'Approval rate',
                    data: data.history.approval,
                    borderColor: '#1B64F2', // Blue
                    backgroundColor: '#1B64F2',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 2,
                    tension: 0
                },
                {
                    label: 'Average implementation duration',
                    data: data.history.duration,
                    borderColor: '#A3AED0', // Grey
                    backgroundColor: '#A3AED0',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 2,
                    tension: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false } // Custom legend in HTML
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 80, // Increased max to accommodate variations
                    grid: { color: '#E0E5F2', borderDash: [5, 5] },
                    title: { display: true, text: 'Number of Incidents' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });

    // 2. SLA Gauge (Half Doughnut)
    const ctxSlaGauge = document.getElementById('slaGauge').getContext('2d');
    new Chart(ctxSlaGauge, {
        type: 'doughnut',
        data: {
            labels: ['Breached', 'Remaining'],
            datasets: [{
                data: data.slaGauge,
                backgroundColor: ['#FF5B5B', '#E0E5F2'], // Red, Grey
                borderWidth: 0,
                cutout: '80%',
                circumference: 180,
                rotation: 270
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        }
    });

    // 3. SLA Horizontal Bar
    const ctxSlaBar = document.getElementById('slaBar').getContext('2d');
    new Chart(ctxSlaBar, {
        type: 'bar',
        indexAxis: 'y',
        data: {
            labels: ['Review', 'Implement', 'Authorize', 'Assess'],
            datasets: [{
                data: data.slaStages,
                backgroundColor: ['#FFB547', '#A3AED0', '#FFB547', '#1B64F2'], // Orange list, Blue
                barThickness: 10,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { display: true, borderDash: [5, 5] },
                    max: 15
                },
                y: {
                    grid: { display: false }
                }
            }
        }
    });

    // 4. Risk Gauge (Full Doughnut)
    const riskColor = data.riskHigh ? '#d33535' : '#05CD99'; // Red for high, Green for low
    const ctxRiskGauge = document.getElementById('riskGauge').getContext('2d');
    new Chart(ctxRiskGauge, {
        type: 'doughnut',
        data: {
            labels: ['Risk Level', 'Safe'],
            datasets: [{
                data: data.riskGauge,
                backgroundColor: [riskColor, '#E0E5F2'],
                borderWidth: 0,
                cutout: '80%',
                circumference: 180,
                rotation: 270
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        }
    });

    // 5. Risk Bar Chart
    const ctxRiskBar = document.getElementById('riskBar').getContext('2d');
    new Chart(ctxRiskBar, {
        type: 'bar',
        data: {
            labels: ['Infrastructure', 'Application', 'Database', 'Network'],
            datasets: [
                {
                    label: 'Actual Risk',
                    data: data.riskActual,
                    backgroundColor: '#A3AED0', // Grey
                    barThickness: 15,
                    borderRadius: 3
                },
                {
                    label: 'Predicted Risk',
                    data: data.riskPredicted,
                    backgroundColor: '#FFB547',
                    barThickness: 15,
                    borderRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { display: true, borderDash: [5, 5] },
                    max: 5
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });

});
