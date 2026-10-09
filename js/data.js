
// js/data.js
// Synthetic Data for Sanjeevani Multispeciality Hospital
// This simulates the exact "Blocked Bed" morning scenario.

const hospitalData = {
    timestamp: new Date().toLocaleTimeString(),
    
    // Emergency Department Status
    emergencyDept: {
        waitingPatients: 14,
        averageWaitTimeMins: 125, // Unusually high wait time
        status: "Critical"
    },

    // Bed Management (5 occupied beds, 2 stuck on discharge)
    beds: [
        { id: "E-01", ward: "Emergency", status: "Occupied", patientId: "P-101", blocker: "Pending Discharge Paperwork" },
        { id: "E-02", ward: "Emergency", status: "Occupied", patientId: "P-102", blocker: "Pending Discharge Paperwork" },
        { id: "E-03", ward: "Emergency", status: "Occupied", patientId: "P-103", blocker: "Awaiting Lab Report" },
        { id: "E-04", ward: "Emergency", status: "Occupied", patientId: "P-104", blocker: "None" },
        { id: "E-05", ward: "Emergency", status: "Occupied", patientId: "P-105", blocker: "None" }
    ],

    // Diagnostics / Lab Reports
    diagnostics: [
        { testId: "LAB-881", patientId: "P-103", type: "Blood Panel", status: "Delayed", delayHours: 2 },
        { testId: "LAB-882", patientId: "P-108", type: "MRI", status: "Delayed", delayHours: 1.5 }
    ],

    // Staffing / Roster
    staffing: {
        currentShift: { role: "Nurses", required: 10, available: 10, status: "Optimal" },
        nextShift: { role: "Nurses", required: 10, available: 7, status: "Short-staffed" } // Short-staffed next shift
    }
};

// We freeze the object so our AI agent can't accidentally modify the raw data, it can only read it.
Object.freeze(hospitalData);
