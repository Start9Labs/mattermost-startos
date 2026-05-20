export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Mattermost!': 0,
  Database: 1,
  'Waiting for PostgreSQL to be ready': 2,
  'PostgreSQL is ready': 3,
  'Web Interface': 4,
  'Mattermost is ready': 5,
  'Mattermost is not ready': 6,

  // interfaces.ts
  'Web UI': 7,
  'The Mattermost web interface': 8,

  // main.ts
  'store.json not found': 9,

  // actions/setPrimaryUrl.ts, init/taskSetPrimaryUrl.ts
  URL: 10,
  'Set Primary URL': 11,
  'Choose which of your Mattermost URLs should serve as the Site URL. Mattermost uses this when generating links in emails, OAuth callbacks, push notification payloads, and mobile deep links.': 12,
  'Primary URL removed. Select a new primary URL.': 13,

  // actions/manageSmtp.ts
  'Configure SMTP': 14,
  'Configure outbound email so Mattermost can send password resets, account invitations, and mention notifications.': 15,

  // actions/manageSignup.ts
  'Allow Account Creation': 16,
  'Master switch for all new accounts. When off, nobody new can join — not even by invitation. Leave on unless you want to freeze the member list entirely.': 17,
  'Public Signups': 18,
  'When enabled, anyone who can reach your Mattermost URL can self-register. When disabled (recommended), the server is invite-only — new members join via an invite link or email invitation. The first account always becomes System Admin regardless.': 19,
  'Configure Signups': 20,
  'Control whether new accounts can be created at all, and whether sign-up is public or invite-only.': 21,

  // actions/resetUserPassword.ts
  'Username or Email': 22,
  'The username or email address of the account whose password you want to reset.': 23,
  'Reset User Password': 24,
  'Generate a new password for a Mattermost user. Useful when an admin gets locked out or forgets their password.': 25,
  Recovery: 26,
  'Password Reset': 27,
  'The user password has been reset. Use the new password below to log in.': 28,
  Username: 29,
  'New Password': 30,

  // actions/promoteToAdmin.ts
  'The username or email address of the user to grant System Admin privileges.': 31,
  'Promote to System Admin': 32,
  'Grant System Admin privileges to an existing user. Useful when the original admin leaves or is locked out and you need to elevate a regular account.': 33,
  Promoted: 34,
  '${user} is now a System Admin.': 35,

  // actions/demoteFromAdmin.ts
  'The username or email address of the System Admin to demote to a regular user.': 36,
  'Demote from System Admin': 37,
  'Revoke System Admin privileges from a user, returning them to regular member status.': 38,
  Demoted: 39,
  '${user} is no longer a System Admin.': 40,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
