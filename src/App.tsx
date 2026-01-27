import { useState, useEffect } from 'react';
import { PlaceholderPage } from '@/pages/PlaceholderPage';

interface AppProps {
  basePath?: string;
  initialPath?: string;
  onNavigate?: (path: string) => void;
}

export function App({ basePath = '/core', initialPath, onNavigate }: AppProps) {
  const [currentPath, setCurrentPath] = useState(initialPath || basePath);

  useEffect(() => {
    if (initialPath) {
      setCurrentPath(initialPath);
    }
  }, [initialPath]);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <PlaceholderPage currentPath={currentPath} onNavigate={handleNavigate} />
  );
}
