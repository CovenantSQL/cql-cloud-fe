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

// Table column data type
// NUMBER => INTEGER & REAL in sqlite
// TEXT   => TEXT in sqlite
// BINARY => BLOB in sqlite
export const DATA_TYPES = ['NUMBER', 'TEXT', 'BINARY']

// Project user states
export const USER_STATES = ['Enabled', 'Disabled']
// export const USER_STATES = ['PreRegistered', 'SignedUp', 'Enabled', 'Disabled']

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

export const CLIENT_API = {
  userinfo: '/userinfo',
  find: '/data/:table/find',
  count: '/data/:table/count',
  insert: 'POST /data/:table/insert',
  update: 'POST /data/:table/update',
  remove: 'POST /data/:table/remove',
}
