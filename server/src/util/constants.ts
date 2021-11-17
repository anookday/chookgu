// sort order options for mongo queries
export enum SortOrder {
  Asc = 1,
  Desc = -1,
}
// 5 minute cookie session (ms)
export const COOKIE_MAX_AGE = 5 * 60 * 1000
// 4 hour token expiry time (s)
export const TOKEN_MAX_AGE = 4 * 60 * 60
// 4 hour token expiry time (ms)
export const TOKEN_MAX_AGE_MS = TOKEN_MAX_AGE * 1000
// user starts with 100 million tokens
export const USER_STARTING_BALANCE = 100000000
