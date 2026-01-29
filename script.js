document.addEventListener('DOMContentLoaded', function () {

    // Initialize timestamp display from OCMDataStore
    OCMDataStore.updateTimestampDisplay();

    // Setup refresh button handler
    const refreshBtn = document.getElementById('refreshDataBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function () {
            OCMDataStore.refreshData();
        });
    }

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

                    // Get Data from centralized store
                    const dataset = changesChart.data.datasets[datasetIndex];
                    const isBreached = dataset.label === 'Breached';

                    // Get pre-generated rows from data store
                    const rows = OCMDataStore.getChangesChartRows(datasetIndex, dataIndex);

                    // Populate Table
                    const tbody = document.getElementById('flipTableBody');
                    tbody.innerHTML = '';

                    rows.forEach(rowData => {
                        const row = document.createElement('tr');

                        let priorityClass = 'pill-p1';
                        if (rowData.priority === 'P2') priorityClass = 'pill-p2';
                        if (rowData.priority === 'P3') priorityClass = 'pill-p3';
                        if (rowData.priority === 'P4') priorityClass = 'pill-p3';

                        let stateClass = 'pill-open';
                        if (rowData.state === 'Resolved') stateClass = 'pill-resolved';
                        if (rowData.state === 'In Progress') stateClass = 'pill-progress';
                        if (rowData.state === 'Scheduled') stateClass = 'pill-risk';

                        const slaClass = rowData.slaStatus === 'Breached' ? 'pill-breached' : 'pill-met';

                        row.innerHTML = `
                             <td><a href="#" class="incident-link">${rowData.id}</a></td>
                             <td><span class="pill ${priorityClass}">${rowData.priority}</span></td>
                             <td>${rowData.project}</td>
                             <td><span class="pill ${stateClass}">${rowData.state}</span></td>
                             <td><span class="pill ${slaClass}">${rowData.slaStatus}</span></td>
                         `;
                        tbody.appendChild(row);
                    });

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

                    // Flip the Card
                    const flipContainer = document.getElementById('locationFlipInner');
                    if (flipContainer) flipContainer.classList.add('flipped');

                    // Get pre-generated data from store
                    const locationRows = OCMDataStore.getLocationRows(locationName);

                    // Populate Data
                    const tbody = document.getElementById('locationFlipTableBody');
                    if (tbody) {
                        tbody.innerHTML = '';

                        locationRows.forEach(rowData => {
                            let impactClass = 'pill-met';
                            if (rowData.impactLabel === 'High') impactClass = 'pill-breached';
                            else if (rowData.impactLabel === 'Medium') impactClass = 'pill-risk';

                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${rowData.location}</td>
                                <td><span class="clickable-number" data-location="${rowData.location}" data-count="${rowData.share}" data-project="${rowData.project}">${rowData.share}</span></td>
                                <td><span class="pill ${impactClass}">${rowData.impactLabel}</span></td>
                                <td>${rowData.project}</td>
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

                    // Flip the Card
                    const flipContainer = document.getElementById('priorityFlipInner');
                    if (flipContainer) flipContainer.classList.add('flipped');

                    // Get pre-generated rows from data store
                    const rows = OCMDataStore.getPriorityRows(index);

                    // Populate Data
                    const tbody = document.getElementById('priorityFlipTableBody');
                    if (tbody) {
                        tbody.innerHTML = '';

                        rows.forEach(rowData => {
                            const row = document.createElement('tr');

                            let statusClass = 'pill-open';
                            if (rowData.status === 'Completed') statusClass = 'pill-met';
                            if (rowData.status === 'In Progress') statusClass = 'pill-progress';
                            if (rowData.status === 'Scheduled') statusClass = 'pill-risk';

                            row.innerHTML = `
                                <td><a href="#" class="incident-link" data-priority-index="${index}">${rowData.id}</a></td>
                                <td>${rowData.project}</td>
                                <td>${rowData.description}</td>
                                <td><span class="pill ${statusClass}">${rowData.status}</span></td>
                            `;
                            tbody.appendChild(row);
                        });
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

    // Get pre-generated data from centralized store
    const timelineData = OCMDataStore.getTimelineData(projectName, type);

    if (!timelineData) {
        console.warn('[OCMDataStore] No timeline data found for:', projectName, type);
        return;
    }

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

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#" class="incident-link">${timelineData.changeId}</a></td>
            <td>${timelineData.projectName}</td>
            <td>${timelineData.description}</td>
            <td>${timelineData.startDate}</td>
            <td>${timelineData.endDate}</td>
            <td>${timelineData.rootCause}</td>
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

        const durationStr = timelineData.duration + ' hrs';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#" class="incident-link">${timelineData.changeId}</a></td>
            <td>${timelineData.projectName}</td>
            <td>${timelineData.description}</td>
            <td>${timelineData.startDate}</td>
            <td>${timelineData.endDate}</td>
            <td><span class="pill pill-breached">${durationStr}</span></td>
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

        // Fetch Data from Store
        const impacts = OCMDataStore.getCriticalImpacts();

        if (impacts.length === 0) {
            contentBody.innerHTML = '<p class="impact-desc">No critical impacts found.</p>';
            return;
        }

        let html = '';
        impacts.forEach(item => {
            const actionsHtml = item.actions.map(action => `<li>${action}</li>`).join('');

            html += `
                <div class="impact-item">
                    <div class="impact-title">
                        <i class="fa-solid fa-triangle-exclamation"></i> ${item.title}
                    </div>
                    <p class="impact-desc">${item.description}</p>
                    <h5 style="margin: 8px 0 4px 0; color: #4318FF; font-size: 11px;">Recommended Actions:</h5>
                    <ul class="action-list">
                        ${actionsHtml}
                    </ul>
                </div>
            `;
        });

        contentBody.innerHTML = html;
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

    // Initialize Modal Functionality
    initChangeFormModal();
});

// =========================================
// Change Form Modal Functions
// =========================================

function initChangeFormModal() {
    const modal = document.getElementById('changeFormModal');
    const closeBtn = document.getElementById('modalCloseBtn');
    const editModeToggle = document.getElementById('editModeToggle');

    if (!modal) return;

    // Close button click
    if (closeBtn) {
        closeBtn.addEventListener('click', closeChangeFormModal);
    }

    // Click outside modal to close
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeChangeFormModal();
        }
    });

    // Escape key to close
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeChangeFormModal();
        }
    });

    // Edit mode toggle
    if (editModeToggle) {
        editModeToggle.addEventListener('change', function () {
            toggleEditMode(this.checked);
        });
    }

    // Delegate click events for incident links
    document.addEventListener('click', function (e) {
        const incidentLink = e.target.closest('.incident-link');
        if (incidentLink) {
            e.preventDefault();
            const changeId = incidentLink.textContent.trim();

            // Check if this change is from a breached context
            const parentRow = incidentLink.closest('tr');
            let isBreached = false;

            if (parentRow) {
                // Check for breach indicators in the row
                const slaCell = parentRow.querySelector('.pill-breached, .sla-breached');
                if (slaCell) {
                    isBreached = true;
                }
            }

            // Also check if we're in the timeline flip table (which shows breach details)
            const flipTitle = document.getElementById('timelineFlipTitle');
            if (flipTitle && flipTitle.textContent.includes('Breach')) {
                isBreached = true;
            }

            const priorityIndex = incidentLink.dataset.priorityIndex;
            openChangeFormModal(changeId, isBreached, priorityIndex);
        }
    });
}

