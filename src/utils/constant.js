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
