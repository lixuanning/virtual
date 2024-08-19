<template>
  <div class="userSetting">
    <el-form
      :model="form"
      :rules="registerRules"
      ref="formRef"
      @submit.prevent="submitForm"
      label-width="150px"
    >
      <!-- <el-form-item :label="$t('login.email')" prop="email">
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
      </el-form-item> -->

      <!-- 注册表单部分 -->
      <el-form-item :label="$t('register.idCardFrontId')" prop="idCardFrontId">
        <el-upload
          class="upload-demo"
          :before-upload="beforeUpload"
          :show-file-list="false"
          :http-request="(file) => customUpload(file, 'idCardFrontId')"
          :limit="1"
        >
          <el-button type="text">{{ $t("register.uploadFront") }}</el-button>
        </el-upload>
        <span v-if="imgUrl.idCardFrontId">
          <el-image
            style="width: 100px; height: 100px"
            :src="`data:image/jpeg;base64,${imgUrl.idCardFrontId}`"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="[
              `data:image/jpeg;base64,${imgUrl.idCardFrontId}`,
            ]"
            :initial-index="1"
            fit="cover"
        /></span>
      </el-form-item>

      <el-form-item :label="$t('register.idCardBackId')" prop="idCardBackId">
        <el-upload
          class="upload-demo"
          :before-upload="beforeUpload"
          :show-file-list="false"
          :http-request="(file) => customUpload(file, 'idCardBackId')"
          :limit="2"
        >
          <el-button type="text">{{ $t("register.uploadBack") }}</el-button>
        </el-upload>
        <span v-if="imgUrl.idCardBackId" class="img">
          <el-image
            style="width: 100px; height: 100px"
            :src="`data:image/jpeg;base64,${imgUrl.idCardBackId}`"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="[
              `data:image/jpeg;base64,${imgUrl.idCardBackId}`,
            ]"
            :initial-index="1"
            fit="cover"
        /></span>
      </el-form-item>

      <el-form-item
        :label="$t('register.idCardInHandId')"
        prop="idCardInHandId"
      >
        <el-upload
          class="upload-demo"
          :before-upload="beforeUpload"
          :show-file-list="false"
          :http-request="(file) => customUpload(file, 'idCardInHandId')"
          :limit="2"
        >
          <el-button type="text">{{ $t("register.uploadInHand") }}</el-button>
        </el-upload>
        <span v-if="imgUrl.idCardInHandId">
          <el-image
            style="width: 100px; height: 100px"
            :src="`data:image/jpeg;base64,${imgUrl.idCardInHandId}`"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="[
              `data:image/jpeg;base64,${imgUrl.idCardInHandId}`,
            ]"
            :initial-index="1"
            fit="cover"
        /></span>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">{{
          $t("form.confirm")
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import store from "@/store/index";
import { uploadPicture, previewPicture } from "@/api/file";
import { registerForOtc } from "@/api/otc";
import { login } from "@/api/auth";
import { getUserInfoForMerchant, updateMerchantInfo } from "@/api/buyer";
const { locale, t } = useI18n();
const router = useRouter();
const formRef = ref(null);
const loginFormRef = ref(null);
const isLogin = ref(true);

const loginForm = ref({
  email: "",
  password: "",
});
const form = ref({
  //   email: "",
  //   name: "",
  //   mobile: "",
  //   password: "",
  idCardFrontId: "",
  idCardBackId: "",
  idCardInHandId: "",
});
const imgUrl = ref({
  idCardFrontId: "",
  idCardBackId: "",
  idCardInHandId: "",
});
onMounted(() => {
  getUserData();
});
const getUserData = async () => {
  const res = await getUserInfoForMerchant();
  console.log(res.data);
  imgUrl.value.idCardFrontId = res.data.idCardFrontPicture;
  imgUrl.value.idCardBackId = res.data.idCardBackPicture;
  imgUrl.value.idCardInHandId = res.data.idCardInHandPicture;
  form.value.idCardFrontId = res.data.idCardFrontId;
  form.value.idCardBackId = res.data.idCardBackId;
  form.value.idCardInHandId = res.data.idCardInHandId;
  console.log(imgUrl, "imgUrl");
};
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
  password: [
    {
      required: true,
      message: t("login.password_placeholder"),
      trigger: "blur",
    },
  ],
  idCardFrontId: [
    {
      required: true,
      message: t("register.idCardFront_placeholder"),
      trigger: "change",
    },
  ],
  idCardBackId: [
    {
      required: true,
      message: t("register.idCardBack_placeholder"),
      trigger: "change",
    },
  ],
  idCardInHandId: [
    {
      required: true,
      message: t("register.idCardInHand_placeholder"),
      trigger: "change",
    },
  ],
});

const switchLanguage = () => {
  locale.value = locale.value === "zh" ? "en" : "zh";
};

const toggleForm = () => {
  isLogin.value = !isLogin.value;
};

const submitForm = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 调用注册 API，成功后跳转到登录页面或首页
      const res = await updateMerchantInfo({
        ...form.value,
      });
      ElMessage.success(t("form.success"));
      isLogin.value = true;
    }
  });
};

const forgotPassword = () => {
  // 模拟发送邮件
  ElMessage.success("重置密码邮件已发送，请检查您的邮箱");
};

// 自定义上传配置
const beforeUpload = (file) => {
  const isJPG = file.type === "image/jpeg" || file.type === "image/png";
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error("上传图片只能是 JPG/PNG 格式!");
  }
  if (!isLt2M) {
    ElMessage.error("上传图片大小不能超过 2MB!");
  }
  return isJPG && isLt2M;
};

// 将图片数据转换为 base64 URL

const customUpload = async ({ file, onSuccess, onError }, field) => {
  try {
    const response = await uploadPicture({ file: file });
    form.value[field] = response.data.pictureId;
    const url = await previewPicture({ pictureId: response.data.pictureId });
    const base64Url = url.data.picture;
    imgUrl.value[field] = base64Url;
    ElMessage.success("图片上传成功");
  } catch (error) {
    onError(error);
  }
};

const handleUploadSuccess = (field) => (response) => {
  console.log(field, response);
  if (response && response.data && response.code === "0") {
    form.value[field] = response.data.pictureId;
    ElMessage.success("图片上传成功");
  } else {
    ElMessage.error("上传失败");
  }
};
</script>

<style scoped>
.userSetting {
}
</style>
