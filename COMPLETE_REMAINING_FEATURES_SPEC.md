# Complete Remaining Features Specification
## Squad Status Dashboard - Full Notion Feedback Implementation Plan

**Document Created:** 2026-02-14  
**Notion Source:** https://www.notion.so/Squad-Status-Design-Feedback-30732aa2de8881af8879feccada86a7b  
**Analyzed By:** Pixel (Frontend Engineer)  

---

## Executive Summary

After thorough analysis of the Notion feedback document and current codebase, I've identified **23 distinct features** that remain to be implemented beyond the 4 already completed (summary bar, stale treatment, hover effects, last completed task).

**Current Codebase:**  
- Single-file architecture: 1679 lines  
- Complex functionality: Timeline, filtering, real-time updates, animations  
- Stable and well-structured

**Recommendation:**  
Implement in **4 phased sprints** (45-60min each) to maintain code quality and stability.

---

## ✅ Already Implemented (Previous Session)

1. **Summary Bar with Clickable Filters** ✅
   - Location: Below header
   - Functionality: Status counts, clickable chips, active state

2. **Stale Agent Visual Treatment** ✅
   - Warning threshold: 15-120 minutes (amber)
   - Critical threshold: 120+ minutes (red, dimmed)

3. **Enhanced Card Hover Effects** ✅
   - Lift, shadow elevation
   - Chevron arrow indicator

4. **Last Completed Task for Idle Agents** ✅
   - Async fetch from Supabase
   - Fallback: "No tasks yet"

---

## 🔧 PHASE 1: Critical UX Improvements
**Estimated Time:** 45 minutes  
**Impact:** HIGH  
**Priority:** Implement First

### 1.1 "Managed Agents (N)" Label
**Location:** Above team grid  
**Current:** No label, hierarchy unclear  
**Needed:**
```html
<div class="team-container">
    <div class="text-sm text-slate-400 mb-3 text-center">
        Managed Agents (<span id="team-count">4</span>)
    </div>
    <div class="connector-lines"></div>
    <div class="team-grid">...</div>
</div>
```
**JavaScript Update:**
```javascript
// In renderAgents():
document.getElementById('team-count').textContent = team.length;
```

### 1.2 Responsive Grid Centering
**Problem:** Empty space when <5 agents  
**Solution:** Center grid dynamically
```css
.team-grid {
    justify-content: center; /* Add this */
    max-width: fit-content;
    margin: 0 auto;
}
```

### 1.3 Larger Status Indicators with Shapes
**Current:** 12px circles, color-only  
**Needed:** 16px with shape variants  

**CSS Update:**
```css
.status-dot {
    width: 16px !important;
    height: 16px !important;
}

.status-shape-working {
    border-radius: 50%; /* Circle */
}

.status-shape-idle {
    border-radius: 2px; /* Square */
}

.status-shape-error {
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 14px solid #EF4444; /* Triangle */
}
```

**HTML Update:**
```html
<!-- Working -->
<div class="status-dot status-shape-working bg-green-500 ..."></div>

<!-- Idle -->
<div class="status-dot status-shape-idle bg-yellow-500 ..."></div>

<!-- Error -->
<div class="status-shape-error"></div>
```

### 1.4 Agent Detail Modal
**Current:** `openAgentDetail()` shows alert  
**Needed:** Full modal overlay  

**HTML (add before </body>):**
```html
<div id="agentModal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-slate-700 flex justify-between items-start">
            <div>
                <h2 id="modalAgentName" class="text-2xl font-bold"></h2>
                <p id="modalAgentRole" class="text-slate-400"></p>
            </div>
            <button onclick="closeAgentModal()" class="text-slate-400 hover:text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        
        <div id="modalContent" class="p-6">
            <!-- Task History -->
            <h3 class="text-lg font-semibold mb-3">Recent Tasks</h3>
            <div id="modalTaskHistory" class="space-y-2 mb-6">
                Loading...
            </div>
            
            <!-- Performance Metrics -->
            <h3 class="text-lg font-semibold mb-3">Performance</h3>
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-slate-900/50 p-4 rounded-lg">
                    <div class="text-sm text-slate-400">Tasks Completed</div>
                    <div id="modalTasksCompleted" class="text-2xl font-bold">--</div>
                </div>
                <div class="bg-slate-900/50 p-4 rounded-lg">
                    <div class="text-sm text-slate-400">Avg Duration</div>
                    <div id="modalAvgDuration" class="text-2xl font-bold">--</div>
                </div>
            </div>
        </div>
    </div>
</div>
```