function openChangeFormModal(changeId, isBreached = false, priorityIndex = null) {
    const modal = document.getElementById('changeFormModal');
    if (!modal) return;

    // Reset edit mode
    const editModeToggle = document.getElementById('editModeToggle');
    if (editModeToggle) {
        editModeToggle.checked = false;
        toggleEditMode(false);
    }

    // Populate modal with synthetic data
    populateChangeFormData(changeId, isBreached);

    // Get sections
    const breachSection = document.getElementById('slaBreachSection');
    const metSection = document.getElementById('slaMetSection');
    const prioritySection = document.getElementById('priorityHighlightSection');

    // Reset visibility
    if (breachSection) breachSection.style.display = 'none';
    if (metSection) metSection.style.display = 'none';
    if (prioritySection) prioritySection.style.display = 'none';

    if (priorityIndex !== undefined && priorityIndex !== null) {
        // Priority Context
        if (prioritySection) {
            prioritySection.style.display = 'block';
            populatePriorityHighlight(priorityIndex, changeId);
        }
    } else if (isBreached) {
        // Breach Context
        if (breachSection) {
            breachSection.style.display = 'block';
            populateSLABreachData(changeId);
        }
    } else {
        // Met Context
        if (metSection) {
            metSection.style.display = 'block';
            populateSLAMetData(changeId);
        }
    }

    // Show modal with animation
    modal.classList.add('active');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeChangeFormModal() {
    const modal = document.getElementById('changeFormModal');
    if (!modal) return;

    modal.classList.remove('active');

    // Restore body scroll
    document.body.style.overflow = '';
}

function toggleEditMode(isEditable) {
    const formInputs = document.querySelectorAll('.modal-body .form-input, .modal-body .form-textarea');

    formInputs.forEach(input => {
        if (isEditable) {
            input.removeAttribute('readonly');
        } else {
            input.setAttribute('readonly', true);
        }
    });
}

// Global storage for Change Data to ensure persistence
const storedChangeData = {};

function populateChangeFormData(changeId, isBreached = false) {
    // Get data from centralized data store
    const data = OCMDataStore.getChangeFormData(changeId, isBreached);

    // Populate fields from stored data
    document.getElementById('changeNumber').value = changeId;
    document.getElementById('changeType').value = data.changeType || 'Standard';
    document.getElementById('shortDescription').value = data.shortDescription || '';
    document.getElementById('description').value = data.description || '';
    document.getElementById('requestedBy').value = data.requestedBy || '';
    document.getElementById('impact').value = data.impact || 'Medium';
    document.getElementById('risk').value = data.risk || 'Moderate';
    document.getElementById('plannedStart').value = data.plannedStart || '';
    document.getElementById('plannedEnd').value = data.plannedEnd || '';
    document.getElementById('approver').value = data.approver || '';
    document.getElementById('approvalStatus').value = data.approvalStatus || 'Pending Review';
    document.getElementById('implementationPlan').value = data.implementationPlan || '';
    document.getElementById('backoutPlan').value = data.backoutPlan || data.implementationPlan || '';
    document.getElementById('closeCode').value = data.closeCode || 'Successful';
}

// =========================================
// SLA Breach/Met Section Functions
// =========================================

function populateSLABreachData(changeId) {
    // Get breach data from centralized data store
    const data = OCMDataStore.getSLABreachData(changeId);

    if (!data) {
        console.warn('[OCMDataStore] No breach data found for:', changeId);
        return;
    }

    // Impact descriptions
    const impactDescriptions = {
        'High': 'Critical business services affected. Customer-facing applications experienced degraded performance affecting approximately 2,500 users.',
        'Medium': 'Internal service disruption. Development and staging environments were impacted, delaying 3 other scheduled releases.',
        'Low': 'Minor service impact. Non-critical monitoring dashboards temporarily unavailable during breach window.'
    };

    // Risk descriptions
    const riskDescriptions = {
        'Critical': 'Escalated to executive leadership. Potential regulatory compliance implications requiring immediate remediation.',
        'High': 'Risk tolerance threshold exceeded. Additional review cycles mandated for future changes of similar scope.',
        'Moderate': 'Standard risk escalation procedures invoked. Post-implementation review scheduled.',
        'Low': 'Within acceptable deviation range. Minimal escalation required.'
    };

    // Populate breach reason
    document.getElementById('breachReason').textContent = data.breachReason;

    // Populate duration
    document.getElementById('slaTarget').textContent = `${data.slaTarget} hours`;
    document.getElementById('actualTime').textContent = `${data.actualTime} hours`;
    document.getElementById('exceededBy').textContent = `+${data.exceededBy} hours`;

    // Populate impact
    const impactBadge = document.getElementById('breachImpactBadge');
    impactBadge.textContent = data.selectedImpact;
    impactBadge.className = `breach-badge impact-${data.selectedImpact.toLowerCase()}`;
    document.getElementById('breachImpactDesc').textContent = impactDescriptions[data.selectedImpact] || '';

    // Populate risk
    const riskBadge = document.getElementById('breachRiskBadge');
    riskBadge.textContent = data.selectedRisk;
    riskBadge.className = `breach-badge risk-${data.selectedRisk.toLowerCase()}`;
    document.getElementById('breachRiskDesc').textContent = riskDescriptions[data.selectedRisk] || '';

    // Populate mini timeline
    populateBreachMiniTimeline(data.selectedTimeline);
}

function populateBreachMiniTimeline(selectedTimeline) {
    const timeline = document.getElementById('breachMiniTimeline');
    if (!timeline || !selectedTimeline) return;

    let html = '';
    selectedTimeline.forEach((stage, index) => {
        html += `
            <div class="timeline-stage ${stage.status}">
                <div class="timeline-stage-dot">
                    <i class="fa-solid ${stage.icon}"></i>
                </div>
                <div class="timeline-stage-label">${stage.name}</div>
                <div class="timeline-stage-time">${stage.time}</div>
            </div>
        `;
    });

    timeline.innerHTML = html;
}

function populateSLAMetData(changeId) {
    // Get SLA met data from centralized store
    const slaData = changeId ? OCMDataStore.getSLAMetData(changeId) : { slaTarget: 8, actualTime: 6, completedEarly: 2 };

    const details = document.getElementById('slaMetDetails');
    if (details) {
        details.textContent = `Change completed ${slaData.completedEarly} hour${slaData.completedEarly !== 1 ? 's' : ''} before SLA target. Target: ${slaData.slaTarget}h, Actual: ${slaData.actualTime}h`;
    }
}

// =========================================
// Change Drill-Down Modal Functions
// =========================================

// Store current drill-down data for filtering/sorting
let currentDrillDownData = [];
let currentLocation = '';
let currentProject = '';

function initDrillDownModal() {
    const modal = document.getElementById('changeDrillDownModal');
    const closeBtn = document.getElementById('drilldownCloseBtn');
    const tableViewBtn = document.getElementById('tableViewBtn');
    const cardViewBtn = document.getElementById('cardViewBtn');
    const slaFilter = document.getElementById('slaFilter');
    const sortBy = document.getElementById('sortBy');

    if (!modal) return;

    // Close button click
    if (closeBtn) {
        closeBtn.addEventListener('click', closeDrillDownModal);
    }

    // Click outside modal to close
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeDrillDownModal();
        }
    });

    // Escape key to close
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeDrillDownModal();
        }
    });

    // View toggle
    if (tableViewBtn) {
        tableViewBtn.addEventListener('click', function () {
            switchDrillDownView('table');
        });
    }

    if (cardViewBtn) {
        cardViewBtn.addEventListener('click', function () {
            switchDrillDownView('card');
        });
    }

    // Filter and Sort
    if (slaFilter) {
        slaFilter.addEventListener('change', applyDrillDownFilters);
    }

    if (sortBy) {
        sortBy.addEventListener('change', applyDrillDownFilters);
    }

    // Delegate click events for clickable numbers
    document.addEventListener('click', function (e) {
        const clickableNumber = e.target.closest('.clickable-number');
        if (clickableNumber) {
            e.preventDefault();
            const location = clickableNumber.dataset.location;
            const count = parseInt(clickableNumber.dataset.count);
            const project = clickableNumber.dataset.project;
            openDrillDownModal(location, count, project);
        }
    });

    // Delegate click events for drill-down change IDs (to open Change Form Modal)
    document.addEventListener('click', function (e) {
        const changeIdLink = e.target.closest('.change-id-link, .drilldown-card-id');
        if (changeIdLink && !changeIdLink.classList.contains('incident-link')) {
            e.preventDefault();
            const changeId = changeIdLink.textContent.trim();

            // Check if this change is breached
            let isBreached = false;

            // Check in table row
            const parentRow = changeIdLink.closest('tr');
            if (parentRow) {
                const slaBadge = parentRow.querySelector('.sla-breached');
                if (slaBadge) isBreached = true;
            }

            // Check in card
            const parentCard = changeIdLink.closest('.drilldown-card');
            if (parentCard) {
                const slaBadge = parentCard.querySelector('.sla-breached');
                if (slaBadge) isBreached = true;
            }

            openChangeFormModal(changeId, isBreached);
        }
    });
}

