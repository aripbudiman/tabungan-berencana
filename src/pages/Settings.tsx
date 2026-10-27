import { useState } from 'react';
import { useStore } from '../store/useStore';
import PageHeader from '../components/PageHeader';
import { Cloud, CloudOff, Database, Trash2 } from 'lucide-react';

export default function Settings() {
  const { firebaseConnected, firebaseConfig, connectFirebase, accounts, savings, transactions } = useStore();
  
  const [showFirebaseForm, setShowFirebaseForm] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [databaseURL, setDatabaseURL] = useState('');
  const [projectId, setProjectId] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [messagingSenderId, setMessagingSenderId] = useState('');
  const [appId, setAppId] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const success = connectFirebase({
      apiKey, authDomain, databaseURL, projectId,
      storageBucket, messagingSenderId, appId
    });
    if (success) {
      setShowFirebaseForm(false);
    }
  };

  const handleClearData = () => {
    localStorage.removeItem('accounts');
    localStorage.removeItem('savings');
    localStorage.removeItem('transactions');
    window.location.reload();
  };

  const handleDisconnectFirebase = () => {
    localStorage.removeItem('firebaseConfig');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader title="Pengaturan" />
      
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Firebase Status */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              firebaseConnected ? 'bg-emerald-50' : 'bg-gray-100'
            }`}>
              {firebaseConnected 
                ? <Cloud size={20} className="text-emerald-500" />
                : <CloudOff size={20} className="text-gray-400" />
              }
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Firebase Realtime Database</p>
              <p className="text-xs text-gray-500">
                {firebaseConnected ? 'Terhubung' : 'Belum terhubung'}
              </p>
            </div>
            {firebaseConnected ? (
              <button
                onClick={handleDisconnectFirebase}
                className="text-xs text-red-500 font-medium px-3 py-1.5 rounded-lg bg-red-50"
              >
                Putuskan
              </button>
            ) : (
              <button
                onClick={() => setShowFirebaseForm(true)}
                className="text-xs text-emerald-600 font-medium px-3 py-1.5 rounded-lg bg-emerald-50"
              >
                Hubungkan
              </button>
            )}
          </div>
          
          {firebaseConnected && firebaseConfig && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500">Project: <span className="font-medium text-gray-700">{firebaseConfig.projectId}</span></p>
              <p className="text-xs text-gray-500">Database: <span className="font-medium text-gray-700 truncate block">{firebaseConfig.databaseURL}</span></p>
            </div>
          )}
        </div>

        {/* Firebase Config Form */}
        {showFirebaseForm && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Konfigurasi Firebase</h3>
            <form onSubmit={handleConnect} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">API Key</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Auth Domain</label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={e => setAuthDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Database URL</label>
                <input
                  type="text"
                  value={databaseURL}
                  onChange={e => setDatabaseURL(e.target.value)}
                  placeholder="https://your-project-default-rtdb.firebaseio.com"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Project ID</label>
                <input
                  type="text"
                  value={projectId}
                  onChange={e => setProjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Storage Bucket</label>
                <input
                  type="text"
                  value={storageBucket}
                  onChange={e => setStorageBucket(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Messaging Sender ID</label>
                <input
                  type="text"
                  value={messagingSenderId}
                  onChange={e => setMessagingSenderId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">App ID</label>
                <input
                  type="text"
                  value={appId}
                  onChange={e => setAppId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFirebaseForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium"
                >
                  Hubungkan
                </button>
              </div>
            </form>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-xl">
              <p className="text-xs text-blue-700">
                <strong>Cara mendapatkan config:</strong><br/>
                1. Buka <a href="https://console.firebase.google.com" target="_blank" className="underline">Firebase Console</a><br/>
                2. Buat project baru atau pilih yang sudah ada<br/>
                3. Aktifkan Realtime Database<br/>
                4. Buka Project Settings &gt; General &gt; Your apps &gt; Web app<br/>
                5. Copy config ke form di atas
              </p>
            </div>
          </div>
        )}

        {/* Data Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Database size={18} className="text-gray-400" />
            Data Lokal
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Rekening</span>
              <span className="font-medium">{accounts.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tabungan</span>
              <span className="font-medium">{savings.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaksi</span>
              <span className="font-medium">{transactions.length}</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-100">
          <h3 className="font-semibold text-red-600 mb-2">Zona Bahaya</h3>
          <p className="text-xs text-gray-500 mb-3">
            Hapus semua data lokal. Data di Firebase tidak akan terpengaruh.
          </p>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={14} />
            Hapus Semua Data Lokal
          </button>
        </div>

        {/* Clear Confirm */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
              <h3 className="text-lg font-bold text-center">Hapus Semua Data?</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                Semua data lokal (rekening, tabungan, transaksi) akan dihapus permanen.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 font-medium text-gray-700"
                >
                  Batal
                </button>
                <button
                  onClick={handleClearData}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-400">TabunganKu v1.0</p>
          <p className="text-xs text-gray-400">Aplikasi pencatatan tabungan berencana</p>
        </div>
      </div>
    </div>
  );
}
