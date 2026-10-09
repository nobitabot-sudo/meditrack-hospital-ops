
// js/actions.js
// Handles the mandatory "Human-in-the-loop" approval rule and audit logging

const ActionSystem = {
    logs: ["> System initialized. Awaiting signals..."],
    
    logAudit: function(message) {
        const time = new Date().toLocaleTimeString();
        // Add new log at the top
        this.logs.unshift(`[${time}] ${message}`); 
        
        // Tell the App to re-render the log on screen
        if (typeof App !== 'undefined') {
            App.renderAuditLog();
        }
    },
    
    approveAction: function(actionId, actionTitle) {
        this.logAudit(`✅ APPROVED: Operator authorized "${actionTitle}". Simulated task sent to ward.`);
    },
    
    rejectAction: function(actionId, actionTitle) {
        this.logAudit(`❌ REJECTED: Operator declined "${actionTitle}".`);
    }
};