**JavaScript:**
```javascript
async function openAgentDetail(agentName) {
    const modal = document.getElementById('agentModal');
    document.getElementById('modalAgentName').textContent = agentName;
    document.getElementById('modalAgentRole').textContent = agentRoles[agentName];
    
    modal.classList.remove('hidden');
    
    // Fetch task history
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/agent_activities?agent_name=eq.${encodeURIComponent(agentName)}&order=started_at.desc&limit=20`,
        {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        }
    );
    
    const tasks = await response.json();
    
    const taskHTML = tasks.map(t => `
        <div class="bg-slate-900/50 p-3 rounded-lg text-sm">
            <div class="text-slate-300">${escapeHtml(t.task || 'No description')}</div>
            <div class="text-xs text-slate-500 mt-1">
                ${new Date(t.started_at).toLocaleString()}
            </div>
        </div>
    `).join('');
    
    document.getElementById('modalTaskHistory').innerHTML = taskHTML || 'No tasks found';
    
    // Calculate metrics
    const completed = tasks.filter(t => t.status === 'completed').length;
    document.getElementById('modalTasksCompleted').textContent = completed;
    
    if (completed > 0) {
        const durations = tasks
            .filter(t => t.ended_at && t.started_at)
            .map(t => new Date(t.ended_at) - new Date(t.started_at));
        
        const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
        const avgMins = Math.floor(avg / 60000);
        document.getElementById('modalAvgDuration').textContent = `${avgMins}m`;
    }
}

function closeAgentModal() {
    document.getElementById('agentModal').classList.add('hidden');
}

// Close on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAgentModal();
});
```

### 1.5 De-emphasize Role Labels
**Current:** `text-sm text-slate-400`  
**Change to:** `text-xs text-slate-500 opacity-60`

**Find and replace in both renderLeaderCard() and renderTeamMemberCard():**
```javascript
// OLD:
<p class="text-sm md:text-base text-slate-400 mb-2">${agentRoles[agent.agent_name] || ''}</p>

