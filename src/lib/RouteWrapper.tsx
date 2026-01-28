import { useNavigate } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';

/**
 * Wrapper component that provides navigation handler to pages
 */
export function RouteWrapper({
  basePath,
  onNavigate,
}: {
  basePath: string;
  onNavigate?: (path: string) => void;
}) {
  const navigate = useNavigate();

  // Create navigation handler that uses router navigation
  const handleNavigate = (path: string) => {
    // Extract relative path from absolute path
    const relativePath = path.startsWith(basePath)
      ? path.slice(basePath.length) || '/'
      : path;

    // Navigate using router
    navigate(relativePath);

    // Notify shell
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return <HomePage basePath={basePath} onNavigate={handleNavigate} />;
}
