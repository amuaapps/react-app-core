/**
 * Standalone Entry Point
 *
 * This file is used ONLY for standalone SPA development (index.html).
 * It imports the global theme CSS which the shell would normally provide.
 *
 * The remote entry (bootstrap.tsx) does NOT import globals.css to avoid
 * duplicating theme tokens when mounted by the shell.
 */

import './styles/globals.css';
import remoteApp from './bootstrap';

export default remoteApp;
