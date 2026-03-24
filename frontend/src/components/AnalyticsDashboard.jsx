import React from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts';

const AnalyticsDashboard = ({ tasks = [], auditLog = [], metrics = {} }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] text-gray-500">
        <div className="bg-gray-800/50 p-6 rounded-full mb-4">
          <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-400">No data yet</h3>
        <p className="text-sm mt-2">Run a workflow to see performance analytics.</p>
      </div>
    );
  }

  // --- Data for Chart 1: Status Breakdown ---
  const statusCounts = tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({
    name: name.replace('_', ' ').toUpperCase(),
    value
  }));

  const PIE_COLORS = {
    'DONE': '#00e676',
    'IN PROGRESS': '#378ADD',
    'FAILED': '#E24B4A',
    'ESCALATED': '#EF9F27',
    'BACKLOG': '#6B7280'
  };

  // --- Data for Chart 2: Agent Performance ---
  const agentStats = auditLog.reduce((acc, entry) => {
    const agent = entry.agent;
    if (!acc[agent]) acc[agent] = { name: agent, success: 0, error: 0 };
    if (entry.status === 'success') acc[agent].success += 1;
    else acc[agent].error += 1;
    return acc;
  }, {});
  const barData = Object.values(agentStats);

  // --- Data for Chart 3: Timeline ---
  const timelineData = auditLog
    .filter(e => e.status === 'success' || e.status === 'error')
    .map((e, index) => ({
      time: new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      cumulative: index + 1,
      status: e.status
    }));

  // --- Data for Chart 5: SLA Health ---
  const slaData = tasks.map(t => ({
    name: t.title.substring(0, 15),
    used: 120 - (t.sla_hours || 0),
    total: 120,
    health: (t.sla_hours || 0) < 30 ? 'critical' : (t.sla_hours || 0) < 70 ? 'warning' : 'healthy'
  }));

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Chart 1: Status Pie */}
        <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Workflow Status</h3>
          <div className="h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name] || '#378ADD'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-white">{tasks.length}</span>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Tasks</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Agent Bar */}
        <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Agent Reliability</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend verticalAlign="top" align="right" />
                <Bar dataKey="success" stackId="a" fill="#378ADD" radius={[0, 0, 0, 0]} />
                <Bar dataKey="error" stackId="a" fill="#E24B4A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Timeline Line */}
        <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Execution Velocity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} hide />
                <YAxis stroke="#9ca3af" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ display: 'none' }}
                />
                <Line type="monotone" dataKey="cumulative" stroke="#378ADD" strokeWidth={3} dot={{ fill: '#378ADD', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Autonomy Gauge (Custom SVG) */}
        <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700 flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 w-full">Autonomy Score</h3>
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96" cy="96" r="80"
                stroke="currentColor" strokeWidth="12" fill="transparent"
                className="text-gray-700"
              />
              <circle
                cx="96" cy="96" r="80"
                stroke="currentColor" strokeWidth="12" fill="transparent"
                strokeDasharray={2 * Math.PI * 80}
                strokeDashoffset={2 * Math.PI * 80 * (1 - (metrics.autonomy_rate || 0) / 100)}
                strokeLinecap="round"
                className={`${(metrics.autonomy_rate || 0) > 80 ? 'text-green-500' :
                    (metrics.autonomy_rate || 0) > 50 ? 'text-amber-500' : 'text-red-500'
                  } transition-all duration-1000 ease-out`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{metrics.autonomy_rate || 0}%</span>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Autonomous</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart 5: SLA Health (Horizontal Bars) */}
      <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Task SLA Health</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={slaData} margin={{ left: 50 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={10} width={100} />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
              />
              <Bar dataKey="used" radius={[0, 4, 4, 0]}>
                {slaData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.health === 'critical' ? '#E24B4A' :
                      entry.health === 'warning' ? '#EF9F27' : '#00e676'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
