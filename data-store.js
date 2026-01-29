/**
 * OCM Dashboard - Centralized Data Store
 * =======================================
 * This module provides a centralized, immutable data store for all synthetic data.
 * Data is generated once during initialization and remains static until explicitly refreshed.
 * 
 * Usage:
 *   - OCMDataStore.init() - Initialize and generate all data
 *   - OCMDataStore.refreshData() - Regenerate all data with new values
 *   - OCMDataStore.getTimestamp() - Get "Data as of" timestamp string
 *   - Access methods for each data type (see below)
 */

const OCMDataStore = (function () {
    // Private state
    let _initialized = false;
    let _timestamp = null;

    // Pre-generated data stores
    let _changesChartData = {};      // Keyed by "datasetIndex-dataIndex"
    let _locationChartData = {};     // Keyed by location name
    let _priorityChartData = {};     // Keyed by priority index
    let _timelineData = {};          // Keyed by "projectName-type"
    let _changeFormData = {};        // Keyed by changeId
    let _drillDownData = {};         // Keyed by "location-project"
    let _slaMetData = {};            // Keyed by changeId
    let _criticalImpactData = [];    // Array of critical impact objects
    let _categoriesData = [];        // Array of top category objects

    // Configuration constants
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const PRIORITIES = ['P1', 'P2', 'P3', 'P4'];
    const PROJECTS = ['Application', 'Network', 'Database', 'Infra', 'Cloud Ops', 'Security', 'Frontend'];
    const STATES = ['In Progress', 'Resolved', 'Open', 'Scheduled'];
    const RISKS = ['Critical', 'High', 'Moderate', 'Low', 'Minimal'];
    const IMPACTS = ['High', 'Medium', 'Low'];
    const LOCATIONS = ['Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Mumbai'];

    const DESCRIPTIONS = [
        'Database schema migration for performance optimization',
        'Firewall rule update for new API endpoints',
        'Server patch deployment for security vulnerability',
        'Load balancer configuration changes',
        'Network infrastructure upgrade',
        'Application deployment to production',
        'Database Schema Update',
        'Firewall Configuration',
        'Application Deployment',
        'Load Balancer Adjustment',
        'Security Patch installation',
        'Database optimization',
        'User access review',
        'Storage expansion for increased capacity',
        'Monitoring system enhancement'
    ];

    const ROOT_CAUSES = ['Firmware Update', 'Policy Change', 'Capacity Addition', 'Bug Fix', 'Routine Maintenance'];

    const BREACH_REASONS = [
        'Delayed approval from Change Advisory Board (CAB) due to incomplete risk assessment documentation. The approval process exceeded the standard 24-hour window by 18 hours.',
        'Extended implementation phase caused by unexpected database schema conflicts. Rollback was required, followed by a modified deployment approach.',
        'Dependency issue with upstream service deployment. The change was blocked waiting for a prerequisite network configuration update.',
        'Rollback failure during initial deployment attempt. Additional time required to restore services and re-attempt with modified approach.',
        'Resource unavailability during scheduled maintenance window. Key personnel were engaged in higher priority P1 incident resolution.',
        'Testing phase revealed critical integration issues requiring additional remediation before production deployment could proceed.'
    ];

    const CHANGE_TYPES = ['Standard', 'Normal', 'Emergency', 'Expedited'];
    const REQUESTERS = ['John Smith', 'Sarah Johnson', 'Michael Chen', 'Emily Davis', 'David Wilson', 'Lisa Anderson'];
    const APPROVERS = ['IT Manager - Robert Taylor', 'CAB Board', 'Security Team Lead', 'Operations Director', 'CTO Office'];
    const APPROVAL_STATUSES = ['Approved', 'Pending Review', 'Conditionally Approved', 'Awaiting CAB'];
    const CLOSE_CODES = ['Successful', 'Successful with Issues', 'Rolled Back', 'Cancelled', 'Incomplete'];

    const IMPLEMENTATION_PLANS = [
        '1. Create database backup\n2. Run migration scripts\n3. Validate data integrity\n4. Update application configuration\n5. Run smoke tests\n6. Monitor performance metrics',
        '1. Document current firewall rules\n2. Apply new rules to test environment\n3. Validate connectivity\n4. Deploy to production during maintenance window\n5. Verify all endpoints are accessible',
        '1. Notify stakeholders\n2. Take system snapshot\n3. Apply security patches\n4. Reboot affected servers\n5. Run security scan\n6. Confirm remediation'
    ];

    const BACKOUT_PLANS = [
        'If issues occur:\n1. Stop migration immediately\n2. Restore from pre-change backup\n3. Revert application configuration\n4. Notify all stakeholders\n5. Schedule post-mortem',
        'Rollback procedure:\n1. Revert firewall rules to previous state\n2. Verify connectivity restored\n3. Document issues encountered\n4. Escalate to security team if needed',
        'Emergency rollback:\n1. Stop patch deployment\n2. Restore system from snapshot\n3. Verify system stability\n4. Notify incident response team'
    ];

    const DELAY_OPTIONS = [
        [
            { name: 'Created', icon: 'fa-plus', status: 'completed', time: '09:00' },
            { name: 'Approval', icon: 'fa-check', status: 'delayed', time: '+8h delay' },
            { name: 'Planning', icon: 'fa-clipboard-list', status: 'delayed', time: 'Delayed' },
            { name: 'Implementation', icon: 'fa-gears', status: 'delayed', time: 'Late' },
            { name: 'Closed', icon: 'fa-flag-checkered', status: 'delayed', time: 'Breached' }
        ],
        [
            { name: 'Created', icon: 'fa-plus', status: 'completed', time: '09:00' },
            { name: 'Approved', icon: 'fa-check', status: 'completed', time: '10:30' },
            { name: 'Planning', icon: 'fa-clipboard-list', status: 'completed', time: '11:00' },
            { name: 'Implementation', icon: 'fa-gears', status: 'delayed', time: '+5h delay' },
            { name: 'Closed', icon: 'fa-flag-checkered', status: 'delayed', time: 'Breached' }
        ],
        [
            { name: 'Created', icon: 'fa-plus', status: 'completed', time: '09:00' },
            { name: 'Approved', icon: 'fa-check', status: 'completed', time: '11:00' },
            { name: 'Planning', icon: 'fa-clipboard-list', status: 'delayed', time: '+3h delay' },
            { name: 'Implementation', icon: 'fa-gears', status: 'delayed', time: '+4h delay' },
            { name: 'Closed', icon: 'fa-flag-checkered', status: 'delayed', time: 'Breached' }
        ]
    ];

    // Helper function to generate a random item from an array
    function randomFrom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Helper function to generate a unique Change ID
    function generateChangeId() {
        return `CHG${Math.floor(Math.random() * 90000) + 10000}`;
    }

    // Helper function to generate a date range
    function generateDateRange() {
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() - Math.floor(Math.random() * 10));
        const end = new Date(start);
        end.setDate(start.getDate() + 2);
        return { start, end };
    }

    // ========================================
    // Data Generation Functions
    // ========================================

    /**
     * Generate data for Changes Chart bubble clicks
     * Pre-generates rows for each possible bubble click
     */
    function generateChangesChartData() {
        _changesChartData = {};

        // Breached dataset (index 0) - 10 bubbles
        const breachedCounts = [14, 4, 12, 3, 15, 6, 13, 2, 11, 5];
        // SLA Met dataset (index 1) - 15 bubbles
        const metCounts = [3, 14, 5, 12, 4, 11, 7, 13, 2, 11, 3, 15, 5, 12, 4];

        // Generate for breached bubbles
        breachedCounts.forEach((count, dataIndex) => {
            const key = `0-${dataIndex}`;
            _changesChartData[key] = generateChartRows(count, true);
        });

        // Generate for SLA met bubbles
        metCounts.forEach((count, dataIndex) => {
            const key = `1-${dataIndex}`;
            _changesChartData[key] = generateChartRows(count, false);
        });
    }

    function generateChartRows(count, isBreached) {
        const rows = [];
        for (let i = 0; i < count; i++) {
            const priorityVal = randomFrom(PRIORITIES);
            const stateVal = randomFrom(STATES);

            rows.push({
                id: generateChangeId(),
                priority: priorityVal,
                project: randomFrom(PROJECTS),
                state: stateVal,
                slaStatus: isBreached ? 'Breached' : 'Met'
            });
        }
        return rows;
    }

    /**
     * Generate data for Location Chart bubble clicks
     */
    function generateLocationChartData() {
        _locationChartData = {};

        const locationProjects = [
            'Network Upgrade', 'Database Migration', 'App Deployment',
            'Security Patch', 'Server Maintenance'
        ];

        LOCATIONS.forEach((location, locIndex) => {
            // Generate for typical share distributions
            const totalChanges = [45, 30, 25, 15, 20][locIndex] || 20;
            const share1 = Math.floor(totalChanges * 0.5);
            const share2 = Math.floor(totalChanges * 0.3);
            const share3 = totalChanges - share1 - share2;
            const shares = [share1, share2, share3];

            _locationChartData[location] = shares.map((share, idx) => {
                let impactLabel = 'Low';
                if (share > 10) impactLabel = 'High';
                else if (share > 5) impactLabel = 'Medium';

                const project = locationProjects[(locIndex + idx) % locationProjects.length];

                return {
                    location,
                    share,
                    impactLabel,
                    project
                };
            });
        });
    }

    /**
     * Generate data for Priority Chart slice clicks
     */
    function generatePriorityChartData() {
        _priorityChartData = {};

        const percentages = [28.4, 27.7, 34.7, 9.2];
        const projectsList = ['Network', 'Database', 'Cloud Ops', 'Security', 'Frontend'];
        const descriptionsList = [
            'Database optimization',
            'Firewall rule update',
            'Server patch deployment',
            'Load balancer config',
            'User access review'
        ];
        const statusList = ['In Progress', 'Scheduled', 'Pending Approval', 'Completed'];

        percentages.forEach((percentage, index) => {
            const rowsCount = Math.max(3, Math.round(percentage / 4));
            const rows = [];

            for (let i = 0; i < rowsCount; i++) {
                rows.push({
                    id: generateChangeId(),
                    project: randomFrom(projectsList),
                    description: randomFrom(descriptionsList),
                    status: randomFrom(statusList)
                });
            }

            _priorityChartData[index] = rows;
        });
    }

    /**
     * Generate data for Timeline clicks (change and breached)
     */
    function generateTimelineData() {
        _timelineData = {};

        const timelineProjects = ['Application', 'Network', 'Database', 'Cloud ops', 'Security'];

        timelineProjects.forEach(projectName => {
            // Generate 'change' type data
            const changeKey = `${projectName}-change`;
            const changeId = generateChangeId();
            const { start, end } = generateDateRange();

            const changeData = {
                changeId,
                projectName,
                description: randomFrom(DESCRIPTIONS),
                startDate: start.toLocaleDateString(),
                endDate: end.toLocaleDateString(),
                rootCause: randomFrom(ROOT_CAUSES),
                plannedStart: start.toLocaleString(),
                plannedEnd: end.toLocaleString(),
                requestedBy: projectName + ' Team'
            };
            _timelineData[changeKey] = changeData;

            // Store in changeFormData as well
            _changeFormData[changeId] = {
                ...changeData,
                shortDescription: changeData.description,
                isBreached: false
            };

            // Generate 'breached' type data
            const breachKey = `${projectName}-breached`;
            const breachChangeId = generateChangeId();
            const { start: breachStart, end: breachEnd } = generateDateRange();
            const durationHours = Math.floor(Math.random() * 5) + 2;

            const breachData = {
                changeId: breachChangeId,
                projectName,
                description: randomFrom(DESCRIPTIONS),
                startDate: breachStart.toLocaleDateString(),
                endDate: breachEnd.toLocaleDateString(),
                duration: durationHours,
                plannedStart: breachStart.toLocaleString(),
                plannedEnd: breachEnd.toLocaleString(),
                requestedBy: projectName + ' Team'
            };
            _timelineData[breachKey] = breachData;

            // Store breach data for modal
            _changeFormData[breachChangeId] = {
                ...breachData,
                shortDescription: breachData.description,
                isBreached: true,
                breachDuration: durationHours
            };

            // Pre-generate SLA breach details
            generateSLABreachDataForChange(breachChangeId, durationHours);
        });
    }

    /**
     * Generate SLA breach data for a specific change
     */
    function generateSLABreachDataForChange(changeId, breachDuration) {
        const slaTarget = Math.floor(Math.random() * 12) + 4;
        const exceededBy = breachDuration || (Math.floor(Math.random() * 8) + 2);
        const actualTime = slaTarget + exceededBy;

        const selectedImpact = randomFrom(IMPACTS);
        const selectedRisk = randomFrom(RISKS);

        if (!_changeFormData[changeId]) {
            _changeFormData[changeId] = {};
        }

        _changeFormData[changeId].breachData = {
            breachReason: randomFrom(BREACH_REASONS),
            slaTarget,
            actualTime,
            exceededBy,
            selectedImpact,
            selectedRisk,
            selectedTimeline: randomFrom(DELAY_OPTIONS)
        };
    }

    /**
     * Generate complete change form data for a change ID
     */
    function generateCompleteChangeFormData(changeId, isBreached = false) {
        if (_changeFormData[changeId] && _changeFormData[changeId].complete) {
            return _changeFormData[changeId];
        }

        const planIndex = Math.floor(Math.random() * IMPLEMENTATION_PLANS.length);
        const { start, end } = generateDateRange();

        const data = {
            changeType: randomFrom(CHANGE_TYPES),
            shortDescription: randomFrom(DESCRIPTIONS),
            description: DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)],
            requestedBy: randomFrom(REQUESTERS),
            impact: randomFrom(IMPACTS),
            risk: randomFrom(RISKS),
            plannedStart: start.toLocaleString(),
            plannedEnd: end.toLocaleString(),
            approver: randomFrom(APPROVERS),
            approvalStatus: randomFrom(APPROVAL_STATUSES),
            implementationPlan: IMPLEMENTATION_PLANS[planIndex],
            backoutPlan: BACKOUT_PLANS[planIndex],
            closeCode: randomFrom(CLOSE_CODES),
            isBreached,
            complete: true
        };

        // Merge with existing data if present
        _changeFormData[changeId] = {
            ..._changeFormData[changeId],
            ...data
        };

        // Generate breach data if needed
        if (isBreached && !_changeFormData[changeId].breachData) {
            generateSLABreachDataForChange(changeId, _changeFormData[changeId].breachDuration);
        }

        return _changeFormData[changeId];
    }

    /**
     * Generate SLA Met data for a specific change
     */
    function generateSLAMetDataForChange(changeId) {
        if (_slaMetData[changeId]) {
            return _slaMetData[changeId];
        }

        const slaTarget = Math.floor(Math.random() * 12) + 4;
        const actualTime = slaTarget - Math.floor(Math.random() * 3) - 1;
        const completedEarly = slaTarget - actualTime;

        _slaMetData[changeId] = {
            slaTarget,
            actualTime,
            completedEarly
        };

        return _slaMetData[changeId];
    }

    /**
     * Generate drill-down data for location modal
     */
    function generateDrillDownDataForLocation(count, location, project) {
        const key = `${location}-${project}-${count}`;

        if (_drillDownData[key]) {
            return _drillDownData[key];
        }

        const data = [];
        const descriptions = [
            'Database schema optimization for improved query performance',
            'Firewall configuration update for enhanced security',
            'Server patch deployment for vulnerability remediation',
            'Load balancer reconfiguration for better traffic distribution',
            'Network infrastructure upgrade for new office locations',
            'Application deployment with new feature release',
            'Security certificate renewal and update',
            'Backup system configuration changes',
            'Storage expansion for increased capacity',
            'Monitoring system enhancement'
        ];

        for (let i = 0; i < count; i++) {
            const changeId = generateChangeId();
            const slaStatus = Math.random() > 0.3 ? 'Met' : 'Breached';

            const item = {
                changeId,
                description: randomFrom(descriptions),
                state: randomFrom(STATES),
                risk: randomFrom(RISKS),
                impact: randomFrom(IMPACTS),
                priority: randomFrom(PRIORITIES),
                slaStatus,
                location,
                project
            };

            data.push(item);

            // Pre-populate change form data for this change
            generateCompleteChangeFormData(changeId, slaStatus === 'Breached');
        }

        _drillDownData[key] = data;
        return data;
    }

    /**
     * Generate Critical Impact Data
     */
    function generateCriticalImpactData() {
        _criticalImpactData = [];

        // Potential critical scenarios
        const scenarios = [
            {
                title: 'Critical: High Latency in APAC Region',
                description: 'Recurring issue causing 15% slow-down in transaction processing.',
                actions: [
                    'Reroute traffic via secondary gateway node.',
                    'Investigate ISP peering congestion at Singapore hub.',
                    'Scale up load balancer capacity by 20%.'
                ]
            },
            {
                title: 'Critical: Database Deadlocks Detected',
                description: 'High frequency of deadlocks in Order Management System during peak hours.',
                actions: [
                    'Analyze deadlock graphs and identify conflicting queries.',
                    'Optimize index strategy on OrderDetails table.',
                    'Schedule emergency maintenance to apply schema patches.'
                ]
            },
            {
                title: 'Critical: Security Certificate Expiry',
                description: 'SSL Certificate for internal API gateway expires in 48 hours.',
                actions: [
                    'Generatew new CSR and request immediate signing.',
                    'Deploy new certificates to load balancers.',
                    'Verify chain of trust after deployment.'
                ]
            }
        ];

        // Randomly select 1 or 2 impacts
        const count = Math.random() > 0.5 ? 2 : 1;
        // Shuffle and take count
        const shuffled = [...scenarios].sort(() => 0.5 - Math.random());
        _criticalImpactData = shuffled.slice(0, count);
    }

    /**
     * Generate Top Categories Data
     */
    function generateCategoriesData() {
        _categoriesData = [
            { name: 'Application Related issue', count: 10, isHigh: true },
            { name: 'End User computing', count: 9, isHigh: true },
            { name: 'VPN Issue', count: 8, isHigh: true },
            { name: 'Logon speed', count: 4, isHigh: false },
            { name: 'Network Latency', count: 6, isHigh: true },
            { name: 'Software Updates', count: 3, isHigh: false },
            { name: 'Access Rights', count: 2, isHigh: false },
            { name: 'Hardware Failure', count: 1, isHigh: false },
            { name: 'Security Policy', count: 7, isHigh: true },
            { name: 'Cloud Infrastructure', count: 5, isHigh: false },
            { name: 'Database Connection', count: 5, isHigh: false }
        ];

        // Sort by count descending
        _categoriesData.sort((a, b) => b.count - a.count);
    }

    // ========================================
    // Public API
    // ========================================

    return {
        /**
         * Initialize the data store - generates all synthetic data
         */
        init: function () {
            if (_initialized) {
                console.log('[OCMDataStore] Already initialized. Use refreshData() to regenerate.');
                return;
            }

            console.log('[OCMDataStore] Initializing data store...');

            _timestamp = new Date();

            generateChangesChartData();
            generateLocationChartData();
            generatePriorityChartData();
            generateTimelineData();
            generateCriticalImpactData();
            generateCategoriesData();

            _initialized = true;
            console.log('[OCMDataStore] Initialization complete. Timestamp:', this.getTimestamp());
        },

        /**
         * Refresh all data with new random values
         */
        refreshData: function () {
            console.log('[OCMDataStore] Refreshing all data...');

            // Clear all stores
            _changesChartData = {};
            _locationChartData = {};
            _priorityChartData = {};
            _timelineData = {};
            _changeFormData = {};
            _drillDownData = {};
            _drillDownData = {};
            _slaMetData = {};
            _criticalImpactData = [];
            _categoriesData = [];

            // Reset and regenerate
            _initialized = false;
            this.init();

            // Update timestamp display
            this.updateTimestampDisplay();

            console.log('[OCMDataStore] Data refresh complete.');
        },

        /**
         * Get formatted timestamp string
         */
        getTimestamp: function () {
            if (!_timestamp) return '--';
            return _timestamp.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        /**
         * Update the timestamp display in the UI
         */
        updateTimestampDisplay: function () {
            const el = document.getElementById('dataTimestamp');
            if (el) {
                el.textContent = 'Data as of: ' + this.getTimestamp();
            }
        },

        /**
         * Get pre-generated rows for Changes Chart bubble click
         * @param {number} datasetIndex - 0 for Breached, 1 for SLA Met
         * @param {number} dataIndex - Index of the bubble in the dataset
         * @returns {Array} Array of row objects
         */
        getChangesChartRows: function (datasetIndex, dataIndex) {
            const key = `${datasetIndex}-${dataIndex}`;
            return _changesChartData[key] || [];
        },

        /**
         * Get pre-generated rows for Location Chart
         * @param {string} location - Location name
         * @returns {Array} Array of row objects with share, impactLabel, project
         */
        getLocationRows: function (location) {
            return _locationChartData[location] || [];
        },

        /**
         * Get pre-generated rows for Priority Chart slice click
         * @param {number} priorityIndex - Index of the pie slice (0-3)
         * @returns {Array} Array of row objects
         */
        getPriorityRows: function (priorityIndex) {
            return _priorityChartData[priorityIndex] || [];
        },

        /**
         * Get pre-generated data for Timeline click
         * @param {string} projectName - Project name
         * @param {string} type - 'change' or 'breached'
         * @returns {Object} Timeline row data
         */
        getTimelineData: function (projectName, type) {
            const key = `${projectName}-${type}`;
            return _timelineData[key] || null;
        },

        /**
         * Get or generate complete change form data
         * @param {string} changeId - Change ID
         * @param {boolean} isBreached - Whether the change is breached
         * @returns {Object} Complete change form data
         */
        getChangeFormData: function (changeId, isBreached = false) {
            return generateCompleteChangeFormData(changeId, isBreached);
        },

        /**
         * Get SLA breach data for a change
         * @param {string} changeId - Change ID
         * @returns {Object} Breach data or null
         */
        getSLABreachData: function (changeId) {
            if (_changeFormData[changeId] && _changeFormData[changeId].breachData) {
                return _changeFormData[changeId].breachData;
            }
            generateSLABreachDataForChange(changeId);
            return _changeFormData[changeId].breachData;
        },

        /**
         * Get SLA met data for a change
         * @param {string} changeId - Change ID
         * @returns {Object} SLA met data
         */
        getSLAMetData: function (changeId) {
            return generateSLAMetDataForChange(changeId);
        },

        /**
         * Get drill-down data for location modal
         * @param {string} location - Location name
         * @param {number} count - Number of changes
         * @param {string} project - Project name
         * @returns {Array} Array of change objects
         */
        getDrillDownData: function (location, count, project) {
            return generateDrillDownDataForLocation(count, location, project);
        },

        /**
         * Get generated critical impacts
         * @returns {Array} Array of impact objects
         */
        getCriticalImpacts: function () {
            return _criticalImpactData;
        },

        /**
         * Get top categories data
         * @returns {Array} Array of category objects
         */
        getCategoriesData: function () {
            return _categoriesData;
        },

        /**
         * Check if a change ID exists in the store
         * @param {string} changeId - Change ID to check
         * @returns {boolean}
         */
        hasChangeData: function (changeId) {
            return !!_changeFormData[changeId];
        },

        /**
         * Check if store is initialized
         * @returns {boolean}
         */
        isInitialized: function () {
            return _initialized;
        }
    };
})();

// Auto-initialize when script loads (before other scripts)
OCMDataStore.init();
