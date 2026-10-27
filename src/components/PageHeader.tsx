import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  onAdd?: () => void;
  rightAction?: ReactNode;
}

export default function PageHeader({ title, showBack, onAdd, rightAction }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-lg mx-auto flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="p-2 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
          >
            <Plus size={20} />
          </button>
        )}
        {rightAction}
      </div>
    </header>
  );
}