// NEW:
<p class="text-xs text-slate-500 opacity-60 mb-2">${agentRoles[agent.agent_name] || ''}</p>
```

### 1.6 Timeline Color-Coded Borders
**Add agent-specific colors to timeline entries**

**Define agent colors (add to script section):**
```javascript
const agentTimelineColors = {
    'Ducki (Main)': '#FFD700',
    'Pixel': '#A855F7',
    'Linus': '#06B6D4',
    'Tesla': '#10B981',
    'Shakespeare': '#F59E0B'
};
```

**Update renderTimelineItem():**
```javascript
function renderTimelineItem(activity, index) {
    const agentName = activity.agent_name || agentNameMap[activity.agent_id] || activity.agent_id;
    const borderColor = agentTimelineColors[agentName] || '#64748b';
    
    return `
        <div class="timeline-item-container ${side} ${statusClass}" 
             style="animation: slideInTimeline 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${animationDelay}s both; border-left: 4px solid ${borderColor}; padding-left: 12px;">
        ...
```

---

## 🔧 PHASE 2: Scalability Features
**Estimated Time:** 60 minutes  
**Impact:** MEDIUM-HIGH  
**Priority:** Implement Second

### 2.1 View Mode Toggle (Card/Compact/Table)
**Add to header (after Timeline button):**
```html
<div class="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
    <button onclick="setViewMode('card')" id="viewCard" class="view-mode-btn active px-3 py-1.5 rounded text-xs">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
        </svg>
    </button>
    <button onclick="setViewMode('compact')" id="viewCompact" class="view-mode-btn px-3 py-1.5 rounded text-xs">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
    </button>
    <button onclick="setViewMode('table')" id="viewTable" class="view-mode-btn px-3 py-1.5 rounded text-xs">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
    </button>
</div>
```

**JavaScript:**
```javascript
let viewMode = localStorage.getItem('viewMode') || 'card';

function setViewMode(mode) {
    viewMode = mode;
    localStorage.setItem('viewMode', mode);
    
    // Update button states
    document.querySelectorAll('.view-mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('view' + mode.charAt(0).toUpperCase() + mode.slice(1)).classList.add('active');
    
    // Re-render with new view
    renderAgents(allAgentsData);
}

// In renderAgents(), apply view mode:
if (viewMode === 'compact') {
    content.classList.add('view-compact');
    // Smaller cards, 3-column grid
} else if (viewMode === 'table') {
    content.classList.add('view-table');
    // Table layout
}
```

**CSS:**
```css
.view-mode-btn.active {
    background: rgba(139, 92, 246, 0.3);
    color: #a78bfa;
}

.view-compact .agent-card {
    padding: 0.75rem;
    font-size: 0.875rem;
}

.view-compact .team-grid {
    grid-template-columns: repeat(3, 1fr);
}

.view-table .team-container {
    display: block;
}

.view-table .team-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.view-table .agent-card {
    border-radius: 0.5rem;
    padding: 1rem;
}
```

### 2.2 Search Bar
**Add above summary bar:**
```html
<div class="bg-slate-800/40 backdrop-blur-sm rounded-xl p-3 mb-4 border border-slate-700/30">
    <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input 
            type="text" 
            id="agentSearch"
            placeholder="Search agents..."
            oninput="searchAgents(this.value)"
            class="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-10 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
        />
        <button 
            id="searchClear"
            onclick="clearSearch()"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white hidden">
            ✕
        </button>
    </div>
</div>
```

**JavaScript:**
```javascript
let searchQuery = '';

function searchAgents(query) {
    searchQuery = query.toLowerCase();
    
    // Show/hide clear button
    document.getElementById('searchClear').classList.toggle('hidden', !query);
    
    renderAgents(allAgentsData);
}

function clearSearch() {
    searchQuery = '';
    document.getElementById('agentSearch').value = '';
    document.getElementById('searchClear').classList.add('hidden');
    renderAgents(allAgentsData);
}

// In renderAgents(), add filtering:
if (searchQuery) {
    validAgents = validAgents.filter(a => 
        a.agent_name.toLowerCase().includes(searchQuery) ||
        (agentRoles[a.agent_name] || '').toLowerCase().includes(searchQuery)
    );
}
```

### 2.3 Sorting Options
**Add dropdown after view mode toggle:**
```html
<select id="sortBy" onchange="setSortBy(this.value)" class="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
    <option value="status">Sort: Status</option>
    <option value="name">Sort: Name</option>
    <option value="lastActive">Sort: Last Active</option>
</select>
```

**JavaScript:**
```javascript
let sortBy = localStorage.getItem('sortBy') || 'status';

function setSortBy(sort) {
    sortBy = sort;
    localStorage.setItem('sortBy', sort);
    renderAgents(allAgentsData);
}

// In renderAgents(), sort before rendering:
if (sortBy === 'name') {
    validAgents.sort((a, b) => a.agent_name.localeCompare(b.agent_name));
} else if (sortBy === 'lastActive') {
    validAgents.sort((a, b) => new Date(b.last_active_at) - new Date(a.last_active_at));
} else if (sortBy === 'status') {
    const statusOrder = { error: 0, working: 1, idle: 2 };
    validAgents.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
}
```

### 2.4 Timeline Agent Filter Chips
**Add below timeline header:**
```html
<div class="flex-shrink-0 px-6 pb-4 border-b border-slate-700/30">
    <div class="flex flex-wrap gap-2">
        <button onclick="filterTimeline('all')" id="timelineFilterAll" class="timeline-filter-chip active">
            All
        </button>
        <button onclick="filterTimeline('Ducki (Main)')" class="timeline-filter-chip" style="border-color: #FFD700;">
            🦆 Ducki
        </button>
        <button onclick="filterTimeline('Pixel')" class="timeline-filter-chip" style="border-color: #A855F7;">
            🎨 Pixel
        </button>
        <!-- ... more agent chips -->
    </div>
</div>
```

**CSS:**
```css
.timeline-filter-chip {
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    border: 1px solid rgba(100, 116, 139, 0.3);
    background: rgba(15, 23, 42, 0.5);
    font-size: 0.75rem;
    transition: all 0.2s;
}

.timeline-filter-chip.active {
    background: rgba(139, 92, 246, 0.3);
    border-color: rgba(139, 92, 246, 0.6);
}
```

**JavaScript:**
```javascript
let timelineFilter = 'all';

function filterTimeline(agentName) {
    timelineFilter = agentName;
    
    // Update active state
    document.querySelectorAll('.timeline-filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Reload timeline
    fetchActivities(true);
}

// In fetchActivities(), add filter:
let url = `${SUPABASE_URL}/rest/v1/agent_activities?order=started_at.desc&limit=20`;
if (timelineFilter !== 'all') {
    url += `&agent_name=eq.${encodeURIComponent(timelineFilter)}`;
}
```

### 2.5 Collapse Repeated Timeline Entries
**Add grouping logic:**
```javascript
function collapseRepeatedEntries(activities) {
    const collapsed = [];
    let currentGroup = null;
    
    activities.forEach((activity, i) => {
        if (currentGroup && 
            currentGroup.agent_name === activity.agent_name &&
            currentGroup.status === activity.status &&
            currentGroup.task === activity.task) {
            // Add to current group
            currentGroup.entries.push(activity);
            currentGroup.endTime = activity.started_at;
        } else {
            // Start new group
            if (currentGroup) collapsed.push(currentGroup);
            currentGroup = {
                ...activity,
                entries: [activity],
                startTime: activity.started_at,
                endTime: activity.ended_at || activity.started_at,
                isGroup: false
            };
        }
    });
    
    if (currentGroup) collapsed.push(currentGroup);
    
    // Mark groups with >1 entry
    return collapsed.map(group => ({
        ...group,
        isGroup: group.entries.length > 1
    }));
}

// In renderTimeline():
const collapsedActivities = collapseRepeatedEntries(activities);
```

**Render grouped entries:**
```javascript
if (activity.isGroup) {
    const duration = new Date(activity.endTime) - new Date(activity.startTime);
    const durationStr = formatDuration(duration);
    
    return `
        <div class="timeline-item-container ${side} grouped" ...>
            <div class="timeline-content-wrapper">
                <div class="timeline-content">
                    <div class="font-semibold">
                        ${agentName}
                        <span class="text-xs text-slate-500">· ${activity.entries.length} sessions</span>
                    </div>
                    <p class="text-sm text-slate-400">
                        ${escapeHtml(activity.task)}
                    </p>
                    <div class="text-xs text-slate-500">
                        ${formatTime(activity.startTime)} – ${formatTime(activity.endTime)} · ${durationStr}
                    </div>
                    <button onclick="expandGroup(${index})" class="text-xs text-purple-400 hover:text-purple-300 mt-1">
                        Show all ${activity.entries.length} entries
                    </button>
                </div>
            </div>
            ...
        </div>
    `;
}
```

---

## 🔧 PHASE 3: States & Polish
**Estimated Time:** 45 minutes  
**Impact:** MEDIUM  
**Priority:** Implement Third

### 3.1 Error State Design
**Update getStatusConfig():**
```javascript
if (agent.status === 'error') {
    return `
        <div class="agent-card error-state bg-red-900/20 border-red-500 ...">
            <div class="flex items-start gap-3">
                <svg class="w-6 h-6 text-red-400 flex-shrink-0" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div class="flex-1">
                    <h3 class="font-semibold text-red-400">Error</h3>
                    <p class="text-sm text-red-300">${agent.error_message || 'Unknown error'}</p>
                    <button class="text-xs text-red-400 hover:text-red-300 mt-1">View details →</button>
                </div>
            </div>
        </div>
    `;
}
```

### 3.2 Disconnected State
**Add detection:**
```javascript
function getAgentConnectionState(lastActiveAt) {
    const now = new Date();
    const lastActive = new Date(lastActiveAt);
    const hoursAgo = (now - lastActive) / (1000 * 60 * 60);
    
    if (hoursAgo > 24) return 'disconnected';
    return 'connected';
}

// In render, show disconnected badge:
if (getAgentConnectionState(agent.last_active_at) === 'disconnected') {
    return `
        <div class="agent-card disconnected-state opacity-50 grayscale ...">
            <div class="flex items-center gap-2 mb-2">
                <svg class="w-5 h-5 text-slate-500">...</svg>
                <span class="text-sm text-slate-400">Disconnected</span>
            </div>
            <p class="text-xs text-slate-500">Last seen: ${formatDate(agent.last_active_at)}</p>
        </div>
    `;
}
```

### 3.3 Stalled State Detection
```javascript
function isTaskStalled(task, startedAt) {
    if (!task) return false;
    const now = new Date();
    const started = new Date(startedAt);
    const minutesRunning = (now - started) / (1000 * 60);
    return minutesRunning > 30; // Stalled if >30 min
}

// In render:
if (agent.status === 'working' && isTaskStalled(agent.current_task, agent.last_active_at)) {
    return `
        <div class="stalled-indicator bg-amber-500/10 border border-amber-500/30 rounded px-2 py-1 text-xs text-amber-400">
            ⚠ May be stalled (${Math.floor((new Date() - new Date(agent.last_active_at)) / 60000)}m)
        </div>
    `;
}
```

### 3.4 Empty States
**Zero agents:**
```javascript
if (validAgents.length === 0 && allAgentsData.length === 0) {
    content.innerHTML = `
        <div class="text-center py-16">
            <svg class="w-24 h-24 mx-auto mb-6 text-slate-600">...</svg>
            <h3 class="text-2xl font-bold mb-3">No Agents Connected</h3>
            <p class="text-slate-400 mb-6">Get started by connecting your first agent</p>
            <button class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg">
                Add Agent
            </button>
        </div>
    `;
}
```

### 3.5 Duration Label Clarity
**Update renderTimelineItem():**
```javascript
// For completed tasks:
if (activity.ended_at) {
    durationText = `✓ Completed in ${durationStr}`;
}

// For in-progress:
if (activity.is_live) {
    durationText = `
        <span class="inline-flex items-center gap-1">
            <span class="w-2 h-2 bg-green-500 rounded-full pulse-dot"></span>
            In progress
        </span>
    `;
}

// For failed:
if (activity.status === 'failed') {
    durationText = `✗ Failed after ${durationStr}`;
}
```

### 3.6 Refresh Badge Clarity
**Update countdown display:**
```html
<span id="countdown" class="text-blue-200 text-sm">17 new updates</span>
```

**Add tooltip:**
```html
<span id="countdown" 
      class="text-blue-200 text-sm" 
      title="Click to load 17 pending updates">
    17 new
</span>
```

### 3.7 Timeline Toggle State Visibility
**Update toggleTimeline():**
```javascript
function toggleTimeline() {
    isTimelineOpen = !isTimelineOpen;
    const btn = document.getElementById('timelineBtn');
    
    if (isTimelineOpen) {
        btn.classList.add('bg-purple-600', 'shadow-lg', 'shadow-purple-500/50');
        btn.setAttribute('aria-expanded', 'true');
    } else {
        btn.classList.remove('bg-purple-600', 'shadow-lg', 'shadow-purple-500/50');
        btn.setAttribute('aria-expanded', 'false');
    }
    
    // ... rest of toggle logic
}
```

### 3.8 Typography Hierarchy
**Update CSS:**
```css
/* Primary: Agent name + status */
.agent-name {
    font-size: 1.25rem; /* 20px */
    font-weight: 700;
    line-height: 1.2;
}

/* Secondary: Task description */
.task-description {
    font-size: 0.875rem; /* 14px */
    font-weight: 400;
    line-height: 1.5;
}

/* Tertiary: Role, timestamp */
.agent-role,
.agent-timestamp {
    font-size: 0.75rem; /* 12px */
    font-weight: 400;
    opacity: 0.6;
}
```

### 3.9 Dark Theme Contrast Audit
**Fix contrast issues:**
```css
/* Timestamps: from slate-500 to slate-300 */
.timestamp {
    color: #cbd5e1; /* slate-300, ratio 7:1 */
}

/* Role labels: from slate-400 to slate-400 (already OK) */
.agent-role {
    color: #94a3b8; /* slate-400, ratio 4.5:1 */
}

/* Timeline secondary: from slate-400 to slate-300 */
.timeline-metadata {
    color: #cbd5e1; /* slate-300 */
}
```

**Audit with tool:**
```bash
# Use WebAIM Contrast Checker:
# https://webaim.org/resources/contrastchecker/

# Target ratios:
# Normal text (14px+): 4.5:1 (AA)
# Large text (18px+): 3:1 (AA)
```

---

## 🔧 PHASE 4: Visual Refinements
**Estimated Time:** 30 minutes  
**Impact:** LOW-MEDIUM  
**Priority:** Implement Fourth (Optional)

### 4.1 Consistent Border Treatments
**Remove all dashed borders, standardize:**
```css
/* Active/Working agents */
.agent-card[data-status="working"] {
    border: 2px solid #10B981; /* solid green */
}

/* Idle agents */
.agent-card[data-status="idle"] {
    border: 1px solid rgba(100, 116, 139, 0.3); /* subtle slate */
}

/* Error agents */
.agent-card[data-status="error"] {
    border: 2px solid #EF4444; /* solid red */
}
```

### 4.2 Avatar System Consistency
**Ensure all avatars use same pattern:**
```javascript
const agentAvatars = {
    'Ducki (Main)': {
        svg: '...', // Keep custom duck SVG
        color: 'from-amber-400 to-yellow-500', // Match #FFD700
        borderColor: '#FFD700'
    },
    'Pixel': {
        emoji: '🎨',
        color: 'from-purple-400 to-pink-500', // Match #A855F7
        borderColor: '#A855F7'
    },
    // ... all using consistent pattern
};
```

---

## 📋 PHASE 5: Advanced Features (Optional)
**Estimated Time:** 30 minutes  
**Impact:** LOW  
**Priority:** Nice-to-have

### 5.1 Browser Notifications
```javascript
// Request permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Send notification on error
function notifyError(agentName, error) {
    if (Notification.permission === 'granted') {
        new Notification(`⚠ ${agentName} Error`, {
            body: error,
            icon: '/icon.png',
            tag: `agent-error-${agentName}`
        });
    }
}
```

### 5.2 Agent Quick Actions Menu
```html
<div class="agent-actions-menu absolute top-2 right-2 hidden group-hover:block">
    <button class="text-slate-400 hover:text-white" onclick="showActionsMenu(event, '${agentName}')">
        <svg class="w-5 h-5">⋯</svg>
    </button>
</div>
```

---

## 📊 Implementation Timeline

### Recommended Schedule

**Week 1:**
- Day 1: Phase 1 (Critical UX) - 45min
- Day 2: Phase 2 (Scalability) - 60min  
- Test thoroughly

**Week 2:**
- Day 3: Phase 3 (States & Polish) - 45min
- Day 4: Phase 4 (Visual Refinements) - 30min
- Final testing & QA

**Week 3:**
- Day 5: Phase 5 (Advanced, if desired) - 30min
- Documentation updates
- Production deployment

---

## ✅ Testing Checklist

After each phase:

- [ ] All existing features still work
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Accessibility (keyboard nav, screen readers)
- [ ] Performance (no lag with many agents)
- [ ] Cross-browser (Chrome, Firefox, Safari)
- [ ] Dark theme consistency
- [ ] Real-time updates still function

---

## 📝 Notes for Implementation

1. **Test incrementally** - Don't implement all phases at once
2. **Commit often** - Each feature should be a separate commit
3. **Document changes** - Update CHANGELOG.md
4. **Backup first** - Keep backup of working version
5. **Deploy to dev first** - Test thoroughly before production

---

## 🎯 Success Metrics

After full implementation, dashboard should achieve:

✅ **Scannable** - Users can assess squad health in <2 seconds  
✅ **Actionable** - Clear CTAs for every state  
✅ **Scalable** - Works with 1 agent or 100 agents  
✅ **Accessible** - WCAG AA compliant  
✅ **Informative** - No wasted space, every element has purpose  

---

## 📚 Reference Materials

- **Notion Feedback:** https://www.notion.so/Squad-Status-Design-Feedback-30732aa2de8881af8879feccada86a7b
- **Current Implementation:** COMPLETION_REPORT.md
- **Supabase Docs:** https://supabase.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

---

**Document Status:** COMPLETE  
**Ready for Implementation:** ✅  
**Estimated Total Time:** 3.5 hours (across 4 phases)  
**Prepared by:** Pixel, 2026-02-14 11:45 UTC

