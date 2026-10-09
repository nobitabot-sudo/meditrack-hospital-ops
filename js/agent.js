
// js/agent.js
// Core AI Logic: Observe -> Reason -> Recommend

const MediTrackAgent = {
    // 1. OBSERVE: Scan the raw hospital data to find operational bottlenecks
    observe: function(data) {
        let insights = [];
        
        // Rule 1: Check for Blocked Beds (Pending Discharge)
        const blockedBeds = data.beds.filter(bed => bed.blocker === "Pending Discharge Paperwork");
        if (blockedBeds.length > 0) {
            insights.push({
                type: "Critical",
                title: "Beds Blocked by Paperwork",
                evidence: `${blockedBeds.length} beds (e.g., ${blockedBeds[0].id}) are occupied but waiting for discharge processing.`,
                impact: "Directly causing the 125-minute emergency wait time.",
                icon: "🚨"
            });
        }

        // Rule 2: Check for Delayed Labs
        const delayedLabs = data.diagnostics.filter(lab => lab.status === "Delayed");
        if (delayedLabs.length > 0) {
            insights.push({
                type: "Warning",
                title: "Delayed Diagnostics",
                evidence: `${delayedLabs.length} lab reports are delayed by over 1.5 hours.`,
                impact: "Preventing accurate diagnosis and slowing down bed clearance.",
                icon: "⚠️"
            });
        }

        // Rule 3: Check Upcoming Staffing
        if (data.staffing.nextShift.status === "Short-staffed") {
            const missing = data.staffing.nextShift.required - data.staffing.nextShift.available;
            insights.push({
                type: "Warning",
                title: "Upcoming Staff Shortage",
                evidence: `Next shift is missing ${missing} nurses.`,
                impact: "Will compound the emergency wait time crisis if not resolved.",
                icon: "👥"
            });
        }

        return insights;
    },

    // 2. REASON & RECOMMEND: Generate practical actions for the Human Operator
    recommendActions: function(insights) {
        let actions = [];

        // Response to Blocked Beds
        if (insights.some(i => i.title === "Beds Blocked by Paperwork")) {
            actions.push({
                id: "ACT-001",
                title: "Expedite Discharge Paperwork",
                description: "Alert the on-call medical officer to immediately clear discharge papers for beds E-01 and E-02.",
                tradeOffs: "Frees 2 beds instantly, but pulls one doctor away from active triage for 15 mins.",
                status: "Pending Approval"
            });
        }

        // Response to Staff Shortage
        if (insights.some(i => i.title === "Upcoming Staff Shortage")) {
            actions.push({
                id: "ACT-002",
                title: "Call in Backup Roster",
                description: "Send automated SMS to 3 off-duty nurses requesting emergency cover for the night shift.",
                tradeOffs: "Solves night shift bottleneck, but incurs overtime budget costs.",
                status: "Pending Approval"
            });
        }

        return actions;
    }
};
