import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import PageHeader from '../components/PageHeader';
import ProgressBar, { formatCurrency } from '../components/ProgressBar';
import { Plus, ArrowDownRight, ArrowUpRight, Trash2, Image, X, Camera } from 'lucide-react';

export default function SavingsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { savings, accounts, transactions, addTransaction, removeTransaction, removeSavings, getSavingsTransactions } = useStore();
  
  const saving = savings.find(s => s.id === id);
  const account = saving ? accounts.find(a => a.id === saving.accountId) : null;
  const savingsTransactions = id ? getSavingsTransactions(id) : [];

  const [showAddTx, setShowAddTx] = useState(false);
  const [txType, setTxType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [txAmount, setTxAmount] = useState('');
  const [txNote, setTxNote] = useState('');
  const [txAttachment, setTxAttachment] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTxId, setDeleteTxId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!saving) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Tabungan tidak ditemukan</p>
          <button onClick={() => navigate('/savings')} className="text-emerald-600 mt-2">Kembali</button>
        </div>
      </div>
    );
  }

  const percentage = saving.targetAmount > 0 
    ? (saving.currentAmount / saving.targetAmount) * 100 
    : 0;

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(txAmount);
    if (!amount || amount <= 0) return;

    addTransaction({
      savingsId: saving.id,
      accountId: saving.accountId,
      type: txType,
      amount,
      note: txNote || undefined,
      attachment: txAttachment || undefined,
    });

    // Reset form
    setTxAmount('');
    setTxNote('');
    setTxAttachment('');
    setShowAddTx(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTxAttachment(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteSaving = () => {
    removeSavings(saving.id);
    navigate('/savings');
  };

  const handleDeleteTransaction = (txId: string) => {
    removeTransaction(txId);
    setDeleteTxId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader 
        title={saving.name} 
        showBack 
        rightAction={
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        }
      />
      
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Savings Info Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            {saving.photo ? (
              <img src={saving.photo} alt={saving.name} className="w-16 h-16 rounded-2xl object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-3xl">
                🎯
              </div>
            )}
            <div className="flex-1">
              <p className="text-xs text-gray-500">{account?.icon} {account?.name}</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(saving.currentAmount)}</p>
              <p className="text-xs text-gray-500">dari {formatCurrency(saving.targetAmount)}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <ProgressBar current={saving.currentAmount} target={saving.targetAmount} size="md" color="emerald" />
          </div>

          <div className="flex gap-3 mt-4">
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">Plan</p>
              <p className="font-semibold text-sm text-gray-900">
                {saving.planType === 'monthly' ? 'Bulanan' : 'Mingguan'}
              </p>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">Nominal/Plan</p>
              <p className="font-semibold text-sm text-gray-900">
                {formatCurrency(saving.defaultNominal)}
              </p>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">Progress</p>
              <p className="font-semibold text-sm text-gray-900">
                {percentage.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            setTxAmount(saving.defaultNominal.toString());
            setShowAddTx(true);
          }}
          className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
        >
          <Plus size={20} />
          Catat Transaksi
        </button>

        {/* Transaction History */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Riwayat Transaksi</h3>
          {savingsTransactions.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <p className="text-gray-500 text-sm">Belum ada transaksi</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
              {savingsTransactions.map(tx => (
                <div key={tx.id} className="p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'deposit' ? 'bg-emerald-50' : 'bg-red-50'
                    }`}>
                      {tx.type === 'deposit' 
                        ? <ArrowDownRight size={18} className="text-emerald-500" />
                        : <ArrowUpRight size={18} className="text-red-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {tx.type === 'deposit' ? 'Setor' : 'Tarik'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {tx.note || 'Tanpa catatan'}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(tx.createdAt).toLocaleDateString('id-ID', { 
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${
                        tx.type === 'deposit' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                      <button
                        onClick={() => setDeleteTxId(tx.id)}
                        className="text-[10px] text-gray-400 hover:text-red-500 mt-0.5"
                      >
                        hapus
                      </button>
                    </div>
                  </div>
                  {tx.attachment && (
                    <div className="mt-2 ml-13">
                      <img 
                        src={tx.attachment} 
                        alt="attachment" 
                        className="w-20 h-20 rounded-lg object-cover border border-gray-100"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddTx && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={() => setShowAddTx(false)}>
          <div 
            className="w-full max-w-lg bg-white rounded-t-3xl p-6 animate-slide-up max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Catat Transaksi</h3>
              <button onClick={() => setShowAddTx(false)} className="text-gray-400 text-2xl">&times;</button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              {/* Type Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setTxType('deposit')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    txType === 'deposit' 
                      ? 'bg-emerald-500 text-white shadow-sm' 
                      : 'text-gray-600'
                  }`}
                >
                  ↓ Setor
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('withdrawal')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    txType === 'withdrawal' 
                      ? 'bg-red-500 text-white shadow-sm' 
                      : 'text-gray-600'
                  }`}
                >
                  ↑ Tarik
                </button>
              </div>

              {/* Amount */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nominal</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Rp</span>
                  <input
                    type="number"
                    value={txAmount}
                    onChange={e => setTxAmount(e.target.value)}
                    placeholder="0"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-lg font-semibold"
                    required
                    min="1"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Default: {formatCurrency(saving.defaultNominal)}
                </p>
                {/* Quick amounts */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setTxAmount(saving.defaultNominal.toString())}
                    className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-200"
                  >
                    Default ({formatCurrency(saving.defaultNominal)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxAmount((saving.defaultNominal * 2).toString())}
                    className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-200"
                  >
                    2x ({formatCurrency(saving.defaultNominal * 2)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxAmount((saving.targetAmount - saving.currentAmount).toString())}
                    className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-200"
                  >
                    Sisa Target
                  </button>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Catatan (opsional)</label>
                <input
                  type="text"
                  value={txNote}
                  onChange={e => setTxNote(e.target.value)}
                  placeholder="Untuk beli apa, dari mana, dll..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                />
              </div>

              {/* Attachment */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Lampiran (opsional)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {txAttachment ? (
                  <div className="relative">
                    <img 
                      src={txAttachment} 
                      alt="preview" 
                      className="w-full h-32 object-cover rounded-xl border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setTxAttachment('')}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
                  >
                    <Camera size={18} />
                    <span className="text-sm">Foto struk / bukti</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-medium text-white transition-colors ${
                  txType === 'deposit' 
                    ? 'bg-emerald-500 hover:bg-emerald-600' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {txType === 'deposit' ? 'Setor' : 'Tarik'} {txAmount ? formatCurrency(parseFloat(txAmount)) : ''}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Savings Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-center">Hapus Tabungan?</h3>
            <p className="text-sm text-gray-500 text-center mt-2">
              Tabungan "{saving.name}" dan semua transaksinya akan dihapus permanen.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 font-medium text-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteSaving}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Transaction Confirmation */}
      {deleteTxId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-center">Hapus Transaksi?</h3>
            <p className="text-sm text-gray-500 text-center mt-2">
              Saldo tabungan akan disesuaikan kembali.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteTxId(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 font-medium text-gray-700"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteTransaction(deleteTxId)}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
