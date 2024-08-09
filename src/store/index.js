import { reactive } from "vue";

const store = {
  debug: true,
  state: reactive({
    // userInfo: {
    //   name: "",
    //   code: "",
    //   role: "",
    // },
    userInfo: JSON.parse(sessionStorage.getItem('userInfo')) || {
      name: "",
      code: "",
      role: "",
    },
  }),
  setUserinfo(obj) { 
    this.state.userInfo = {...obj};
    sessionStorage.setItem('userInfo', JSON.stringify(this.state.userInfo));
  },
  getRole(){
    return  this.state.userInfo.role;
  }
};

export default store;
