import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Theme } from './theme.model';
import { Shop } from '../Shop/shop.model';

type ThemeVars = Record<string, string>;

const toThemeVars = (input: unknown): ThemeVars => {
  if (!input) return {};
  if (input instanceof Map) return Object.fromEntries(input.entries());
  if (typeof input === 'object') return input as ThemeVars;
  return {};
};

const DEFAULT_LIGHT_EXTRA_VARS = {
  '--color-text-primary': '#0f172a',
  '--color-text-secondary': '#334155',
  '--color-text-muted': '#64748b',
  '--color-bg-base': '#f8fafc',
  '--color-bg-card': '#ffffff',
  '--color-border': '#e2e8f0',
};

const DEFAULT_DARK_EXTRA_VARS = {
  '--dark-color-text-primary': '#e2e8f0',
  '--dark-color-text-secondary': '#cbd5e1',
  '--dark-color-text-muted': '#94a3b8',
  '--dark-color-bg-base': '#0a1929',
  '--dark-color-bg-card': 'rgba(15, 23, 42, 0.65)',
  '--dark-color-border': 'rgba(148, 163, 184, 0.18)',
};

const defaultThemes = [
  {
    key: 'teal',
    label: 'Teal',
    vars: {
      '--color-primary': '#14b8a6',
      '--color-primary-dark': '#0f766e',
      '--color-accent': '#38bdf8',
      '--color-secondary': '#22d3ee',
      '--color-sidebar': '#081426',
      '--color-sidebar-hover': 'rgba(20, 184, 166, 0.12)',
      '--color-border-focus': '#14b8a6',
      ...DEFAULT_LIGHT_EXTRA_VARS,
      ...DEFAULT_DARK_EXTRA_VARS,
    },
  },
  {
    key: 'ocean',
    label: 'Ocean',
    vars: {
      '--color-primary': '#0ea5e9',
      '--color-primary-dark': '#0369a1',
      '--color-accent': '#2563eb',
      '--color-secondary': '#38bdf8',
      '--color-sidebar': '#081827',
      '--color-sidebar-hover': 'rgba(14, 165, 233, 0.12)',
      '--color-border-focus': '#0ea5e9',
      ...DEFAULT_LIGHT_EXTRA_VARS,
      ...DEFAULT_DARK_EXTRA_VARS,
    },
  },
  {
    key: 'emerald',
    label: 'Emerald',
    vars: {
      '--color-primary': '#22c55e',
      '--color-primary-dark': '#15803d',
      '--color-accent': '#14b8a6',
      '--color-secondary': '#4ade80',
      '--color-sidebar': '#071b14',
      '--color-sidebar-hover': 'rgba(34, 197, 94, 0.12)',
      '--color-border-focus': '#22c55e',
      ...DEFAULT_LIGHT_EXTRA_VARS,
      ...DEFAULT_DARK_EXTRA_VARS,
    },
  },
  {
    key: 'rose',
    label: 'Rose',
    vars: {
      '--color-primary': '#f43f5e',
      '--color-primary-dark': '#be123c',
      '--color-accent': '#fb7185',
      '--color-secondary': '#fda4af',
      '--color-sidebar': '#230b12',
      '--color-sidebar-hover': 'rgba(244, 63, 94, 0.12)',
      '--color-border-focus': '#f43f5e',
      ...DEFAULT_LIGHT_EXTRA_VARS,
      ...DEFAULT_DARK_EXTRA_VARS,
    },
  },
  {
    key: 'amber',
    label: 'Amber',
    vars: {
      '--color-primary': '#f59e0b',
      '--color-primary-dark': '#b45309',
      '--color-accent': '#f97316',
      '--color-secondary': '#fbbf24',
      '--color-sidebar': '#221307',
      '--color-sidebar-hover': 'rgba(245, 158, 11, 0.12)',
      '--color-border-focus': '#f59e0b',
      ...DEFAULT_LIGHT_EXTRA_VARS,
      ...DEFAULT_DARK_EXTRA_VARS,
    },
  },
  {
    key: 'violet',
    label: 'Violet',
    vars: {
      '--color-primary': '#8b5cf6',
      '--color-primary-dark': '#6d28d9',
      '--color-accent': '#a78bfa',
      '--color-secondary': '#c4b5fd',
      '--color-sidebar': '#170d2b',
      '--color-sidebar-hover': 'rgba(139, 92, 246, 0.12)',
      '--color-border-focus': '#8b5cf6',
      ...DEFAULT_LIGHT_EXTRA_VARS,
      ...DEFAULT_DARK_EXTRA_VARS,
    },
  },
];