function openDrillDownModal(location, count, project) {
    const modal = document.getElementById('changeDrillDownModal');
    if (!modal) return;

    currentLocation = location;
    currentProject = project;

    // Update header
    document.getElementById('drilldownLocationName').textContent = location;
    document.getElementById('drilldownTotalCount').textContent = `${count} Change${count !== 1 ? 's' : ''}`;

    // Reset filters
    document.getElementById('slaFilter').value = 'all';
    document.getElementById('sortBy').value = 'default';

    // Generate synthetic data
    currentDrillDownData = generateDrillDownData(count, location, project);

    // Populate views
    populateDrillDownViews(currentDrillDownData);

    // Reset to table view
    switchDrillDownView('table');

    // Show modal with animation
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDrillDownModal() {
    const modal = document.getElementById('changeDrillDownModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function switchDrillDownView(view) {
    const tableView = document.getElementById('drilldownTableView');
    const cardView = document.getElementById('drilldownCardView');
    const tableBtn = document.getElementById('tableViewBtn');
    const cardBtn = document.getElementById('cardViewBtn');

    if (view === 'table') {
        tableView.classList.add('active');
        cardView.classList.remove('active');
        tableBtn.classList.add('active');
        cardBtn.classList.remove('active');
    } else {
        cardView.classList.add('active');
        tableView.classList.remove('active');
        cardBtn.classList.add('active');
        tableBtn.classList.remove('active');
    }
}

function generateDrillDownData(count, location, project) {
    // Get pre-generated drill-down data from centralized store
    return OCMDataStore.getDrillDownData(location, count, project);
}

function populateDrillDownViews(data) {
    populateDrillDownTable(data);
    populateDrillDownCards(data);
}

function populateDrillDownTable(data) {
    const tbody = document.getElementById('drilldownTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');

        const stateClass = getStateClass(item.state);
        const riskClass = getRiskClass(item.risk);
        const impactClass = getImpactClass(item.impact);
        const priorityClass = getPriorityClass(item.priority);
        const slaClass = item.slaStatus === 'Met' ? 'sla-met' : 'sla-breached';

        row.innerHTML = `
            <td>
                <a href="#" class="change-id-link">
                    ${item.changeId}
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
            </td>
            <td>${item.description}</td>
            <td><span class="drilldown-pill ${stateClass}">${item.state}</span></td>
            <td><span class="drilldown-pill ${riskClass}">${item.risk}</span></td>
            <td><span class="drilldown-pill ${impactClass}">${item.impact}</span></td>
            <td><span class="drilldown-pill ${priorityClass}">${item.priority}</span></td>
            <td><span class="drilldown-pill ${slaClass}">${item.slaStatus}</span></td>
        `;

        tbody.appendChild(row);
    });
}

