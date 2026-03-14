import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Layers, 
  Database, 
  Calendar, 
  TrendingUp, 
  Info,
  ArrowRight,
  CheckCircle2,
  XCircle
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
  unit = ""
}: { 
  label: string; 
  value: number; 
  onChange: (val: number) => void; 
  min?: number; 
  max?: number;
  icon: any;
  unit?: string;
}) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 uppercase tracking-wider">
        <Icon size={16} className="text-emerald-500" />
        {label}
      </label>
      <span className="text-lg font-mono font-bold text-white bg-zinc-800 px-2 py-1 rounded border border-zinc-700">
        {value}{unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all"
    />
    <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  </div>
);

const CostCard = ({ 
  title, 
  results, 
  isMutualized,
  savings 
}: { 
  title: string; 
  results: CalculationResults; 
  isMutualized: boolean;
  savings?: number;
}) => (
  <motion.div 
    layout
    className={cn(
      "relative overflow-hidden rounded-2xl border p-6 transition-all duration-300",
      isMutualized 
        ? "bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_40px_-15px_rgba(16,185,129,0.2)]" 
        : "bg-zinc-900/50 border-zinc-800"
    )}
  >
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className={cn(
          "text-xs font-bold uppercase tracking-widest mb-1",
          isMutualized ? "text-emerald-400" : "text-zinc-500"
        )}>
          {title}
        </h3>
        <p className="text-2xl font-bold text-white">
          {results.totalCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </p>
        <p className="text-xs text-zinc-500 mt-1">Coût cumulé sur {results.numKeys / (results.numKeys > 0 ? results.numKeys : 1)} ans (estimé)</p>
      </div>
      {isMutualized ? (
        <div className="bg-emerald-500/20 p-2 rounded-lg">
          <CheckCircle2 className="text-emerald-500" size={24} />
        </div>
      ) : (
        <div className="bg-zinc-800 p-2 rounded-lg">
          <Layers className="text-zinc-500" size={24} />
        </div>
      )}
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <p className="text-[10px] uppercase text-zinc-500 font-semibold tracking-tighter">Mensuel</p>
        <p className="text-lg font-mono font-bold text-zinc-200">
          {results.monthlyCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </p>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] uppercase text-zinc-500 font-semibold tracking-tighter">Annuel</p>
        <p className="text-lg font-mono font-bold text-zinc-200">
          {results.annualCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </p>
      </div>
    </div>

    <div className="mt-6 pt-6 border-t border-zinc-800/50 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-zinc-700" />
        <span className="text-xs text-zinc-400 font-mono">{results.numKeys} Clés KMS</span>
      </div>
      {savings !== undefined && savings > 0 && (
        <div className="flex items-center gap-1 text-emerald-400 font-bold text-sm">
          <TrendingUp size={14} />
          -{((savings / (results.totalCost + savings)) * 100).toFixed(0)}% d'économie
        </div>
      )}
    </div>
  </motion.div>
);

export default function App() {
  const [domains, setDomains] = useState(2);
  const [environments, setEnvironments] = useState(3);
  const [projects, setProjects] = useState(5);
  const [years, setYears] = useState(3);

  const perProjectResults = useMemo((): CalculationResults => {
    const numKeys = domains * environments * projects * years;
    const monthlyCost = 6 * domains * environments * projects * years;
    const annualCost = 72 * domains * environments * projects * years;
    const totalCost = 36 * domains * environments * projects * years * (years + 1);
    return { numKeys, monthlyCost, annualCost, totalCost };
  }, [domains, environments, projects, years]);

  const mutualizedResults = useMemo((): CalculationResults => {
    const numKeys = domains * environments * years;
    const monthlyCost = 6 * domains * environments * years;
    const annualCost = 72 * domains * environments * years;
    const totalCost = 36 * domains * environments * years * (years + 1);
    return { numKeys, monthlyCost, annualCost, totalCost };
  }, [domains, environments, years]);

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
    <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]">
              <Calculator size={18} className="text-black" />
            </div>
            <h1 className="font-bold tracking-tight text-white">KMS Cost Optimizer</h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-500 uppercase tracking-widest">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live Calculator</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-700" /> v1.0.0</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Controls Section */}
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 space-y-8">
              <div className="space-y-2">
                <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-500">Paramètres</h2>
                <p className="text-xs text-zinc-500">Ajustez les curseurs pour simuler votre infrastructure.</p>
              </div>

              <div className="space-y-10">
                <Slider 
                  label="Domaines" 
                  value={domains} 
                  onChange={setDomains} 
                  icon={Layers} 
                  max={10}
                />
                <Slider 
                  label="Environnements" 
                  value={environments} 
                  onChange={setEnvironments} 
                  icon={Database} 
                  max={10}
                />
                <Slider 
                  label="Projets par Env" 
                  value={projects} 
                  onChange={setProjects} 
                  icon={Calculator} 
                  max={50}
                />
                <Slider 
                  label="Années d'historique" 
                  value={years} 
                  onChange={setYears} 
                  icon={Calendar} 
                  max={10}
                  unit=" ans"
                />
              </div>

              <div className="pt-6 border-t border-zinc-800">
                <div className="flex items-start gap-3 bg-zinc-800/30 p-4 rounded-2xl border border-zinc-700/50">
                  <Info size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed text-zinc-400">
                    Le coût d'une clé KMS est fixé à <span className="text-white font-bold">6 € / mois</span>. 
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
              />
              <CostCard 
                title="Modèle : Clé par Environnement" 
                results={mutualizedResults} 
                isMutualized={true} 
                savings={savings}
              />
            </div>

            {/* Chart Section */}
            <section className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-white">Comparaison Visuelle</h2>
                  <p className="text-xs text-zinc-500">Impact financier sur le coût total cumulé.</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-tighter">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-zinc-700" /> Par Projet
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-500" /> Mutualisé
                  </div>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717a', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717a', fontSize: 10 }}
                      tickFormatter={(value) => `${value} €`}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ 
                        backgroundColor: '#09090b', 
                        border: '1px solid #27272a',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: number) => [`${value.toLocaleString()} €`, 'Coût Total']}
                    />
                    <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={60}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#3f3f46' : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Summary Insights */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 space-y-3">
                <div className="p-2 bg-zinc-800 w-fit rounded-lg">
                  <ArrowRight size={18} className="text-zinc-400" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Verdict</h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Le nombre de projets <span className="text-emerald-400 font-bold">n'a plus d'impact</span> sur le coût en modèle mutualisé.
                </p>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 space-y-3">
                <div className="p-2 bg-zinc-800 w-fit rounded-lg">
                  <Calculator size={18} className="text-zinc-400" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Formule</h4>
                <p className="text-sm font-mono text-zinc-300">
                  6€ × D × E × A
                </p>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 space-y-3">
                <div className="p-2 bg-emerald-500/20 w-fit rounded-lg">
                  <TrendingUp size={18} className="text-emerald-500" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Économie</h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Vous économisez <span className="text-white font-bold">{savings.toLocaleString()} €</span> sur {years} ans.
                </p>
              </div>
            </section>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 mt-12 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-zinc-600 text-xs font-mono">
            <Calculator size={14} />
            <span>KMS Cost Calculator &copy; 2026</span>
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <a href="#" className="hover:text-emerald-500 transition-colors">Documentation</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">KMS Quotas</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">IAM Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
