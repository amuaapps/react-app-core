import { useEffect, useMemo, useRef } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createCoreRouter } from '@/lib/router';

interface AppProps {
  basePath?: string;
  initialPath?: string;
  onNavigate?: (path: string) => void;
}

export function App({ basePath = '/core', initialPath, onNavigate }: AppProps) {
  const onNavigateRef = useRef(onNavigate);
  const basePathRef = useRef(basePath);

  // Keep refs updated
  useEffect(() => {
    onNavigateRef.current = onNavigate;
    basePathRef.current = basePath;
  }, [onNavigate, basePath]);

  // Wrap onNavigate to ensure absolute paths
  const handleNavigate = useMemo(() => {
    return (path: string) => {
      if (onNavigateRef.current) {
        // Ensure path is absolute with basePath
        const absolutePath = path.startsWith(basePathRef.current)
          ? path
          : `${basePathRef.current}${path.startsWith('/') ? path : `/${path}`}`;
        onNavigateRef.current(absolutePath);
      }
    };
  }, []);

  const router = useMemo(
    () => createCoreRouter(basePath, handleNavigate),
    [basePath, handleNavigate]
  );

  // Handle initial path navigation
  useEffect(() => {
    if (initialPath && router) {
      // Extract the path relative to basePath
      const relativePath = initialPath.startsWith(basePath)
        ? initialPath.slice(basePath.length) || '/'
        : '/';

      // Navigate to the initial path
      router.navigate(relativePath).catch((error: Error) => {
        console.error('Failed to navigate to initial path:', error);
      });
    }
  }, [initialPath, basePath, router]);

  // Listen for external navigation (browser back/forward, shell-initiated)
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;

      // Only handle if path is under our basePath
      if (currentPath.startsWith(basePath)) {
        const relativePath = currentPath.slice(basePath.length) || '/';

        // Navigate router to match the URL
        router.navigate(relativePath).catch((error: Error) => {
          console.error('Failed to sync navigation:', error);
        });
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [basePath, router]);

  return <RouterProvider router={router} />;
}
