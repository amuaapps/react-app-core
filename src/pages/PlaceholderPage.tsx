import { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PlaceholderPageProps {
  basePath?: string;
  onNavigate?: (path: string) => void;
}

export function PlaceholderPage({
  basePath = '/core',
  onNavigate,
}: PlaceholderPageProps) {
  const location = useLocation();
  const [inputPath, setInputPath] = useState('');

  // Construct full path from basePath and current route
  const currentPath = `${basePath}${location.pathname}`;

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-ui-h1 font-bold text-foreground">
            Core App Placeholder
          </h1>
          <p className="text-ui-body text-muted-foreground">
            This is the remote core application mounted by the shell.
          </p>
        </header>

        <section
          className="rounded-lg border border-border bg-card p-6 space-y-4"
          aria-labelledby="route-info"
        >
          <h2 id="route-info" className="text-ui-h3 font-semibold">
            Current Route
          </h2>
          <p className="font-mono text-ui-body-sm bg-muted p-3 rounded">
            {currentPath}
          </p>
        </section>

        <section
          className="rounded-lg border border-border bg-card p-6 space-y-4"
          aria-labelledby="navigation-section"
        >
          <h2 id="navigation-section" className="text-ui-h3 font-semibold">
            Navigation
          </h2>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleNavigate('/core')}
              className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Navigate to /core
            </button>
            <button
              onClick={() => handleNavigate('/core/about')}
              className="w-full rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Navigate to /core/about
            </button>
            <button
              onClick={() => handleNavigate('/core/settings')}
              className="w-full rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Navigate to /core/settings
            </button>
          </div>

          <div className="pt-4 border-t border-border">
            <label htmlFor="custom-path" className="block text-ui-label mb-2">
              Custom Path
            </label>
            <div className="flex gap-2">
              <input
                id="custom-path"
                type="text"
                value={inputPath}
                onChange={(e) => setInputPath(e.target.value)}
                placeholder="/core/custom"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-ui-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                onClick={() => {
                  if (inputPath) {
                    handleNavigate(inputPath);
                    setInputPath('');
                  }
                }}
                className="rounded-md bg-accent px-4 py-2 text-accent-foreground hover:bg-accent/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Go
              </button>
            </div>
          </div>
        </section>

        <footer className="text-center text-ui-caption text-muted-foreground">
          <p>Remote App Core • Contract Version 1</p>
        </footer>
      </div>
    </main>
  );
}
