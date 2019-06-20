export const ROLE_TYPE = {
  ADMIN: 'admin',
  DEFAULT: 'admin',
  DEVELOPER: 'developer',
}

export const USER_PERMISSION = {
  DEFAULT: {
    visit: ['1', '2', '21', '7', '5', '51', '52', '53'],
    role: ROLE_TYPE.DEFAULT,
  },
  ADMIN: {
    role: ROLE_TYPE.ADMIN,
  },
  DEVELOPER: {
    role: ROLE_TYPE.DEVELOPER,
  },
}

export const CANCEL_REQUEST_MESSAGE = 'cancel request'

// Table column data type (sqlite)
export const DATA_TYPES = ['INTEGER', 'TEXT', 'REAL', 'BLOB']

// Enabled oauth
export const DEFAULT_OAUTH = [
  {
    provider: 'github',
    config: {
      enabled: false,
      client_id: '',
      client_secret: '',
    },
  },
  {
    provider: 'twitter',
    config: {
      enabled: false,
      client_id: '',
      client_secret: '',
    },
  },
  {
    provider: 'google',
    config: {
      enabled: false,
      client_id: '',
      client_secret: '',
    },
  },
]
