<template>
  <div class="login-container">
    <div class="form-container">
      <el-button
        class="language"
        size="small"
        type="text"
        @click="switchLanguage"
      >
        <span v-if="locale === 'en'">CN</span>
        <span v-else>EN</span>
      </el-button>

      <p class="title">{{ $t("login.sellerTitle") }}</p>
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        @submit.prevent="submitForm"
        label-width="80px"
      >
        <el-form-item :label="$t('login.email')" prop="email">
          <el-input
            v-model="form.email"
            :placeholder="$t('login.email')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('login.password')" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            :placeholder="$t('login.password')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">{{
            $t("login.submit")
          }}</el-button>
          <el-button type="text" @click="forgotPassword">{{
            $t("login.forgot_password")
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

onMounted(() => {
  store.setUserinfo({});
  sessionStorage.clear();
});
const { locale, t } = useI18n();

const form = ref({
  email: "",
  password: "",
});

const rules = ref({
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

const formRef = ref(null);
const router = useRouter();


const switchLanguage = () => {
  locale.value = locale.value === "zh" ? "en" : "zh";
};

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      store.setUserinfo({ role: "seller" });
      router.push("/seller/home");
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
