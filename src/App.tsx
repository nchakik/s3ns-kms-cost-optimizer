import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  Layers, 
  Database, 
  Calendar, 
  TrendingUp, 
  Info,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sun,
  Moon,
  Euro
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface CalculationResults {
  numKeys: number;
  monthlyCost: number;
  annualCost: number;
  totalCost: number;
}

// --- Components ---

const Slider = ({ 
  label, 
  value, 
  onChange, 
  min = 1, 
  max = 20, 
  icon: Icon,
  unit = "",
  isDark = false
}: { 
  label: string; 
  value: number; 
  onChange: (val: number) => void; 
  min?: number; 
  max?: number;
  icon: any;
  unit?: string;
  isDark?: boolean;
}) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <label className={cn(
        "flex items-center gap-2 text-sm font-medium uppercase tracking-wider",
        isDark ? "text-zinc-400" : "text-zinc-500"
      )}>
        <Icon size={16} className="text-emerald-500" />
        {label}
      </label>
      <span className={cn(
        "text-lg font-mono font-bold px-2 py-1 rounded border transition-colors",
        isDark 
          ? "text-white bg-zinc-800 border-zinc-700" 
          : "text-zinc-900 bg-zinc-100 border-zinc-200"
      )}>
        {value}{unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className={cn(
        "w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all",
        isDark ? "bg-zinc-800" : "bg-zinc-200"
      )}
    />
    <div className={cn(
      "flex justify-between text-[10px] font-mono transition-colors",
      isDark ? "text-zinc-600" : "text-zinc-400"
    )}>
      <span>{min}</span>
      <span>{max}</span>
    </div>
  </div>
);

