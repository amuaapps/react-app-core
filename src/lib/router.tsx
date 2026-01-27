import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { RouteWrapper } from './RouteWrapper';

// RouteWrapper moved to separate file to satisfy react-refresh/only-export-components

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
