import { useEffect, useMemo } from 'react';
import { RouterProvider, useNavigate } from 'react-router-dom';
import { createCoreRouter } from '@/lib/router';

interface AppProps {
  basePath?: string;
  initialPath?: string;
  onNavigate?: (path: string) => void;
}

export function App({ basePath = '/core', initialPath, onNavigate }: AppProps) {
  const router = useMemo(
    () => createCoreRouter(basePath, onNavigate),
    [basePath, onNavigate]
  );

  useEffect(() => {
    if (initialPath && router) {
      // Extract the path relative to basePath
      const relativePath = initialPath.startsWith(basePath)
        ? initialPath.slice(basePath.length) || '/'
        : '/';

      // Navigate to the initial path
      router.navigate(relativePath).catch((error) => {
        console.error('Failed to navigate to initial path:', error);
      });
    }
  }, [initialPath, basePath, router]);

  return <RouterProvider router={router} />;
}
