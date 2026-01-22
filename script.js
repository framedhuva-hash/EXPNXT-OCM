document.addEventListener('DOMContentLoaded', function () {

    // Chart 1: Changes over time
    const ctx1 = document.getElementById('changesChart').getContext('2d');

    // Mock Data for Changes Chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

    // Generating random bubble data
    // Generating random bubble data


    // Disable Back Button Logic
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.pushState(null, null, location.href);
    };

    const changesChart = new Chart(ctx1, {
        type: 'bubble',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Breached',
                    data: [
                        { x: 1.5, y: 3.5, r: 12, projects: 8, changes: 14 },
                        { x: 3.2, y: 1.2, r: 6, projects: 2, changes: 4 },
                        { x: 5.8, y: 2.8, r: 10, projects: 5, changes: 12 },
                        { x: 7.1, y: 4.1, r: 5, projects: 1, changes: 3 },
                        { x: 8.5, y: 1.9, r: 14, projects: 9, changes: 15 },
                        { x: 2.1, y: 2.5, r: 7, projects: 3, changes: 6 },
                        { x: 4.5, y: 3.8, r: 11, projects: 7, changes: 13 },
                        { x: 6.2, y: 1.5, r: 4, projects: 2, changes: 2 },
                        { x: 9.3, y: 3.2, r: 9, projects: 6, changes: 11 },
                        { x: 0.8, y: 4.5, r: 6, projects: 2, changes: 5 }
                    ],
                    backgroundColor: 'rgba(67, 24, 255, 0.6)', // Purple
                    borderColor: 'rgba(67, 24, 255, 1)',
                    borderWidth: 1
                },
                {
                    label: 'SLA Met',
                    data: [
                        { x: 1.2, y: 2.2, r: 5, projects: 2, changes: 3 },
                        { x: 2.8, y: 4.2, r: 13, projects: 8, changes: 14 },
                        { x: 4.1, y: 1.8, r: 7, projects: 3, changes: 5 },
                        { x: 5.5, y: 3.5, r: 11, projects: 7, changes: 12 },
                        { x: 6.9, y: 2.9, r: 6, projects: 2, changes: 4 },
                        { x: 8.2, y: 4.0, r: 10, projects: 6, changes: 11 },
                        { x: 9.5, y: 1.5, r: 8, projects: 4, changes: 7 },
                        { x: 0.5, y: 3.1, r: 12, projects: 8, changes: 13 },
                        { x: 3.8, y: 2.5, r: 5, projects: 1, changes: 2 },
                        { x: 7.5, y: 3.0, r: 9, projects: 5, changes: 11 },
                        { x: 2.2, y: 1.2, r: 4, projects: 2, changes: 3 },
                        { x: 5.1, y: 4.4, r: 14, projects: 9, changes: 15 },
                        { x: 8.8, y: 2.2, r: 6, projects: 3, changes: 5 },
                        { x: 1.9, y: 3.8, r: 10, projects: 6, changes: 12 },
                        { x: 6.5, y: 1.1, r: 5, projects: 2, changes: 4 }
                    ],
                    backgroundColor: 'rgba(5, 205, 153, 0.6)', // Green
                    borderColor: 'rgba(5, 205, 153, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            onClick: (e) => {
                const points = changesChart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
                if (points.length) {
                    const firstPoint = points[0];
                    const datasetIndex = firstPoint.datasetIndex;
                    const dataIndex = firstPoint.index;

                    // Get Data
                    const dataset = changesChart.data.datasets[datasetIndex];
                    const pointData = dataset.data[dataIndex];
                    const isBreached = dataset.label === 'Breached';

                    // Populate Table
                    const tbody = document.getElementById('flipTableBody');
                    tbody.innerHTML = '';

                    // Generate Synthetic Rows based on bubble size (changes count)
                    const changesCount = pointData.changes;

                    for (let i = 0; i < changesCount; i++) {
                        const row = document.createElement('tr');

                        const id = `CHG${Math.floor(Math.random() * 100000)}`;

                        // Priority
                        const priorities = ['P1', 'P2', 'P3'];
                        const priorityVal = priorities[Math.floor(Math.random() * priorities.length)];
                        let priorityClass = 'pill-p1';
                        if (priorityVal === 'P2') priorityClass = 'pill-p2';
                        if (priorityVal === 'P3') priorityClass = 'pill-p3';

                        // Project
                        const projects = ['Application', 'Network', 'Database', 'Infra'];
                        const project = projects[Math.floor(Math.random() * projects.length)];

                        // Status
                        const states = ['In Progress', 'Resolved', 'Open'];
                        const stateVal = states[Math.floor(Math.random() * states.length)];
                        let stateClass = 'pill-open'; // Default Open/Yellowish
                        if (stateVal === 'Resolved') stateClass = 'pill-resolved'; // Green
                        if (stateVal === 'In Progress') stateClass = 'pill-progress'; // Blue

                        // SLA Status
                        const slaStatus = isBreached ? 'Breached' : 'Met';
                        let slaClass = isBreached ? 'pill-breached' : 'pill-met';

                        row.innerHTML = `
                             <td><a href="#" class="incident-link">${id}</a></td>
                             <td><span class="pill ${priorityClass}">${priorityVal}</span></td>
                             <td>${project}</td>
                             <td><span class="pill ${stateClass}">${stateVal}</span></td>
                             <td><span class="pill ${slaClass}">${slaStatus}</span></td>
                         `;
                        tbody.appendChild(row);
                    }

                    // Flip Card
                    document.getElementById('flipCardInner').classList.add('flipped');
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: 10,
                    ticks: {
                        stepSize: 1,
                        callback: function (value, index, values) {
                            return months[Math.floor(value)] || '';
                        }
                    },
                    grid: {
                        display: true,
                        drawBorder: false,
                        color: '#E0E5F2',
                        borderDash: [5, 5]
                    }
                },
                y: {
                    min: 0,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: function (value) {
                            const levels = ['', '1st', '2nd', '3rd', '4th'];
                            return levels[value] || '';
                        }
                    },
                    grid: {
                        color: '#E0E5F2',
                        borderDash: [5, 5]
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Custom legend in HTML
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: '#fff',
                    titleColor: '#2B3674',
                    bodyColor: '#A3AED0',
                    borderColor: '#E0E5F2',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: true,
                    callbacks: {
                        label: function (context) {
                            const data = context.raw;
                            return [
                                `Status: ${context.dataset.label}`,
                                `Projects: ${data.projects}`,
                                `Changes: ${data.changes}`
                            ];
                        }
                    }
                }
            }
        }
    });

    // Flip Back Handler (Changes Chart)
    const flipBackBtn = document.getElementById('flipBackBtn');
    if (flipBackBtn) {
        flipBackBtn.addEventListener('click', function () {
            document.getElementById('flipCardInner').classList.remove('flipped');
        });
    }

    // Flip Back Handler (Location Chart)
    const locationFlipBackBtn = document.getElementById('locationFlipBackBtn');
    if (locationFlipBackBtn) {
        locationFlipBackBtn.addEventListener('click', function () {
            const flipContainer = document.getElementById('locationFlipInner');
            if (flipContainer) flipContainer.classList.remove('flipped');
        });
    }

    // Chart 2: Location Impact
    const ctx2 = document.getElementById('locationChart').getContext('2d');

    // Data points from image approx:
    // Bangalore: High impact, High incidents (Big bubble, top left) -> x=0, y=45, r=15
    // Chennai: Medium incidents -> x=1, y=30, r=10
    // Hyderabad: Medium-Low -> x=2, y=25, r=10
    // Pune: Low incidents -> x=3, y=15, r=8
    // Mumbai: Low incidents -> x=4, y=20, r=9

    const locations = ['Bangalore', 'Chennai', 'Hyderabad\nLocation', 'Pune', 'Mumbai'];

    const locationChart = new Chart(ctx2, {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'Impact',
                data: [
                    { x: 1, y: 45, r: 15 },
                    { x: 2, y: 30, r: 10 },
                    { x: 3, y: 25, r: 12 }, // Hyderabad
                    { x: 4, y: 15, r: 8 },
                    { x: 5, y: 20, r: 10 }
                ],
                backgroundColor: '#1B64F2',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    min: 0,
                    max: 6,
                    ticks: {
                        stepSize: 1,
                        callback: function (value) {
                            const labels = ['', 'Bangalore', 'Chennai', 'Hyderabad\nLocation', 'Pune', 'Mumbai'];
                            // ChartJS doesn't support multiline via \n in string array easily by default in all versions, but let's try
                            // Arrays work in newer versions
                            if (value === 3) return ['Hyderabad', 'Location'];
                            return labels[value] || '';
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    min: 10,
                    max: 50,
                    title: {
                        display: true,
                        text: 'Number of Changes',
                        color: '#A3AED0',
                        font: { size: 12, weight: 500 }
                    },
                    grid: {
                        borderDash: [5, 5],
                        color: '#E0E5F2'
                    }
                }
            },
            onClick: (e) => {
                const points = locationChart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
                if (points.length) {
                    const firstPoint = points[0];
                    const datasetIndex = firstPoint.datasetIndex;
                    const dataIndex = firstPoint.index;

                    const pointData = locationChart.data.datasets[datasetIndex].data[dataIndex];

                    // Determine Location Name
                    const locationNames = ['Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Mumbai'];
                    const locationName = locationNames[pointData.x - 1] || 'Unknown';
                    const totalChanges = pointData.y;

                    // Flip the Card
                    const flipContainer = document.getElementById('locationFlipInner');
                    if (flipContainer) flipContainer.classList.add('flipped');

                    // Populate Data
                    const tbody = document.getElementById('locationFlipTableBody');
                    if (tbody) {
                        tbody.innerHTML = '';

                        const projects = ['Network Upgrade', 'Database Migration', 'App Deployment', 'Security Patch', 'Server Maintenance'];

                        // Synthetic distribution: 3 rows
                        const share1 = Math.floor(totalChanges * 0.5);
                        const share2 = Math.floor(totalChanges * 0.3);
                        const share3 = totalChanges - share1 - share2;

                        const shares = [share1, share2, share3];

                        shares.forEach((share, idx) => {
                            let impactLabel = 'Low';
                            let impactClass = 'pill-met';

                            if (share > 10) {
                                impactLabel = 'High';
                                impactClass = 'pill-breached';
                            } else if (share > 5) {
                                impactLabel = 'Medium';
                                impactClass = 'pill-risk';
                            }

                            const project = projects[(dataIndex + idx) % projects.length];

                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${locationName}</td>
                                <td>${share}</td>
                                <td><span class="pill ${impactClass}">${impactLabel}</span></td>
                                <td>${project}</td>
                             `;
                            tbody.appendChild(row);
                        });
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    // Chart 3: Priority Wise Change (Donut)
    const ctx3 = document.getElementById('priorityChart').getContext('2d');
    const priorityChart = new Chart(ctx3, {
        type: 'pie', // Using Pie to match image look which is a pie with white borders
        data: {
            labels: ['28.4%', '27.7%', '34.7%', '9.2%'], // Hardcoded labels as per image
            datasets: [{
                data: [28.4, 27.7, 34.7, 9.2],
                backgroundColor: [
                    '#FF5B5B', // Red
                    '#05CD99', // Green
                    '#FFB547', // Orange
                    '#00C4DF'  // Cyan/Blue
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Text is inside the pie slices in the image
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.parsed + '%';
                        }
                    }
                }
            }
        },
        plugins: [{
            id: 'textInside',
            afterDatasetsDraw(chart, args, pluginOptions) {
                const { ctx, data } = chart;
                chart.data.datasets.forEach((dataset, i) => {
                    chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
                        const { x, y } = datapoint.tooltipPosition();

                        // Simple text drawing logic
                        const text = data.labels[index];
                        const value = dataset.data[index] + '%';

                        // Split text for 2 lines
                        const lines = value.split(' ');

                        ctx.save();
                        ctx.font = 'bold 12px Poppins';
                        ctx.fillStyle = '#fff';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(text, x, y);
                        ctx.restore();
                    });
                });
            }
        }]
    });

    // Logic for Projects with Change Timeline
    renderTimeline();
});

function renderTimeline() {
    const container = document.getElementById('projectsTimeline');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Config: 0 = Jan start, 11 = Dec end
    const projects = [
        { name: 'Project A', start: 1, changes: [1, 3, 7], breach: 8 }, // 1=Feb, 3=Apr, 7=Aug, 8=Sep
        { name: 'Project B', start: 0.5, changes: [0.5, 3, 6], breach: 8.5 },
        { name: 'Project C', start: 1, changes: [1, 3, 6], breach: 7.5 },
        { name: 'Project D', start: 1, changes: [1, 2.5, 5], breach: 7 },
        { name: 'Project E', start: 1, changes: [1, 4], breach: 5.5 }
    ];

    let html = '';

    // Generate Rows
    projects.forEach(proj => {
        // Find min and max for line length
        const min = Math.min(proj.start, ...proj.changes);
        const max = proj.breach;

        // Convert to percentage (12 months = 100%)
        // 0 = 0%, 11 = 100% roughly. Let's say 12 units?
        // Let's assume space is 0 to 11.

        const getLeft = (val) => (val / 11) * 100;

        const lineLeft = getLeft(min);
        const lineWidth = getLeft(max) - lineLeft;

        // Generate Change Dots
        let dotsHtml = '';
        proj.changes.forEach(val => {
            dotsHtml += `<div class="timeline-dot" style="left: ${getLeft(val)}%" title="Change"></div>`;
        });

        // Generate Breach Dot
        const breachHtml = `<div class="timeline-dot alert" style="left: ${getLeft(proj.breach)}%" title="Breached"><i class="fa-solid fa-circle-exclamation"></i></div>`;

        html += `
            <div class="timeline-row">
                <div class="timeline-label">${proj.name}</div>
                <div class="timeline-track">
                     <div class="timeline-line" style="left: ${lineLeft}%; width: ${lineWidth}%"></div>
                     ${dotsHtml}
                     ${breachHtml}
                </div>
            </div>
        `;
    });

    // Generate Axis
    let axisHtml = '<div class="timeline-axis">';
    months.forEach(m => {
        axisHtml += `<span>${m}</span>`;
    });
    axisHtml += '</div>';

    container.innerHTML = html + axisHtml;
}
