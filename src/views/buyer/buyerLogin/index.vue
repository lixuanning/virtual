<template>
  <div class="login-container">
    <div class="form-container">
      <!-- 切换语言按钮 -->
      <el-button
        class="language"
        size="small"
        type="text"
        @click="switchLanguage"
      >
        <span v-if="locale === 'en'">CN</span>
        <span v-else>EN</span>
      </el-button>

      <!-- 表单标题 -->
      <p class="title">
        {{ isLogin ? $t("login.buyerTitle") : $t("register.title") }}
      </p>

      <!-- 登录表单 -->
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
        @submit.prevent="loginSubmitForm"
        label-width="100px"
        v-if="isLogin"
      >
        <el-form-item :label="$t('login.email')" prop="email">
          <el-input
            v-model="loginForm.email"
            :placeholder="$t('login.email')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('login.password')" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            :placeholder="$t('login.password')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loginSubmitForm">{{
            $t("login.submit")
          }}</el-button>
          <el-button type="text" @click="forgotPassword">{{
            $t("login.forgot_password")
          }}</el-button>
          <el-button type="text" @click="toggleForm">{{
            $t("register.title")
          }}</el-button>
        </el-form-item>
      </el-form>

      <!-- 注册表单 -->
      <el-form
        :model="form"
        :rules="registerRules"
        ref="formRef"
        @submit.prevent="submitForm"
        label-width="150px"
        v-if="!isLogin"
      >
        <el-form-item :label="$t('login.email')" prop="email">
          <el-input
            v-model="form.email"
            :placeholder="$t('login.email')"
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('register.name')" prop="name">
          <el-input
            v-model="form.name"
            :placeholder="$t('register.name')"
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('register.mobile')" prop="mobile">
          <el-input
            v-model="form.mobile"
            :placeholder="$t('register.mobile')"
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('login.password')" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            :placeholder="$t('login.password')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('form.proxyFlag')" prop="proxyFlag">
          <el-radio-group v-model="form.proxyFlag">
            <el-radio :value="0">{{ $t("form.no") }}</el-radio>
            <el-radio :value="1">{{ $t("form.yes") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">{{
            $t("register.submit")
          }}</el-button>
          <el-button type="text" @click="toggleForm">{{
            $t("login.submit")
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import store from "@/store/index";
import { uploadPicture, previewPicture } from "@/api/file";
import { registerForMerchant } from "@/api/buyer";
import { login } from "@/api/auth";
const { locale, t } = useI18n();
const router = useRouter();
const formRef = ref(null);
const loginFormRef = ref(null);
const isLogin = ref(true);
onMounted(() => {
  store.setUserinfo({});
});

const loginForm = ref({
  email: "",
  password: "",
});
const form = ref({
  email: "",
  name: "",
  mobile: "",
  password: "",
  proxyFlag: 0,
});

const loginRules = ref({
  email: [
    { required: true, message: t("login.email_placeholder"), trigger: "blur" },
    {
      type: "email",
      message: t("login.email_format_error"),
      trigger: ["blur", "change"],
    },
  ],
  password: [
    {
      required: true,
      message: t("login.password_placeholder"),
      trigger: "blur",
    },
  ],
});

const registerRules = ref({
  email: [
    { required: true, message: t("login.email_placeholder"), trigger: "blur" },
    {
      type: "email",
      message: t("login.email_format_error"),
      trigger: ["blur", "change"],
    },
  ],
  name: [
    {
      required: true,
      message: t("register.name_placeholder"),
      trigger: "blur",
    },
  ],
  mobile: [
    {
      required: true,
      message: t("register.mobile_placeholder"),
      trigger: "blur",
    },
  ],
  proxyFlag: [
    {
      required: true,
      message: t("register.mobile_placeholder"),
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: t("login.password_placeholder"),
      trigger: "blur",
    },
  ],
});

const switchLanguage = () => {
  locale.value = locale.value === "zh" ? "en" : "zh";
};

const toggleForm = () => {
  isLogin.value = !isLogin.value;
};
const loginSubmitForm = async () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      const res = await login({
        ...loginForm.value,
      });
      if (res.data.type === 3) {
        if (res.data.token) {
          //代理
          if (res.data.proxyFlag === 1) {
            store.setUserinfo({
              role: "proxyBuyer",
              token: res.data.token,
            });
            router.push("/buyer/transactionManagement/proxyRecharge");
          } else {
            store.setUserinfo({
              role: "buyer",
              token: res.data.token,
            });
            router.push("/buyer/home/dashboard");
          }
        }
      } else {
        ElMessage.error("用户名或密码错误");
      }
    }
  });
};
const submitForm = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 调用注册 API，成功后跳转到登录页面或首页
      const res = await registerForMerchant({
        ...form.value,
      });
      ElMessage.success("注册成功！");
      isLogin.value = true;
    } else {
      ElMessage.error("表单验证失败");
    }
  });
};

const forgotPassword = () => {
  // 模拟发送邮件
  ElMessage.success("重置密码邮件已发送，请检查您的邮箱");
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5; /* 设置背景颜色 */
  position: relative;
  z-index: 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

.header p {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  flex: 1;
}

.form-container {
  width: 400px;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1;
  position: relative; /* 相对定位 */
}

.el-form-item {
  margin-bottom: 20px;
}

.language {
  position: absolute; /* 绝对定位 */
  top: 10px;
  right: 10px;
}

.title {
  text-align: center;
  font-size: 18px;
  font-weight: 500;
}
</style>
