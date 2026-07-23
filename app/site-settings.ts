export type SiteSettings = {
  legendEnabled: boolean;
  perfectEnabled: boolean;
  unlimitedTeamSpins: boolean;
  showComingSoon: boolean;
};

export const SETTINGS_KEY = "full-court-lab-admin-settings-v1";
export const DEFAULT_SETTINGS: SiteSettings = {
  legendEnabled: true,
  perfectEnabled: true,
  unlimitedTeamSpins: true,
  showComingSoon: true,
};
