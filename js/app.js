
// js/app.js
// Connects the UI to the dataset and agent logic

const App = {
    init: function() {
        // 1. Update the top KPIs
        this.renderKPIs();
        
        // 2. Run the AI Agent to observe the raw data
        const insights = MediTrackAgent.observe(hospitalData);
        this.renderInsights(insights);
        
        // 3. Generate recommendations based on insights
        const recommendations = MediTrackAgent.recommendActions(insights);
        this.renderRecommendations(recommendations);
        
        // 4. Show initial audit log
        this.renderAuditLog();
    },
    
    renderKPIs: function() {
        document.getElementById('wait-time').innerText = hospitalData.emergencyDept.averageWaitTimeMins + ' mins';
        
        // Count blocked beds
        const blocked = hospitalData.beds.filter(b => b.blocker !== "None").length;
        document.getElementById('blocked-beds').innerText = blocked;
        
        // Count delayed labs
        const delayed = hospitalData.diagnostics.filter(d => d.status === "Delayed").length;
        document.getElementById('pending-labs').innerText = delayed;
    },
    
    renderInsights: function(insights) {
        const container = document.getElementById('investigations-container');
        container.innerHTML = '';
        
        insights.forEach(insight => {
            const card = document.createElement('div');
            const borderColor = insight.type === 'Critical' ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50';
            card.className = `p-3 rounded border-l-4 ${borderColor}`;
            card.innerHTML = `
                <h4 class="font-bold text-slate-800">${insight.icon} ${insight.title}</h4>
                <p class="text-sm mt-1 text-slate-600"><strong>Evidence:</strong> ${insight.evidence}</p>
                <p class="text-sm text-slate-600"><strong>Impact:</strong> ${insight.impact}</p>
            `;
            container.appendChild(card);
        });
    },
    
    renderRecommendations: function(recs) {
        const container = document.getElementById('recommendations-container');
        container.innerHTML = '';
        
        if (recs.length === 0) {
            container.innerHTML = '<p class="text-sm text-gray-500">No actions required.</p>';
            return;
        }

        recs.forEach(rec => {
            const card = document.createElement('div');
            card.className = 'p-4 bg-slate-50 rounded border border-slate-200 mb-3';
            card.innerHTML = `
                <h4 class="font-bold text-blue-700">${rec.title}</h4>
                <p class="text-sm mt-1 text-slate-700">${rec.description}</p>
                <p class="text-xs mt-2 text-slate-500 italic">Trade-off: ${rec.tradeOffs}</p>
                <div class="mt-3 flex gap-2">
                    <button onclick="App.handleApprove('${rec.id}', '${rec.title}')" class="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 font-medium transition-colors">Approve</button>
                    <button onclick="App.handleReject('${rec.id}', '${rec.title}')" class="bg-gray-200 text-slate-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300 font-medium transition-colors">Reject</button>
                </div>
            `;
            container.appendChild(card);
        });
    },
    
    renderAuditLog: function() {
        const container = document.getElementById('audit-log');
        // Map logs to li elements
        container.innerHTML = ActionSystem.logs.map(log => `<li class="py-1 border-b border-slate-200 last:border-0">${log}</li>`).join('');
    },
    
    // Button Handlers
    handleApprove: function(id, title) {
        ActionSystem.approveAction(id, title);
    },
    
    handleReject: function(id, title) {
        ActionSystem.rejectAction(id, title);
    }
};

// Start the app when the page loads
window.onload = function() {
    App.init();
};
