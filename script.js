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

    // Flip Back Handler (Priority Chart)
    const priorityFlipBackBtn = document.getElementById('priorityFlipBackBtn');
    if (priorityFlipBackBtn) {
        priorityFlipBackBtn.addEventListener('click', function () {
            const flipContainer = document.getElementById('priorityFlipInner');
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
            onClick: (e, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const chart = e.chart; // Access chart instance from event

                    // Flip the Card
                    const flipContainer = document.getElementById('priorityFlipInner');
                    if (flipContainer) flipContainer.classList.add('flipped');

                    // Populate Data
                    const tbody = document.getElementById('priorityFlipTableBody');
                    if (tbody) {
                        tbody.innerHTML = '';
                        const priorities = ['P1', 'P2', 'P3', 'P4'];

                        // Get Percentage for row count
                        const percentage = chart.data.datasets[0].data[index];
                        // Heuristic: 1 row for every ~4-5% to keep it reasonable, or as requested
                        // User accepted "percentage / 3" in plan, but let's try /4 to avoid too many rows (28/3 = ~9 rows)
                        // Actually let's do Math.max(3, Math.round(percentage / 4)) to ensure at least some rows.
                        // Let's stick to a factor that looks good. 
                        const rowsCount = Math.max(3, Math.round(percentage / 4));

                        // Generate synthetic rows
                        for (let i = 0; i < rowsCount; i++) {
                            const row = document.createElement('tr');
                            const id = `CHG${Math.floor(Math.random() * 90000) + 10000}`;
                            const projects = ['Network', 'Database', 'Cloud Ops', 'Security', 'Frontend'];
                            const project = projects[Math.floor(Math.random() * projects.length)];
                            const descriptions = [
                                'Database optimization',
                                'Firewall rule update',
                                'Server patch deployment',
                                'Load balancer config',
                                'User access review'
                            ];
                            const description = descriptions[Math.floor(Math.random() * descriptions.length)];
                            const statuses = ['In Progress', 'Scheduled', 'Pending Approval', 'Completed'];
                            const status = statuses[Math.floor(Math.random() * statuses.length)];

                            let statusClass = 'pill-open';
                            if (status === 'Completed') statusClass = 'pill-met';
                            if (status === 'In Progress') statusClass = 'pill-progress';
                            if (status === 'Scheduled') statusClass = 'pill-risk';

                            row.innerHTML = `
                                <td><a href="#" class="incident-link">${id}</a></td>
                                <td>${project}</td>
                                <td>${description}</td>
                                <td><span class="pill ${statusClass}">${status}</span></td>
                            `;
                            tbody.appendChild(row);
                        }
                    }
                }
            },
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
        { name: 'Application', start: 1, changes: [1, 3, 7], breach: 8 },
        { name: 'Network', start: 0.5, changes: [0.5, 3, 6], breach: 8.5 },
        { name: 'Database', start: 1, changes: [1, 3, 6], breach: 7.5 },
        { name: 'Cloud ops', start: 1, changes: [1, 2.5, 5], breach: 7 },
        { name: 'Security', start: 1, changes: [1, 4], breach: 5.5 }
    ];

    let html = '';

    // Generate Rows
    projects.forEach(proj => {
        // Find min and max for line length
        const min = Math.min(proj.start, ...proj.changes);
        const max = proj.breach;

        const getLeft = (val) => (val / 11) * 100;

        const lineLeft = getLeft(min);
        const lineWidth = getLeft(max) - lineLeft;

        // Generate Change Dots
        let dotsHtml = '';
        proj.changes.forEach(val => {
            // Added data attributes and onclick for flip
            dotsHtml += `<div class="timeline-dot" style="left: ${getLeft(val)}%" title="Change" onclick="handleTimelineClick('change', '${proj.name}')"></div>`;
        });

        // Generate Breach Dot
        const breachHtml = `<div class="timeline-dot alert" style="left: ${getLeft(proj.breach)}%" title="Breached" onclick="handleTimelineClick('breached', '${proj.name}')"><i class="fa-solid fa-circle-exclamation"></i></div>`;

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

    // Flip Back Handler (Timeline Chart)
    const timelineFlipBackBtn = document.getElementById('timelineFlipBackBtn');
    if (timelineFlipBackBtn) {
        timelineFlipBackBtn.addEventListener('click', function () {
            const flipContainer = document.getElementById('timelineFlipInner');
            if (flipContainer) flipContainer.classList.remove('flipped');
        });
    }
}

// Global function to handle Timeline Clicks
window.handleTimelineClick = function (type, projectName) {
    const flipContainer = document.getElementById('timelineFlipInner');
    const tableHead = document.getElementById('timelineFlipHead');
    const tableBody = document.getElementById('timelineFlipTableBody');
    const title = document.getElementById('timelineFlipTitle');

    if (!flipContainer || !tableHead || !tableBody) return;

    // Flip the Card
    flipContainer.classList.add('flipped');
    tableBody.innerHTML = '';
    title.innerText = type === 'breached' ? 'Breach Details' : 'Change Details';

    const changeId = `CHG${Math.floor(Math.random() * 90000) + 10000}`;
    const descriptions = ['Database Schema Update', 'Firewall Configuration', 'Application Deployment', 'Load Balancer Adjustment', 'Security Patch installation'];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];

    if (type === 'change') {
        // Change ID, Project, Description, Start Date, End Date, Root Cause
        tableHead.innerHTML = `
            <tr>
                <th>Change ID</th>
                <th>Project</th>
                <th>Description</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Root Cause</th>
            </tr>
        `;

        // Generate Dates
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() - Math.floor(Math.random() * 10));
        const end = new Date(start);
        end.setDate(start.getDate() + 2);

        const startDateStr = start.toLocaleDateString();
        const endDateStr = end.toLocaleDateString();

        // Root Cause
        const rootCauses = ['Firmware Update', 'Policy Change', 'Capacity Addition', 'Bug Fix', 'Routine Maintenance'];
        const rootCause = rootCauses[Math.floor(Math.random() * rootCauses.length)];

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#" class="incident-link">${changeId}</a></td>
            <td>${projectName}</td>
            <td>${description}</td>
            <td>${startDateStr}</td>
            <td>${endDateStr}</td>
            <td>${rootCause}</td>
        `;
        tableBody.appendChild(row);

    } else if (type === 'breached') {
        // Change ID, Project, Description, Start Date, End Date, Breached Duration
        tableHead.innerHTML = `
            <tr>
                <th>Change ID</th>
                <th>Project</th>
                <th>Description</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Duration</th>
            </tr>
        `;

        // Generate Dates
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() - Math.floor(Math.random() * 10)); // Start in last 10 days
        const end = new Date(start);
        end.setDate(start.getDate() + 2); // End 2 days later

        const startDateStr = start.toLocaleDateString();
        const endDateStr = end.toLocaleDateString();
        const duration = Math.floor(Math.random() * 5) + 2 + ' hrs'; // Random duration 2-7 hrs

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#" class="incident-link">${changeId}</a></td>
            <td>${projectName}</td>
            <td>${description}</td>
            <td>${startDateStr}</td>
            <td>${endDateStr}</td>
            <td><span class="pill pill-breached">${duration}</span></td>
        `;
        tableBody.appendChild(row);
    }
};

