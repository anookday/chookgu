// sort order options for mongo queries
export enum SortOrder {
  Asc = 1,
  Desc = -1,
}
// 20 minute cookie session (ms)
export const COOKIE_MAX_AGE = 20 * 60 * 1000
// 4 hour verification expiry time (s)
export const VERIFICATION_MAX_AGE = 4 * 60 * 60
// user starts with 100 million tokens
export const USER_STARTING_BALANCE = 100000000
