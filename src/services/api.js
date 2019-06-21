export default {
  // queryRouteList: '/routes',
  // queryUserInfo: '/user',
  // logoutUser: '/user/logout',
  // loginUser: 'POST /user/login',
  // queryUser: '/user/:id',
  // queryUserList: '/users',
  // updateUser: 'Patch /user/:id',
  // createUser: 'POST /user',
  // removeUser: 'DELETE /user/:id',
  // removeUserList: 'POST /users/delete',
  // queryPostList: '/posts',
  // queryDashboard: '/dashboard',

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
  topupProject: 'POST /admin/project/:db/topup',

  queryProject: '/admin/project',
  queryProjectBalance: '/admin/project/:db/balance',
  queryProjectConfig: '/admin/project/:db/config',
  queryProjectUserList: '/admin/project/:db/user',
  queryProjectUser: '/admin/project/:db/user/:id',
  queryProjectTables: '/admin/project/:db/table',
  queryProjectTableDetail: '/admin/project/:db/table/:table',
  queryProjectOAuthCallback: '/admin/project/:db/oauth/:provider/callback',
  queryBatchProjectUser: '/admin/project/:db/user/:id/batch',

  updateProjectOAuthConfig: 'PUT /admin/project/:db/oauth/:provider',
  createPreRregisterProjectUser: 'POST /admin/project/:db/user',
  updateProjectUser: 'PUT /admin/project/:db/user/:id',
  updateProjectMiscConfig: 'PUT /admin/project/:db/config/misc',
  createProjectTable: 'POST /admin/project/:db/table',
  addFieldToProjectTable: 'PATCH /admin/project/:db/table/:table',
  dropProjectTable: 'DELETE /admin/project/:db/table/:table',

  updateProjectGroupConfig: 'PUT /admin//project/:db/config/group',
  updateProjectTableRules: 'PUT /admin/project/:db/table/:table/rules',

  // tmp
  queryProjectAudits: '/admin/project/:db/audits',
  queryProjectPricing: '/admin/project/:db/pricing',
}
