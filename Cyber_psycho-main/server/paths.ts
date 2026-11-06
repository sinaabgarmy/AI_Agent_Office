// =====================================================================
// Windows-safe path utilities for the Obsidian vault connector.
// ---------------------------------------------------------------------
// ChronoZero runs on a Windows 11 laptop, so every path that enters the
// vault layer must survive: drive letters (D:\...), UNC shares (\\NAS\...),
// %USERNAME%-style environment expansion, Windows-reserved device names,
// and characters that NTFS forbids in filenames.
//
// The helpers below use path.win32 semantics whenever the configured vault
// root is a Windows-style path — even if the process runs on another OS —
// so behaviour is identical on the laptop and in CI.
// =====================================================================

import path from 'path';

const WINDOWS_DRIVE_RE = /^[A-Za-z]:[\\/]/;
const WINDOWS_UNC_RE = /^\\\\[^\\]/;
const WINDOWS_RESERVED = new Set([
  'CON', 'PRN', 'AUX', 'NUL',
  'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
  'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
]);

/** Expands %VAR% and ${VAR} using process.env (leaves unknown vars intact). */
export function expandEnvVars(raw: string): string {
  if (!raw) return raw;
  let out = raw.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (m, name) =>
    process.env[name] ? process.env[name] as string : m
  );
  out = out.replace(/%([A-Za-z_][A-Za-z0-9_]*)%/g, (m, name) =>
    process.env[name] ? process.env[name] as string : m
  );
  return out;
}

export function isWindowsStylePath(p: string): boolean {
  return WINDOWS_DRIVE_RE.test(p) || WINDOWS_UNC_RE.test(p);
}

function pathImplFor(p: string): typeof path.win32 | typeof path.posix {
  return isWindowsStylePath(p) ? path.win32 : path.posix;
}

/**
 * Cleans a user-provided vault path:
 *  - strips surrounding quotes and whitespace
 *  - expands environment variables
 *  - normalizes slashes for the detected platform style
 */
export function normalizeVaultPath(raw: string): string {
  let p = (raw ?? '').toString().trim();
  if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
    p = p.slice(1, -1).trim();
  }
  p = expandEnvVars(p);
  if (!p) return '';
  const impl = pathImplFor(p);
  if (impl === path.win32) {
    p = p.replace(/\/+/g, '\\');
    p = p.replace(/\\{3,}/g, '\\\\'); // UNC prefix uses double backslash
    p = p.replace(/\\+$/, '');
  } else {
    p = p.replace(/\\+/g, '/');
    p = p.replace(/\/{2,}/g, '/');
    p = p.replace(/\/+$/, '');
  }
  return p;
}

export interface VaultPathValidation {
  ok: boolean;
  path: string;
  error?: string;
}

/** Full validation for a vault path BEFORE anything is created on disk. */
export function validateVaultPath(raw: string, projectRoot: string): VaultPathValidation {
  const p = normalizeVaultPath(raw);
  if (!p) return { ok: false, path: p, error: 'Enter a folder path, e.g. D:\\AI-Research\\ChronoZero-Vault' };

  const impl = pathImplFor(p);
  const abs = impl.resolve(p);
  if (!impl.isAbsolute(abs)) {
    return { ok: false, path: abs, error: 'The vault path must be absolute (e.g. D:\\AI-Research\\ChronoZero-Vault).' };
  }

  // Reject bare drive roots (C:\ , D:\) — a vault needs its own folder.
  if (isWindowsStylePath(abs)) {
    const parsed = path.win32.parse(abs);
    if (!parsed.name) {
      return { ok: false, path: abs, error: 'Do not use a whole drive as the vault. Pick a folder inside it, e.g. D:\\AI-Research\\ChronoZero-Vault.' };
    }
  }

  // Never allow the vault to swallow the application itself.
  if (projectRoot) {
    const rootAbs = path.resolve(projectRoot);
    let rel = '';
    try {
      rel = isWindowsStylePath(abs) && path.sep === '/'
        ? path.win32.relative(path.win32.resolve(rootAbs), abs)
        : path.relative(rootAbs, abs);
    } catch {
      rel = '';
    }
    if (rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel)) {
      return {
        ok: false,
        path: abs,
        error: 'The vault cannot live inside the ChronoZero application folder (Obsidian would index node_modules). Choose a location outside it, e.g. D:\\AI-Research\\ChronoZero-Vault.'
      };
    }
  }

  const leaf = abs.split(/[\\/]/).filter(Boolean).pop() || '';
  if (WINDOWS_RESERVED.has(leaf.toUpperCase())) {
    return { ok: false, path: abs, error: `"${leaf}" is a reserved Windows device name and cannot be used.` };
  }
  return { ok: true, path: abs };
}

/** Joins `relPath` under `vaultRoot`, refusing any escape above the vault root. */
export function resolveWithin(vaultRoot: string, ...relParts: string[]): string {
  const impl = pathImplFor(vaultRoot);
  const rel = relParts.filter(Boolean).join(impl.sep);
  const abs = impl.resolve(vaultRoot, rel);
  const rootWithSep = vaultRoot.endsWith(impl.sep) ? vaultRoot : vaultRoot + impl.sep;
  if (abs !== vaultRoot && !abs.startsWith(rootWithSep)) {
    throw new Error(`Vault path traversal blocked: ${rel}`);
  }
  return abs;
}

/** Sanitizes a note title into a legal Windows/Posix filename. */
export function sanitizeFilename(raw: string, maxLen = 80): string {
  let name = (raw ?? '').toString();
  name = name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, ' ');
  name = name.replace(/\s+/g, ' ').trim();
  name = name.replace(/[. ]+$/, ''); // Windows: no trailing dots/spaces
  if (WINDOWS_RESERVED.has(name.toUpperCase())) name = `${name} Note`;
  if (name.length > maxLen) name = name.slice(0, maxLen).replace(/[. ]+$/, '');
  return name || 'Untitled';
}

/** URL/sluggified identifier used inside note filenames (keeps readability). */
export function slugify(raw: string, maxLen = 60): string {
  const slug = (raw ?? '')
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLen)
    .replace(/-+$/, '');
  return slug || 'untitled';
}

/** Strips a leading @ from agent handles so they become legal filenames. */
export function handleToFileBase(handle: string, fallbackName: string): string {
  return sanitizeFilename((handle || fallbackName || 'Agent').replace(/^@+/, ''), 60);
}

export function localDateStamp(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function localMonthStamp(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function isoTimestamp(d = new Date()): string {
  return d.toISOString();
}
