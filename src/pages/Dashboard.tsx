import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import PageHeader from '../components/PageHeader';
import ProgressBar, { formatCurrency } from '../components/ProgressBar';
import { TrendingUp, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Dashboard() {
  const { accounts, savings, transactions } = useStore();
  const navigate = useNavigate();

  const totalSaved = savings.reduce((sum, s) => sum + s.currentAmount, 0);
  const totalTarget = savings.reduce((sum, s) => sum + s.targetAmount, 0);
  const recentTransactions = [...transactions].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader title="TabunganKu" />
      
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Summary Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-xl shadow-emerald-200/50">
          <p className="text-emerald-100 text-sm font-medium">Total Tabungan</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(totalSaved)}</p>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-emerald-100 mb-1">
              <span>Progress</span>
              <span>{totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(0) : 0}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0}%` }}
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
              <Wallet size={14} />
              <span className="text-xs">{accounts.length} Rekening</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
              <PiggyBank size={14} />
              <span className="text-xs">{savings.length} Tabungan</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => navigate('/accounts')}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
          >
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center mx-auto">
              <Wallet size={18} className="text-blue-500" />
            </div>
            <p className="text-[10px] text-gray-500 mt-2">Rekening</p>
            <p className="text-base font-bold text-gray-900">{accounts.length}</p>
          </button>
          <button 
            onClick={() => navigate('/savings')}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
          >
            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto">
              <PiggyBank size={18} className="text-emerald-500" />
            </div>
            <p className="text-[10px] text-gray-500 mt-2">Tabungan</p>
            <p className="text-base font-bold text-gray-900">{savings.length}</p>
          </button>
          <button 
            onClick={() => navigate(accounts.length > 0 ? '/savings/add' : '/accounts')}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
          >
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center mx-auto">
              <TrendingUp size={18} className="text-amber-500" />
            </div>
            <p className="text-[10px] text-gray-500 mt-2">Tambah</p>
            <p className="text-base font-bold text-gray-900">+</p>
          </button>
        </div>

        {/* Active Savings */}
        {savings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-900">Tabungan Aktif</h2>
              <button onClick={() => navigate('/savings')} className="text-sm text-emerald-600 font-medium">
                Lihat Semua
              </button>
            </div>
            <div className="space-y-3">
              {savings.slice(0, 3).map(saving => {
                const account = accounts.find(a => a.id === saving.accountId);
                return (
                  <button
                    key={saving.id}
                    onClick={() => navigate(`/savings/${saving.id}`)}
                    className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      {saving.photo ? (
                        <img src={saving.photo} alt={saving.name} className="w-12 h-12 rounded-xl object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-lg">
                          🎯
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{saving.name}</p>
                        <p className="text-xs text-gray-500">{account?.name || 'Tanpa rekening'}</p>
                        <div className="mt-2">
                          <ProgressBar current={saving.currentAmount} target={saving.targetAmount} size="sm" />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Transaksi Terakhir</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
              {recentTransactions.map(tx => {
                const saving = savings.find(s => s.id === tx.savingsId);
                return (
                  <div key={tx.id} className="flex items-center gap-3 p-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      tx.type === 'deposit' ? 'bg-emerald-50' : 'bg-red-50'
                    }`}>
                      {tx.type === 'deposit' 
                        ? <ArrowDownRight size={16} className="text-emerald-500" />
                        : <ArrowUpRight size={16} className="text-red-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{saving?.name || 'Tabungan'}</p>
                      <p className="text-xs text-gray-500 truncate">{tx.note || 'Tanpa catatan'}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        tx.type === 'deposit' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(tx.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {savings.length === 0 && accounts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-lg font-semibold text-gray-900">Mulai Menabung!</h3>
            <p className="text-sm text-gray-500 mt-2 mb-6">
              Buat rekening dan tabungan pertama Anda untuk mulai mencatat perjalanan menabung.
            </p>
            <button
              onClick={() => navigate('/accounts')}
              className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
            >
              Buat Rekening Pertama
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
