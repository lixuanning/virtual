import { reactive } from "vue";

const store = {
  debug: true,
  state: reactive({
    userInfo: {
      name: "",
      code: "",
      role: "",
    },
  }),
  setUserinfo(obj) { 
    this.state.userInfo = {...obj};
  },
  getRole(){
    return  this.state.userInfo.role;
  }
};

export default store;
