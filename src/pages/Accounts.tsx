import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import PageHeader from '../components/PageHeader';
import ProgressBar, { formatCurrency } from '../components/ProgressBar';
import { Wallet, Trash2, Edit2, Plus } from 'lucide-react';

const ACCOUNT_ICONS = ['🏦', '💳', '🏧', '💰', '🪙', '📱'];
const ACCOUNT_COLORS = ['from-blue-500 to-indigo-600', 'from-purple-500 to-pink-600', 'from-orange-500 to-red-600', 'from-emerald-500 to-teal-600', 'from-cyan-500 to-blue-600', 'from-amber-500 to-orange-600'];

export default function Accounts() {
  const { accounts, getAccountSavings, getAccountBalance, addAccount, removeAccount } = useStore();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [icon, setIcon] = useState('🏦');
  const [color, setColor] = useState(ACCOUNT_COLORS[0]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    if (editId) {
      // Update handled by store
    } else {
      addAccount({ name, accountNumber, icon, color });
    }
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setName('');
    setAccountNumber('');
    setIcon('🏦');
    setColor(ACCOUNT_COLORS[0]);
  };

  const handleDelete = (id: string) => {
    removeAccount(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader title="Rekening" onAdd={() => setShowForm(true)} />
      
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={resetForm}>
            <div 
              className="w-full max-w-lg bg-white rounded-t-3xl p-6 animate-slide-up"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Tambah Rekening</h3>
                <button onClick={resetForm} className="text-gray-400 text-2xl">&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Nama Rekening</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Bank Jago Syariah"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">No. Rekening</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                    placeholder="1234567890"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Ikon</label>
                  <div className="flex gap-2">
                    {ACCOUNT_ICONS.map(i => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setIcon(i)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                          icon === i ? 'bg-emerald-100 ring-2 ring-emerald-500' : 'bg-gray-100'
                        }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Warna</label>
                  <div className="flex gap-2">
                    {ACCOUNT_COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c} transition-all ${
                          color === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-500 text-white py-3 rounded-xl font-medium hover:bg-emerald-600 transition-colors"
                >
                  Simpan
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
              <h3 className="text-lg font-bold text-center">Hapus Rekening?</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                Semua tabungan di rekening ini juga akan terhapus.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 font-medium text-gray-700"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Account List */}
        {accounts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🏦</div>
            <h3 className="font-semibold text-gray-900">Belum ada rekening</h3>
            <p className="text-sm text-gray-500 mt-1">Tambahkan rekening untuk mulai menabung</p>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map(account => {
              const accountSavings = getAccountSavings(account.id);
              const balance = getAccountBalance(account.id);
              return (
                <div
                  key={account.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className={`bg-gradient-to-r ${account.color || ACCOUNT_COLORS[0]} p-4 text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{account.icon}</span>
                        <div>
                          <p className="font-bold">{account.name}</p>
                          <p className="text-xs opacity-80">{account.accountNumber || 'Tanpa no. rekening'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setDeleteConfirm(account.id)}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="mt-3 flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-80">Saldo Tabungan</p>
                        <p className="text-lg font-bold">{formatCurrency(balance)}</p>
                      </div>
                      <p className="text-xs opacity-80">{accountSavings.length} tabungan</p>
                    </div>
                  </div>
                  
                  <div className="p-3 border-t border-gray-50">
                    <button
                      onClick={() => navigate(`/savings/add/${account.id}`)}
                      className="w-full py-2 rounded-xl border border-dashed border-gray-200 text-sm text-gray-500 hover:border-emerald-300 hover:text-emerald-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus size={14} />
                      Tambah Tabungan
                    </button>
                  </div>
                  {accountSavings.length > 0 && (
                    <div className="p-3 space-y-2">
                      {accountSavings.map(saving => (
                        <button
                          key={saving.id}
                          onClick={() => navigate(`/savings/${saving.id}`)}
                          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors text-left"
                        >
                          {saving.photo ? (
                            <img src={saving.photo} alt="" className="w-9 h-9 rounded-lg object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-sm">🎯</div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{saving.name}</p>
                            <ProgressBar current={saving.currentAmount} target={saving.targetAmount} size="sm" showLabel={false} />
                          </div>
                          <p className="text-xs font-medium text-gray-600">
                            {((saving.currentAmount / saving.targetAmount) * 100).toFixed(0)}%
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