const CostCard = ({ 
  title, 
  results, 
  isMutualized,
  savings,
  isDark
}: { 
  title: string; 
  results: CalculationResults; 
  isMutualized: boolean;
  savings?: number;
  isDark: boolean;
}) => (
  <motion.div 
    layout
    className={cn(
      "relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 shadow-sm",
      isMutualized 
        ? isDark 
          ? "bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_40px_-15px_rgba(16,185,129,0.2)]"
          : "bg-emerald-50 border-emerald-200 shadow-[0_8px_30px_rgb(16,185,129,0.05)]" 
        : isDark
          ? "bg-zinc-900/50 border-zinc-800"
          : "bg-white border-zinc-200"
    )}
  >
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className={cn(
          "text-xs font-bold uppercase tracking-widest mb-1",
          isMutualized 
            ? isDark ? "text-emerald-400" : "text-emerald-700" 
            : isDark ? "text-zinc-500" : "text-zinc-400"
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-2xl font-bold transition-colors",
          isDark ? "text-white" : "text-zinc-900"
        )}>
          {results.totalCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </p>
        <p className={cn(
          "text-xs mt-1 transition-colors",
          isDark ? "text-zinc-500" : "text-zinc-500"
        )}>Coût cumulé sur {results.numKeys / (results.numKeys > 0 ? results.numKeys : 1)} ans (estimé)</p>
      </div>
      {isMutualized ? (
        <div className={cn(
          "p-2 rounded-lg transition-colors",
          isDark ? "bg-emerald-500/20" : "bg-emerald-100"
        )}>
          <CheckCircle2 className="text-emerald-500" size={24} />
        </div>
      ) : (
        <div className={cn(
          "p-2 rounded-lg transition-colors",
          isDark ? "bg-zinc-800" : "bg-zinc-100"
        )}>
          <Layers className={isDark ? "text-zinc-500" : "text-zinc-400"} size={24} />
        </div>
      )}
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <p className={cn(
          "text-[10px] uppercase font-semibold tracking-tighter transition-colors",
          isDark ? "text-zinc-500" : "text-zinc-400"
        )}>Mensuel</p>
        <p className={cn(
          "text-lg font-mono font-bold transition-colors",
          isDark ? "text-zinc-200" : "text-zinc-800"
        )}>
          {results.monthlyCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </p>
      </div>
      <div className="space-y-1">
        <p className={cn(
          "text-[10px] uppercase font-semibold tracking-tighter transition-colors",
          isDark ? "text-zinc-500" : "text-zinc-400"
        )}>Annuel</p>
        <p className={cn(
          "text-lg font-mono font-bold transition-colors",
          isDark ? "text-zinc-200" : "text-zinc-800"
        )}>
          {results.annualCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </p>
      </div>
    </div>

    <div className={cn(
      "mt-6 pt-6 border-t flex items-center justify-between transition-colors",
      isDark ? "border-zinc-800/50" : "border-zinc-100"
    )}>
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-2 h-2 rounded-full transition-colors",
          isDark ? "bg-zinc-700" : "bg-zinc-300"
        )} />
        <span className={cn(
          "text-xs font-mono transition-colors",
          isDark ? "text-zinc-400" : "text-zinc-500"
        )}>{results.numKeys} Clés KMS</span>
      </div>
      {savings !== undefined && savings > 0 && (
        <div className={cn(
          "flex items-center gap-1 font-bold text-sm transition-colors",
          isDark ? "text-emerald-400" : "text-emerald-600"
        )}>
          <TrendingUp size={14} />
          -{((savings / (results.totalCost + savings)) * 100).toFixed(0)}% d'économie
        </div>
      )}
    </div>
  </motion.div>
);

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [domains, setDomains] = useState(2);
  const [environments, setEnvironments] = useState(3);
  const [projects, setProjects] = useState(5);
  const [years, setYears] = useState(3);
  const [keyPrice, setKeyPrice] = useState(6);

  const isDark = theme === 'dark';

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const perProjectResults = useMemo((): CalculationResults => {
    const numKeys = domains * environments * projects * years;
    const monthlyCost = keyPrice * domains * environments * projects * years;
    const annualCost = (keyPrice * 12) * domains * environments * projects * years;
    const totalCost = (keyPrice * 6) * domains * environments * projects * years * (years + 1);
    return { numKeys, monthlyCost, annualCost, totalCost };
  }, [domains, environments, projects, years, keyPrice]);

  const mutualizedResults = useMemo((): CalculationResults => {
    const numKeys = domains * environments * years;
    const monthlyCost = keyPrice * domains * environments * years;
    const annualCost = (keyPrice * 12) * domains * environments * years;
    const totalCost = (keyPrice * 6) * domains * environments * years * (years + 1);
    return { numKeys, monthlyCost, annualCost, totalCost };
  }, [domains, environments, years, keyPrice]);

  const savings = perProjectResults.totalCost - mutualizedResults.totalCost;

  const chartData = [
    {
      name: 'Par Projet',
      total: perProjectResults.totalCost,
      monthly: perProjectResults.monthlyCost,
      annual: perProjectResults.annualCost,
    },
    {
      name: 'Mutualisé',
      total: mutualizedResults.totalCost,
      monthly: mutualizedResults.monthlyCost,
      annual: mutualizedResults.annualCost,
    }
  ];

  return (
    <div className={cn(
      "min-h-screen font-sans transition-colors duration-300",
      isDark ? "bg-[#050505] text-zinc-200" : "bg-zinc-50 text-zinc-600",
      isDark ? "selection:bg-emerald-500/30" : "selection:bg-emerald-100"
    )}>
      {/* Header */}
      <header className={cn(
        "border-b backdrop-blur-xl sticky top-0 z-50 transition-colors duration-300",
        isDark ? "border-zinc-900 bg-black/50" : "border-zinc-200 bg-white/80"
      )}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-colors",
              isDark ? "bg-emerald-500 shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]" : "bg-emerald-600"
            )}>
              <Calculator size={18} className={isDark ? "text-black" : "text-white"} />
            </div>
            <h1 className={cn(
              "font-bold tracking-tight transition-colors",
              isDark ? "text-white" : "text-zinc-900"
            )}>ALM KMS Cost Simulator</h1>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
            <div className={cn(
              "hidden md:flex items-center gap-6 text-xs font-medium uppercase tracking-widest transition-colors",
              isDark ? "text-zinc-500" : "text-zinc-400"
            )}>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live Calculator</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-700" /> v1.1.0</span>
            </div>
            
            <button 
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-full border transition-all hover:scale-110 active:scale-95",
                isDark 
                  ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white" 
                  : "bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900 shadow-sm"
              )}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Controls Section */}
          <div className="lg:col-span-4 space-y-8">
            <section className={cn(
              "border rounded-3xl p-8 space-y-8 shadow-sm transition-colors duration-300",
              isDark ? "bg-zinc-900/30 border-zinc-800" : "bg-white border-zinc-200"
            )}>
              <div className="space-y-2">
                <h2 className={cn(
                  "text-sm font-bold uppercase tracking-widest transition-colors",
                  isDark ? "text-emerald-500" : "text-emerald-600"
                )}>Paramètres</h2>
                <p className="text-xs text-zinc-500">Ajustez les curseurs pour simuler votre infrastructure.</p>
              </div>

              <div className="space-y-10">
                <Slider 
                  label="Domaines" 
                  value={domains} 
                  onChange={setDomains} 
                  icon={Layers} 
                  max={30}
                  isDark={isDark}
                />
                <Slider 
                  label="Environnements" 
                  value={environments} 
                  onChange={setEnvironments} 
                  icon={Database} 
                  max={10}
                  isDark={isDark}
                />
                <Slider 
                  label="Projets par Env" 
                  value={projects} 
                  onChange={setProjects} 
                  icon={Calculator} 
                  max={50}
                  isDark={isDark}
                />
                <Slider 
                  label="Années d'historique" 
                  value={years} 
                  onChange={setYears} 
                  icon={Calendar} 
                  max={10}
                  unit=" ans"
                  isDark={isDark}
                />
                <Slider 
                  label="Prix de la clé" 
                  value={keyPrice} 
                  onChange={setKeyPrice} 
                  icon={Euro} 
                  min={1}
                  max={50}
                  unit=" €"
                  isDark={isDark}
                />
              </div>

              <div className={cn(
                "pt-6 border-t transition-colors",
                isDark ? "border-zinc-800" : "border-zinc-100"
              )}>
                <div className={cn(
                  "flex items-start gap-3 p-4 rounded-2xl border transition-colors",
                  isDark ? "bg-zinc-800/30 border-zinc-700/50" : "bg-zinc-50 border-zinc-100"
                )}>
                  <Info size={18} className={isDark ? "text-emerald-500" : "text-emerald-600"} />
                  <p className={cn(
                    "text-[11px] leading-relaxed transition-colors",
                    isDark ? "text-zinc-400" : "text-zinc-500"
                  )}>
                    Le coût d'une clé KMS est configurable. 
                    Le calcul cumulé prend en compte l'historique croissant des clés sur la période définie.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CostCard 
                title="Modèle : Clé par Projet" 
                results={perProjectResults} 
                isMutualized={false} 
                isDark={isDark}
              />
              <CostCard 
                title="Modèle : Clé par Environnement" 
                results={mutualizedResults} 
                isMutualized={true} 
                savings={savings}
                isDark={isDark}
              />
            </div>

            {/* Chart Section */}
            <section className={cn(
              "border rounded-3xl p-8 shadow-sm transition-colors duration-300",
              isDark ? "bg-zinc-900/30 border-zinc-800" : "bg-white border-zinc-200"
            )}>
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h2 className={cn(
                    "text-sm font-bold uppercase tracking-widest transition-colors",
                    isDark ? "text-white" : "text-zinc-900"
                  )}>Comparaison Visuelle</h2>
                  <p className="text-xs text-zinc-500">Impact financier sur le coût total cumulé.</p>
                </div>
                <div className={cn(
                  "flex items-center gap-4 text-[10px] font-mono uppercase tracking-tighter transition-colors",
                  isDark ? "text-zinc-500" : "text-zinc-400"
                )}>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded", isDark ? "bg-zinc-700" : "bg-zinc-200")} /> Par Projet
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-500" /> Mutualisé
                  </div>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={isDark ? "#18181b" : "#f1f5f9"} 
                      vertical={false} 
                    />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: isDark ? '#71717a' : '#94a3b8', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: isDark ? '#71717a' : '#94a3b8', fontSize: 10 }}
                      tickFormatter={(value) => `${value} €`}
                    />
                    <Tooltip 
                      cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                      contentStyle={{ 
                        backgroundColor: isDark ? '#09090b' : '#fff', 
                        border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: isDark ? 'none' : '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      itemStyle={{ color: isDark ? '#fff' : '#1e293b' }}
                      formatter={(value: number) => [`${value.toLocaleString()} €`, 'Coût Total']}
                    />
                    <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={60}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? (isDark ? '#3f3f46' : '#e2e8f0') : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Summary Insights */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={cn(
                "border rounded-2xl p-6 space-y-3 shadow-sm transition-colors duration-300",
                isDark ? "bg-zinc-900/30 border-zinc-800" : "bg-white border-zinc-200"
              )}>
                <div className={cn("p-2 w-fit rounded-lg", isDark ? "bg-zinc-800" : "bg-zinc-50")}>
                  <ArrowRight size={18} className="text-zinc-400" />
                </div>
                <h4 className={cn("text-xs font-bold uppercase tracking-widest", isDark ? "text-zinc-500" : "text-zinc-400")}>Verdict</h4>
                <p className={cn("text-sm leading-relaxed", isDark ? "text-zinc-300" : "text-zinc-600")}>
                  Le nombre de projets <span className={cn("font-bold", isDark ? "text-emerald-400" : "text-emerald-600")}>n'a plus d'impact</span> sur le coût en modèle mutualisé.
                </p>
              </div>
              <div className={cn(
                "border rounded-2xl p-6 space-y-3 shadow-sm transition-colors duration-300",
                isDark ? "bg-zinc-900/30 border-zinc-800" : "bg-white border-zinc-200"
              )}>
                <div className={cn("p-2 w-fit rounded-lg", isDark ? "bg-zinc-800" : "bg-zinc-50")}>
                  <Calculator size={18} className="text-zinc-400" />
                </div>
                <h4 className={cn("text-xs font-bold uppercase tracking-widest", isDark ? "text-zinc-500" : "text-zinc-400")}>Formule</h4>
                <p className={cn("text-sm font-mono", isDark ? "text-zinc-300" : "text-zinc-600")}>
                  {keyPrice}€ × D × E × A
                </p>
              </div>
              <div className={cn(
                "border rounded-2xl p-6 space-y-3 shadow-sm transition-colors duration-300",
                isDark ? "bg-emerald-950/20 border-emerald-500/30" : "bg-emerald-50 border-emerald-100"
              )}>
                <div className={cn("p-2 w-fit rounded-lg", isDark ? "bg-emerald-500/20" : "bg-emerald-100")}>
                  <TrendingUp size={18} className="text-emerald-500" />
                </div>
                <h4 className={cn("text-xs font-bold uppercase tracking-widest", isDark ? "text-emerald-400" : "text-emerald-700")}>Économie</h4>
                <p className={cn("text-sm leading-relaxed", isDark ? "text-zinc-300" : "text-zinc-600")}>
                  Vous économisez <span className={cn("font-bold", isDark ? "text-emerald-400" : "text-emerald-700")}>{savings.toLocaleString()} €</span> sur {years} ans.
                </p>
              </div>
            </section>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className={cn(
        "border-t py-12 mt-12 transition-colors duration-300",
        isDark ? "border-zinc-900 bg-black/30" : "border-zinc-200 bg-white"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
            <Calculator size={14} />
            <span>KMS Cost Calculator &copy; 2026</span>
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <a href="#" className="hover:text-emerald-500 transition-colors">Documentation</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">KMS Quotas</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">IAM Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