// Change Management Flip Logic
window.handleChangeMgmtFlip = function () {
    const flipContainer = document.getElementById('changeMgmtFlipInner');
    const contentBody = document.getElementById('changeMgmtActionsBody');

    if (flipContainer && contentBody) {
        flipContainer.classList.add('flipped');

        // Populate Content
        contentBody.innerHTML = `
            <div style="margin-bottom: 15px;">
                <h4 style="margin: 0 0 5px 0; color: #d32f2f;">Critical: High Latency in APAC Region</h4>
                <p style="margin: 0; font-size: 13px; color: #555;">Recurring issue causing 15% slow-down in transaction processing.</p>
            </div>
            <h5 style="margin: 10px 0 5px 0; color: #4318FF;">Recommended Actions:</h5>
            <ul style="padding-left: 20px; margin: 0; font-size: 13px;">
                <li style="margin-bottom: 5px;">Reroute traffic via secondary gateway node.</li>
                <li style="margin-bottom: 5px;">Investigate ISP peering congestion at Singapore hub.</li>
                <li style="margin-bottom: 5px;">Scale up load balancer capacity by 20%.</li>
            </ul>
        `;
    }
}

// Back Button for Change Mgmt
document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.getElementById('changeMgmtFlipBackBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            const flipContainer = document.getElementById('changeMgmtFlipInner');
            if (flipContainer) flipContainer.classList.remove('flipped');
        });
    }
});
