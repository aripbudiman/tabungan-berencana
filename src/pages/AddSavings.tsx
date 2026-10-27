import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import PageHeader from '../components/PageHeader';
import { Camera, X } from 'lucide-react';

export default function AddSavings() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const { accounts, addSavings } = useStore();
  
  const [name, setName] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(accountId || '');
  const [targetAmount, setTargetAmount] = useState('');
  const [planType, setPlanType] = useState<'monthly' | 'weekly'>('monthly');
  const [defaultNominal, setDefaultNominal] = useState('');
  const [photo, setPhoto] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedAccount || !targetAmount || !defaultNominal) return;

    addSavings({
      accountId: selectedAccount,
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      planType,
      defaultNominal: parseFloat(defaultNominal),
      photo: photo || undefined,
    });

    navigate('/savings');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader title="Tabungan Baru" showBack />
      
      <div className="max-w-lg mx-auto px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo */}
          <div className="flex justify-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {photo ? (
              <div className="relative">
                <img 
                  src={photo} 
                  alt="preview" 
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setPhoto('')}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition-colors"
              >
                <Camera size={24} />
                <span className="text-[10px] mt-1">Foto</span>
              </button>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Nama Tabungan</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tabungan Qurban, Kuliah, dll"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              required
            />
          </div>

          {/* Account */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Rekening</label>
            <select
              value={selectedAccount}
              onChange={e => setSelectedAccount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all appearance-none bg-white"
              required
            >
              <option value="">Pilih rekening...</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.icon} {acc.name}
                </option>
              ))}
            </select>
            {accounts.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                Belum ada rekening. <button type="button" onClick={() => navigate('/accounts')} className="underline">Buat dulu</button>
              </p>
            )}
          </div>

          {/* Target Amount */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Target Tabungan</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Rp</span>
              <input
                type="number"
                value={targetAmount}
                onChange={e => setTargetAmount(e.target.value)}
                placeholder="10000000"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                required
                min="1"
              />
            </div>
          </div>

          {/* Plan Type */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Jenis Plan</label>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setPlanType('monthly')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  planType === 'monthly' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                📅 Bulanan
              </button>
              <button
                type="button"
                onClick={() => setPlanType('weekly')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  planType === 'weekly' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                📆 Mingguan
              </button>
            </div>
          </div>

          {/* Default Nominal */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Nominal Default per {planType === 'monthly' ? 'Bulan' : 'Minggu'}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Rp</span>
              <input
                type="number"
                value={defaultNominal}
                onChange={e => setDefaultNominal(e.target.value)}
                placeholder="500000"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                required
                min="1"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Nilai ini akan jadi default saat mencatat transaksi, tapi bisa diubah tiap kali setor.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-3.5 rounded-xl font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200 mt-6"
          >
            Buat Tabungan
          </button>
        </form>
      </div>
    </div>
  );
}
