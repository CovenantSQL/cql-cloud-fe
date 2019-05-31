export default {
  queryRouteList: '/routes',

  queryUserInfo: '/user',
  logoutUser: '/user/logout',
  loginUser: 'POST /user/login',

  queryUser: '/user/:id',
  queryUserList: '/users',
  updateUser: 'Patch /user/:id',
  createUser: 'POST /user',
  removeUser: 'DELETE /user/:id',
  removeUserList: 'POST /users/delete',

  queryPostList: '/posts',

  queryDashboard: '/dashboard',

  // CQL APIs
  queryGithubOAuth: '/admin/auth/authorize',
  queryToken: '/admin/auth/callback',
  queryAccount: '/admin/account',
  queryCQLUserInfo: '/admin/userinfo',
  createWallet: 'POST /admin/keypair',
  uploadWallet: 'POST /admin/keypair/upload',
  setMainWallet: 'PUT /admin/keypair/main',
}
