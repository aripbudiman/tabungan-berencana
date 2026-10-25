import { HashRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './store/useStore';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Savings from './pages/Savings';
import SavingsDetail from './pages/SavingsDetail';
import AddSavings from './pages/AddSavings';
import Settings from './pages/Settings';

function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <div className="max-w-lg mx-auto bg-gray-50 min-h-screen relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/savings/add/:accountId?" element={<AddSavings />} />
            <Route path="/savings/:id" element={<SavingsDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <BottomNav />
        </div>
      </HashRouter>
    </StoreProvider>
  );
}

export default App;
