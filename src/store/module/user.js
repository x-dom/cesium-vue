const state = {
    language:"zh",
    userinfo:{},
    token_id:"",
    userMangeEdit:{
      roleType:null
    },
    menu:[],
}
const getters = {
    pageSizeArr:state => [10,20,30,40,50],
    pageSize:state => 10,
    userinfo:state => state.userinfo,
    token_id:state => state.token_id,
}
const mutations = {
  /**
   * 获取登陆后的菜单信息
   */
  menuSet(state, value) {
    state.menu = value
    sessionStorage["menu"] = JSON.stringify(value);
  },
  /**
   * 用户管理新增用户选择用户类型之后，取消新增提示用户是否取消，保存数据
   */
  roleTypeSet(state, value) {
    state.userMangeEdit.roleType = value
  },
  /**
   * 获取登陆后的用户信息
   */
  userinfoSet(state, value) {
    state.userinfo = value;
    state.token_id = value.tokenId;
    sessionStorage["token_id"] = value.tokenId;
    sessionStorage["userinfo"] = JSON.stringify(value);
  },
}
const actions = {

}
const moduleUser = {
  namespaced: true,
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
}
export default moduleUser