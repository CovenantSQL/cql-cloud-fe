export default {
  // queryRouteList: '/routes',
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

  // ----- CQL APIs -----
  // Ref: https://github.com/CovenantSQL/CovenantSQL/blob/feature/adapter/cmd/cql-proxy/api/init.go
  queryGithubOAuth: '/admin/auth/authorize',
  queryToken: '/admin/auth/callback',
  queryAccount: '/admin/account',
  getPTC: 'POST /admin/account/apply',
  queryCQLUserInfo: '/admin/userinfo',

  // keypair
  createWallet: 'POST /admin/keypair',
  deleteWallet: 'DELETE /admin/keypair',
  uploadWallet: 'POST /admin/keypair/upload',
  setMainWallet: 'POST /admin/keypair/main',
  downloadWallet: '/admin/keypair/:account',

  // task
  queryTasks: '/admin/task', // {offset, limit, all=true}
  queryTask: '/admin/task/:id',
  killTask: 'DELETE /admin/task/:id',

  // project
  createProject: 'POST /admin/project',
  queryProject: '/admin/project',
  queryProjectPricing: '/admin/project/:db/pricing',
  queryProjectBalance: '/admin/project/:db/balance',
  topupProject: 'POST /admin/project/:db/topup',
  queryProjectUserList: '/admin/project/:db/user',
  createPreRregisterProjectUser: 'POST /admin/project/:db/user',
  queryProjectUser: '/admin/project/:db/user/:id',
  updateProjectUser: 'PUT /admin/project/:db/user',
  queryProjectConfig: '/admin/project/:db/config',
  updateProjectMiscConfig: 'PUT /admin/project/:db/config/misc',
  queryProjectOAuthCallback: '/admin/project/:db/oauth/:provider/callback',
  updateProjectOAuthConifg: 'PUT /admin/project/:db/oauth/:provider',
  queryProjectTables: '/admin/project/:db/table',
  createProjectTable: 'POST /admin/project/:db/table',
  addFieldToProjectTable: 'PATCH /admin/project/:db/table/:table',
  queryProjectTableDetail: '/admin/project/:db/table/:table',
  dropProjectTable: 'DELETE /admin/project/:db/table/:table',

  // tmp
  queryProjectAudits: '/admin/project/:db/audits',
}
