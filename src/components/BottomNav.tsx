import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Wallet, PiggyBank, Settings } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Beranda' },
  { path: '/accounts', icon: Wallet, label: 'Rekening' },
  { path: '/savings', icon: PiggyBank, label: 'Tabungan' },
  { path: '/settings', icon: Settings, label: 'Pengaturan' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive ? 'text-emerald-600' : 'text-gray-400'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] mt-1 font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
