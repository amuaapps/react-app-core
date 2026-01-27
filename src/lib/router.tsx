import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { PlaceholderPage } from '@/pages/PlaceholderPage';

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
      element: <PlaceholderPage basePath={basePath} onNavigate={onNavigate} />,
    },
    {
      path: '*',
      element: <PlaceholderPage basePath={basePath} onNavigate={onNavigate} />,
    },
  ];

  return createBrowserRouter(routes, {
    basename: basePath,
  });
}
