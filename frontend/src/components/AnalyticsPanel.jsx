import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts";
import { TrendingUp, Target, Flag, Gauge } from "lucide-react";

const COLORS = ["#3b82f6", "#60a5fa", "#22c55e", "#f59e0b"];
const MP_LABELS = { "amazon.de": "DE", "amazon.es": "ES", "amazon.fr": "FR", "amazon.it": "IT" };

const MetricCard = ({ icon: Icon, label, value, sub, color = "text-blue-400" }) => (
  <div className="glass-card rounded-2xl p-5 flex items-start gap-4">
    <div className={`w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center ${color}`} style={{ background: "currentColor", opacity: 0.12 }}>
      <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.5} />
    </div>
    <div>
      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-2xl font-heading font-extrabold ${color}`}>{value}</p>
      {sub && <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#141a22] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-white font-semibold">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export const AnalyticsPanel = ({ analytics }) => {
  if (!analytics) return null;
  const { marketplace_distribution, records_over_time, data_quality, score_distribution, duplicate_rate, avg_score, flagged_count } = analytics;
  const dq = data_quality || {};

  return (
    <div className="space-y-5" data-testid="analytics-panel">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard icon={Gauge} label="Avg Lead Score" value={avg_score} color="text-blue-400" />
        <MetricCard icon={TrendingUp} label="Duplicate Rate" value={`${duplicate_rate}%`} color="text-amber-400" />
        <MetricCard icon={Flag} label="Flagged Records" value={flagged_count} color="text-red-400" />
        <MetricCard icon={Target} label="Total Records" value={dq.total || 0} color="text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-sm text-white mb-4">Marketplace Distribution</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={marketplace_distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0}>
                  {marketplace_distribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {marketplace_distribution.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-[10px] text-slate-400 font-code">{MP_LABELS[d.name] || d.name}</span>
                <span className="text-[10px] text-white font-bold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-sm text-white mb-4">Records Over Time</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={records_over_time}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#64748b" }} tickFormatter={v => v.slice(5)} />
                <YAxis tick={{ fontSize: 9, fill: "#64748b" }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Records" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-sm text-white mb-4">Data Quality</h3>
          {dq.total > 0 && (
            <div className="space-y-3">
              {[
                { label: "Has Email", val: dq.has_email, color: "bg-blue-500" },
                { label: "Has Phone", val: dq.has_phone, color: "bg-emerald-500" },
                { label: "Has VAT", val: dq.has_vat, color: "bg-violet-500" },
                { label: "Has Registration", val: dq.has_registration, color: "bg-amber-500" },
                { label: "Has Address", val: dq.has_address, color: "bg-sky-500" },
              ].map(item => {
                const pct = Math.round((item.val / dq.total) * 100);
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="text-white font-code font-bold">{pct}% <span className="text-slate-500">({item.val})</span></span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className={`h-full rounded-full ${item.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-heading font-semibold text-sm text-white mb-4">Score Distribution</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={score_distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="range" tick={{ fontSize: 9, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 9, fill: "#64748b" }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="count" name="Sellers" stroke="#3b82f6" fill="url(#scoreGradient)" strokeWidth={2} />
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
