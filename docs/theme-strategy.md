# Theme Strategy

## Overview

The core app uses a **token-first** approach to avoid duplicating theme CSS when mounted by the shell.

## Architecture

### Shell Environment (Production)
When loaded as a remote app by the shell:
- **Shell provides**: Global theme tokens (CSS variables) via its own stylesheet
- **Core app does NOT load**: `globals.css` in `bootstrap.tsx`
- **Core app uses**: Token-based Tailwind classes that reference shell's CSS variables

### Standalone Environment (Local Dev)
When running standalone for development/debugging:
- **`standalone.tsx` loads**: `globals.css` to provide theme tokens
- **`index.html` uses**: `standalone.tsx` instead of `bootstrap.tsx`
- **Result**: Same visual appearance as when mounted by shell

## File Structure

```
src/
├── bootstrap.tsx        # Remote entry - NO globals.css import
├── standalone.tsx       # Standalone entry - imports globals.css
├── styles/
│   └── globals.css      # Theme tokens (only loaded in standalone mode)
```

## Token Compliance

All components MUST use token-based styling:

### ✅ Allowed
```tsx
// Token-based Tailwind classes
<div className="bg-background text-foreground" />
<div className="border-border rounded-radius" />
<div className="text-ui-h1 text-primary" />
<div className="p-4 gap-2 space-y-4" />
```

### ❌ Forbidden
```tsx
// Hardcoded colors
<div className="bg-blue-500" />
<div style={{ color: '#3b82f6' }} />

// Arbitrary Tailwind values
<div className="p-[14px]" />
<div className="gap-[3px]" />

// Inline numeric literals
<div style={{ padding: '14px' }} />
```

## Theme Tokens

The following semantic tokens are available (defined in `globals.css`):

### Colors
- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- `--success`, `--success-foreground`
- `--warning`, `--warning-foreground`
- `--info`, `--info-foreground`
- `--border`, `--input`, `--ring`

### Typography
- `text-ui-h1`, `text-ui-h2`, `text-ui-h3`
- `text-ui-body`, `text-ui-body-sm`

### Spacing
Use Tailwind's standard spacing scale:
- `p-{n}`, `m-{n}`, `gap-{n}`, `space-{x|y}-{n}`
- Where `{n}` is from Tailwind's spacing scale (0, 1, 2, 3, 4, 6, 8, etc.)

### Other
- `--radius` - Border radius
- Light/dark mode via `.dark` class on root

## Shell Chrome

The core app **MUST NOT** render:
- Top navigation bar
- Footer
- Global layout wrapper

These are provided by the shell. The core app only renders **body content**.

## UI Library Usage

When using `@amuaapps/ui-library` components:
- Import only what you need (tree-shaking)
- Components already use token-based styling
- No additional theme setup required

Example:
```tsx
import { Button, Card } from '@amuaapps/ui-library';

// Components automatically use theme tokens
<Card>
  <Button variant="primary">Click me</Button>
</Card>
```

## Verification

To verify token compliance, the CI pipeline will fail if:
- Hardcoded color values found (hex, rgb, hsl)
- Arbitrary Tailwind values found (`[...]`)
- Inline numeric/color literals in styles

## Testing

### Local Development
```bash
npm run dev
# Opens standalone app with theme tokens loaded
```

### Shell Integration
```bash
npm run build
# Serve dist/ and load assets/remoteEntry.js in shell
# Shell provides theme tokens, core app uses them
```