function populateDrillDownCards(data) {
    const grid = document.getElementById('drilldownCardsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'drilldown-card';

        const stateClass = getStateClass(item.state);
        const riskClass = getRiskClass(item.risk);
        const impactClass = getImpactClass(item.impact);
        const priorityClass = getPriorityClass(item.priority);
        const slaClass = item.slaStatus === 'Met' ? 'sla-met' : 'sla-breached';

        card.innerHTML = `
            <div class="drilldown-card-header">
                <span class="drilldown-card-id">
                    ${item.changeId}
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </span>
                <div class="drilldown-card-sla">
                    <span class="drilldown-pill ${slaClass}">${item.slaStatus}</span>
                </div>
            </div>
            <div class="drilldown-card-desc">${item.description}</div>
            <div class="drilldown-card-meta">
                <div class="drilldown-card-meta-item">
                    <span class="drilldown-card-meta-label">State</span>
                    <span class="drilldown-pill ${stateClass}">${item.state}</span>
                </div>
                <div class="drilldown-card-meta-item">
                    <span class="drilldown-card-meta-label">Priority</span>
                    <span class="drilldown-pill ${priorityClass}">${item.priority}</span>
                </div>
                <div class="drilldown-card-meta-item">
                    <span class="drilldown-card-meta-label">Risk</span>
                    <span class="drilldown-pill ${riskClass}">${item.risk}</span>
                </div>
                <div class="drilldown-card-meta-item">
                    <span class="drilldown-card-meta-label">Impact</span>
                    <span class="drilldown-pill ${impactClass}">${item.impact}</span>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

function applyDrillDownFilters() {
    const slaFilter = document.getElementById('slaFilter').value;
    const sortBy = document.getElementById('sortBy').value;

    let filteredData = [...currentDrillDownData];

    // Apply SLA filter
    if (slaFilter !== 'all') {
        filteredData = filteredData.filter(item => {
            if (slaFilter === 'met') return item.slaStatus === 'Met';
            if (slaFilter === 'breached') return item.slaStatus === 'Breached';
            return true;
        });
    }

    // Apply sorting
    if (sortBy !== 'default') {
        filteredData.sort((a, b) => {
            if (sortBy === 'priority') {
                const priorityOrder = { 'P1': 1, 'P2': 2, 'P3': 3, 'P4': 4 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            if (sortBy === 'risk') {
                const riskOrder = { 'Critical': 1, 'High': 2, 'Moderate': 3, 'Low': 4, 'Minimal': 5 };
                return riskOrder[a.risk] - riskOrder[b.risk];
            }
            if (sortBy === 'sla') {
                return a.slaStatus === 'Breached' ? -1 : 1;
            }
            return 0;
        });
    }

    // Update count display
    const totalCount = document.getElementById('drilldownTotalCount');
    if (totalCount) {
        if (filteredData.length !== currentDrillDownData.length) {
            totalCount.textContent = `${filteredData.length} of ${currentDrillDownData.length} Changes`;
        } else {
            totalCount.textContent = `${filteredData.length} Change${filteredData.length !== 1 ? 's' : ''}`;
        }
    }

    // Re-populate views
    populateDrillDownViews(filteredData);
}

// Helper functions for CSS classes
function getStateClass(state) {
    const stateMap = {
        'Open': 'state-open',
        'In Progress': 'state-progress',
        'Resolved': 'state-resolved',
        'Scheduled': 'state-scheduled'
    };
    return stateMap[state] || 'state-open';
}

function getRiskClass(risk) {
    const riskMap = {
        'Critical': 'risk-critical',
        'High': 'risk-high',
        'Moderate': 'risk-moderate',
        'Low': 'risk-low',
        'Minimal': 'risk-minimal'
    };
    return riskMap[risk] || 'risk-low';
}

function getImpactClass(impact) {
    const impactMap = {
        'High': 'impact-high',
        'Medium': 'impact-medium',
        'Low': 'impact-low'
    };
    return impactMap[impact] || 'impact-low';
}

function getPriorityClass(priority) {
    const priorityMap = {
        'P1': 'priority-p1',
        'P2': 'priority-p2',
        'P3': 'priority-p3',
        'P4': 'priority-p4'
    };
    return priorityMap[priority] || 'priority-p4';
}

// Initialize Drill-Down Modal on DOM ready
document.addEventListener('DOMContentLoaded', function () {
    initDrillDownModal();
    initCriticalImpactNotification();
    initTopCategories();
});

function initTopCategories() {
    const categories = OCMDataStore.getCategoriesData();
    const container = document.querySelector('.categories-list');

    if (!container) return;

    if (categories.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999;">No categories data.</p>';
        return;
    }

    const html = categories.map(cat => {
        const badgeClass = cat.isHigh ? 'badge-high' : 'badge-low';
        return `
            <a href="category-details.html?category=${encodeURIComponent(cat.name)}" class="cat-item-link">
                <div class="cat-item">
                    <span>${cat.name}</span>
                    <span class="badge ${badgeClass}">${cat.count}</span>
                </div>
            </a>
        `;
    }).join('');

    container.innerHTML = html;
}

function initCriticalImpactNotification() {
    const impacts = OCMDataStore.getCriticalImpacts();
    const countEl = document.getElementById('criticalImpactCount');
    const cardEl = document.querySelector('.critical-impact-card');

    if (countEl) {
        countEl.textContent = impacts.length;
    }

    // Optional: Hide pulse if count is 0
    if (impacts.length === 0 && cardEl) {
        const pulse = cardEl.querySelector('.notification-pulse');
        if (pulse) pulse.style.display = 'none';

        // Remove notification style if no impacts? Or keep formatted as "0 Critical impacts"
        // User requested "2 Critical impacts found", implies > 0.
        // We'll keep the style but maybe reduce urgency visually if 0 (future enhancement).
    }
}

/**
 * Populate Priority Highlight Section
 */
function populatePriorityHighlight(priorityIndex, changeId) {
    // Colors: ['#FF5B5B', '#05CD99', '#FFB547', '#00C4DF']
    // Mapping: 0->P1(Red), 1->P3(Green), 2->P2(Orange), 3->P4(Cyan)
    const priorityLabels = ['P1', 'P3', 'P2', 'P4'];

    const index = parseInt(priorityIndex);
    const priority = priorityLabels[index] || 'P?';

    // Update Badge
    const badge = document.getElementById('priorityBadge');
    if (badge) {
        badge.textContent = priority;
        // Remove existing classes first logic? Or just overwrite.
        // Assuming base class is priority-badge.
        badge.className = `priority-badge priority-${priority.toLowerCase()}`;
    }

    // Description
    const descriptions = {
        'P1': 'Critical Priority - Immediate Action Required. Business critical system unavailable.',
        'P2': 'High Priority - Urgent Attention. Major functionality impaired.',
        'P3': 'Normal Priority - Schedule within standard window. Minor impact.',
        'P4': 'Low Priority - Routine maintenance or cosmetic change.'
    };
    const descEl = document.getElementById('priorityDescription');
    if (descEl) descEl.textContent = descriptions[priority] || '';

    // Details
    const data = OCMDataStore.getChangeFormData(changeId);

    const impactEl = document.getElementById('modalImpactBadge');
    if (impactEl) impactEl.textContent = data.impact || '-';

    const riskEl = document.getElementById('modalRiskBadge');
    if (riskEl) riskEl.textContent = data.risk || '-';

    const stateEl = document.getElementById('modalStateBadge');
    if (stateEl) stateEl.textContent = data.approvalStatus || 'Open';

    // SLA Neutral
    const slaStatus = (data.isBreached) ? 'Breached' : 'Met';
    const slaEl = document.getElementById('slaNeutralValue');
    if (slaEl) slaEl.textContent = slaStatus;
}
