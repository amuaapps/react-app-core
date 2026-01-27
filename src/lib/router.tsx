import { createBrowserRouter, RouteObject, useNavigate } from 'react-router-dom';
import { PlaceholderPage } from '@/pages/PlaceholderPage';

/**
 * Wrapper component that provides navigation handler to pages
 */
function RouteWrapper({
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

  return <PlaceholderPage basePath={basePath} onNavigate={handleNavigate} />;
}

/**
 * Create router for the core app
 * @param basePath - Base path for all routes (e.g., '/core')
 * @param onNavigate - Callback to notify shell of navigation
 */
export function createCoreRouter(
  basePath: string = '/core',
  onNavigate?: (path: string) => void
) {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <RouteWrapper basePath={basePath} onNavigate={onNavigate} />,
    },
    {
      path: '*',
      element: <RouteWrapper basePath={basePath} onNavigate={onNavigate} />,
    },
  ];

  return createBrowserRouter(routes, {
    basename: basePath,
  });
}
