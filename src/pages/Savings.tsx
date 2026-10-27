import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import PageHeader from '../components/PageHeader';
import ProgressBar, { formatCurrency } from '../components/ProgressBar';
import { Plus } from 'lucide-react';

export default function Savings() {
  const { savings, accounts } = useStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');

  const filteredSavings = filter === 'all' 
    ? savings 
    : savings.filter(s => s.accountId === filter);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader title="Tabungan" onAdd={() => navigate('/savings/add')} />
      
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Filter */}
        {accounts.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'all' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              Semua
            </button>
            {accounts.map(acc => (
              <button
                key={acc.id}
                onClick={() => setFilter(acc.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === acc.id 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                {acc.icon} {acc.name}
              </button>
            ))}
          </div>
        )}

        {/* Savings List */}
        {filteredSavings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🐷</div>
            <h3 className="font-semibold text-gray-900">Belum ada tabungan</h3>
            <p className="text-sm text-gray-500 mt-1">Buat tabungan baru dari halaman rekening</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSavings.map(saving => {
              const account = accounts.find(a => a.id === saving.accountId);
              const percentage = saving.targetAmount > 0 
                ? (saving.currentAmount / saving.targetAmount) * 100 
                : 0;
              
              return (
                <button
                  key={saving.id}
                  onClick={() => navigate(`/savings/${saving.id}`)}
                  className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    {saving.photo ? (
                      <img src={saving.photo} alt={saving.name} className="w-14 h-14 rounded-xl object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl">
                        🎯
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-900">{saving.name}</p>
                          <p className="text-xs text-gray-500">{account?.icon} {account?.name}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          percentage >= 100 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {saving.planType === 'monthly' ? 'Bulanan' : 'Mingguan'}
                        </span>
                      </div>
                      <div className="mt-2">
                        <ProgressBar current={saving.currentAmount} target={saving.targetAmount} size="sm" />
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          Target: {formatCurrency(saving.targetAmount)}
                        </span>
                        <span className="text-xs font-medium text-emerald-600">
                          {formatCurrency(saving.defaultNominal)}/{saving.planType === 'monthly' ? 'bln' : 'mgg'}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