const toKey = (label: string) =>
  label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const shadeHex = (hex: string, amount: number) => {
  const raw = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(raw)) return hex;
  const num = parseInt(raw, 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const buildDarkVars = (lightVars: Record<string, string>) => ({
  '--dark-color-primary': lightVars['--color-primary'],
  '--dark-color-primary-dark': shadeHex(lightVars['--color-primary'], -35),
  '--dark-color-accent': lightVars['--color-accent'],
  '--dark-color-secondary': lightVars['--color-secondary'],
  '--dark-color-sidebar': '#081426',
  '--dark-color-sidebar-hover': `${lightVars['--color-primary']}22`,
  '--dark-color-border-focus': lightVars['--color-primary'],
  '--dark-color-text-primary': '#e2e8f0',
  '--dark-color-text-secondary': '#cbd5e1',
  '--dark-color-text-muted': '#94a3b8',
  '--dark-color-bg-base': '#0a1929',
  '--dark-color-bg-card': 'rgba(15, 23, 42, 0.65)',
  '--dark-color-border': 'rgba(148, 163, 184, 0.18)',
});

const normalizeThemeVars = (vars: ThemeVars = {}) => {
  const lightVars = {
    '--color-primary': vars['--color-primary'] || '#14b8a6',
    '--color-primary-dark': vars['--color-primary-dark'] || shadeHex(vars['--color-primary'] || '#14b8a6', -35),
    '--color-accent': vars['--color-accent'] || shadeHex(vars['--color-primary'] || '#14b8a6', 45),
    '--color-secondary': vars['--color-secondary'] || shadeHex(vars['--color-primary'] || '#14b8a6', 30),
    '--color-sidebar': vars['--color-bg-card'] || DEFAULT_LIGHT_EXTRA_VARS['--color-bg-card'],
    '--color-sidebar-hover': vars['--color-sidebar-hover'] || `${(vars['--color-primary'] || '#14b8a6')}14`,
    '--color-border-focus': vars['--color-border-focus'] || (vars['--color-primary'] || '#14b8a6'),
    '--color-text-primary': vars['--color-text-primary'] || DEFAULT_LIGHT_EXTRA_VARS['--color-text-primary'],
    '--color-text-secondary': vars['--color-text-secondary'] || DEFAULT_LIGHT_EXTRA_VARS['--color-text-secondary'],
    '--color-text-muted': vars['--color-text-muted'] || DEFAULT_LIGHT_EXTRA_VARS['--color-text-muted'],
    '--color-bg-base': vars['--color-bg-base'] || DEFAULT_LIGHT_EXTRA_VARS['--color-bg-base'],
    '--color-bg-card': vars['--color-bg-card'] || DEFAULT_LIGHT_EXTRA_VARS['--color-bg-card'],
    '--color-border': vars['--color-border'] || DEFAULT_LIGHT_EXTRA_VARS['--color-border'],
  };

  return {
    ...vars,
    ...lightVars,
    ...buildDarkVars(lightVars),
    ...DEFAULT_DARK_EXTRA_VARS,
  };
};

const buildVars = (payload: {
  primary: string;
  secondary?: string;
  accent?: string;
  textPrimary?: string;
  textSecondary?: string;
  textMuted?: string;
  bgBase?: string;
  bgCard?: string;
}) => {
  const primary = payload.primary;
  const secondary = payload.secondary || shadeHex(primary, 30);
  const accent = payload.accent || shadeHex(primary, 45);

  const lightVars = {
    '--color-primary': primary,
    '--color-primary-dark': shadeHex(primary, -35),
    '--color-accent': accent,
    '--color-secondary': secondary,
    '--color-sidebar': payload.bgCard || DEFAULT_LIGHT_EXTRA_VARS['--color-bg-card'],
    '--color-sidebar-hover': `${primary}14`,
    '--color-border-focus': primary,
    '--color-text-primary': payload.textPrimary || DEFAULT_LIGHT_EXTRA_VARS['--color-text-primary'],
    '--color-text-secondary': payload.textSecondary || DEFAULT_LIGHT_EXTRA_VARS['--color-text-secondary'],
    '--color-text-muted': payload.textMuted || DEFAULT_LIGHT_EXTRA_VARS['--color-text-muted'],
    '--color-bg-base': payload.bgBase || DEFAULT_LIGHT_EXTRA_VARS['--color-bg-base'],
    '--color-bg-card': payload.bgCard || DEFAULT_LIGHT_EXTRA_VARS['--color-bg-card'],
    '--color-border': DEFAULT_LIGHT_EXTRA_VARS['--color-border'],
  };

  return {
    ...lightVars,
    ...buildDarkVars(lightVars),
  };
};

const ensureSystemThemes = async () => {
  await Promise.all(
    defaultThemes.map((theme) =>
      Theme.updateOne(
        { key: theme.key },
        {
          $setOnInsert: {
            key: theme.key,
            label: theme.label,
            vars: theme.vars,
            system: true,
          },
        },
        { upsert: true },
      ),
    ),
  );
};

const listThemes = async () => {
  await ensureSystemThemes();
  const themes = await Theme.find().sort({ system: -1, createdAt: -1 }).lean();
  return themes.map((t) => ({
    id: String(t._id),
    key: t.key,
    label: t.label,
    vars: normalizeThemeVars(toThemeVars(t.vars)),
    system: !!t.system,
  }));
};

const createTheme = async (
  userId: string,
  payload: {
    label: string;
    primary: string;
    secondary?: string;
    accent?: string;
    textPrimary?: string;
    textSecondary?: string;
    textMuted?: string;
    bgBase?: string;
    bgCard?: string;
  },
) => {
  const baseKey = toKey(payload.label || 'custom-theme') || 'custom-theme';
  let key = baseKey;
  let n = 1;

  while (await Theme.findOne({ key })) {
    n += 1;
    key = `${baseKey}-${n}`;
  }

  const created = await Theme.create({
    key,
    label: payload.label,
    vars: buildVars(payload),
    system: false,
    createdBy: userId,
  });

  return {
    id: String(created._id),
    key: created.key,
    label: created.label,
    vars: normalizeThemeVars(toThemeVars(created.vars)),
    system: created.system,
  };
};

const updateTheme = async (
  id: string,
  payload: {
    label?: string;
    primary?: string;
    secondary?: string;
    accent?: string;
    textPrimary?: string;
    textSecondary?: string;
    textMuted?: string;
    bgBase?: string;
    bgCard?: string;
  },
) => {
  const theme = await Theme.findById(id);
  if (!theme) throw new AppError(httpStatus.NOT_FOUND, 'Theme not found', []);

  if (payload.label?.trim()) {
    theme.label = payload.label.trim();
  }

  if (
    payload.primary ||
    payload.secondary ||
    payload.accent ||
    payload.textPrimary ||
    payload.textSecondary ||
    payload.textMuted ||
    payload.bgBase ||
    payload.bgCard
  ) {
    const currentVars = normalizeThemeVars(toThemeVars(theme.vars));
    theme.vars = new Map(Object.entries(buildVars({
      primary: payload.primary || currentVars['--color-primary'] || '#14b8a6',
      secondary: payload.secondary || currentVars['--color-secondary'],
      accent: payload.accent || currentVars['--color-accent'],
      textPrimary: payload.textPrimary || currentVars['--color-text-primary'],
      textSecondary: payload.textSecondary || currentVars['--color-text-secondary'],
      textMuted: payload.textMuted || currentVars['--color-text-muted'],
      bgBase: payload.bgBase || currentVars['--color-bg-base'],
      bgCard: payload.bgCard || currentVars['--color-bg-card'],
    })));
  }

  await theme.save();

  return {
    id: String(theme._id),
    key: theme.key,
    label: theme.label,
    vars: normalizeThemeVars(toThemeVars(theme.vars)),
    system: theme.system,
  };
};

const deleteTheme = async (id: string) => {
  const theme = await Theme.findById(id);
  if (!theme) throw new AppError(httpStatus.NOT_FOUND, 'Theme not found', []);
  if (theme.system) throw new AppError(httpStatus.BAD_REQUEST, 'System theme cannot be deleted', []);

  await Theme.deleteOne({ _id: id });
  await Shop.updateMany({ selectedThemeId: id }, { $set: { selectedThemeId: '' } });
  return null;
};

const setMyShopTheme = async (userId: string, themeId: string) => {
  await ensureSystemThemes();
  const theme = await Theme.findById(themeId);
  if (!theme) throw new AppError(httpStatus.NOT_FOUND, 'Theme not found', []);

  const shop = await Shop.findOneAndUpdate(
    { ownerId: userId },
    { selectedThemeId: themeId },
    { new: true },
  );

  if (!shop) throw new AppError(httpStatus.NOT_FOUND, 'Shop not found', []);

  return {
    selectedThemeId: shop.selectedThemeId,
    theme: {
      id: String(theme._id),
      key: theme.key,
      label: theme.label,
      vars: normalizeThemeVars(toThemeVars(theme.vars)),
      system: theme.system,
    },
  };
};

export const ThemeServices = {
  listThemes,
  createTheme,
  updateTheme,
  deleteTheme,
  setMyShopTheme,
};
