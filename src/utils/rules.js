export const PUBLIC_VIEW_PUBLIC_MODIFY_RULE = {
  find: {},
  count: {},
  insert: {},
  update: {
    filter: {},
    update: {},
  },
  remove: {},
}

export const PUBLIC_VIEW_USER_MODIFY_RULE = {
  find: {}, // public view
  count: {}, // public view
  insert: {
    's:logged_in': {},
    default: null, // disable other enforce_statement
  },
  update: {
    filter: {
      's:logged_in': {
        uid: '$user_id',
      },
      default: null, // disable other enforce_statement
    },
    update: {
      's:logged_in': {
        uid: '$user_id',
      },
      default: null, // disable other enforce_statement
    },
  },
  remove: {
    's:logged_in': {
      uid: '$user_id',
    },
    default: null, // disable other enforce_statement
  },
}

export const LOGIN_VIEW_USER_MODIFY_RULE = Object.assign(
  {},
  PUBLIC_VIEW_USER_MODIFY_RULE,
  {
    find: {
      's:logged_in': {},
      default: null, // disable other enforce_statement
    },
    count: {
      's:logged_in': {},
      default: null, // disable other enforce_statement
    },
  }
)

export const USER_VIEW_USER_MODIFY_RULE = Object.assign(
  {},
  PUBLIC_VIEW_USER_MODIFY_RULE,
  {
    find: {
      's:logged_in': {
        uid: '$user_id',
      },
      default: null, // disable other enforce_statement
    },
    count: {
      's:logged_in': {
        uid: '$user_id',
      },
      default: null, // disable other enforce_statement
    },
  }
)
