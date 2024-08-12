<template>
  <el-container class="full-height">
    <el-header class="header-el">
      <div class="header-content">
        <div class="header-title">{{ roleText }}</div>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <el-avatar icon="el-icon-user-solid" class="avatar"></el-avatar>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="language">
                <span v-if="locale === 'en'" @click="switchLanguage">CN</span>
                <span v-else @click="switchLanguage">EN</span>
              </el-dropdown-item>
              <el-dropdown-item command="logout"
                >{{ $t("layout.logout") }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside-menu">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#1f2d3d"
          text-color="#fff"
          @select="handleSelect"
        >
          <el-sub-menu
            v-for="route in menuRoutes"
            :key="route.path"
            :index="route.path"
          >
            <template #title>
              <el-icon :size="20">
                <component :is="route.meta.icon" />
              </el-icon>
              <span>{{ $t(route.meta.pathName) }}</span>
            </template>

            <el-menu-item
              v-for="item in route.children"
              :key="item.path"
              :index="item.path"
            >
              {{ $t(item.meta.pathName) }}
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main class="main-content">
        <!-- <el-page-header >
          <template #breadcrumb>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item
                v-for="(item, index) in breadcrumbItems"
                :key="index"
              >
                <router-link :to="item.path">{{
                  item.meta.pathName
                }}</router-link>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </template>
        </el-page-header> -->

        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import store from "@/store/index";
const { t, locale } = useI18n();

const router = useRouter();
const route = useRoute();

// 获取当前角色的菜单路由
const menuRoutes = computed(() => {
  const role = store.getRole();
  const roleRoutes = router.getRoutes().find((r) => r.meta.role === role);
  return roleRoutes ? roleRoutes.children : [];
});
// 计算当前路径对应的面包屑项
const breadcrumbItems = computed(() => {
  const currentPath = router.currentRoute.value.path;
  const items = [];
  // 遍历所有子路由找到匹配的路径
  function findMatchingRoutes(routes) {
    for (const route of routes) {
      if (currentPath.startsWith(route.path)) {
        items.push(route);
        if (route.children) {
          findMatchingRoutes(route.children);
        }
      }
    }
  }
  findMatchingRoutes(menuRoutes.value);
  return items;
});
// 处理菜单选择
const handleSelect = (index) => {
  router.push(index);
};

// 处理下拉菜单命令
const handleCommand = (command) => {
  if (command === "logout") {
    const role = store.getRole();
    localStorage.removeItem("role");
    if (role === "agent") {
      router.push("/agent-login");
    } else if (role === "buyer") {
      router.push("/buyer-login");
    } else if (role === "seller") {
      router.push("/seller-login");
    } else {
      router.push("/");
    }
  } else if (command === "language") {
    locale.value = locale.value === "zh" ? "en" : "zh";
  }
};

// 获取当前角色
const role = computed(() => store.getRole());

// 根据角色显示不同的文字内容
const roleText = computed(() => {
  const currentRole = role.value;
  switch (currentRole) {
    case "agent":
      return t("layout.agentTitle");
    case "buyer":
      return t("layout.buyerTitle");
    case "seller":
      return t("layout.sellerTitle");
    default:
      return "";
  }
});
</script>

<style scoped>
.full-height {
  height: 100vh;
  padding: 0;
}

.header-el {
  background-color: var(--el-header-bg-color, #1f2d3d);
  color: white;
  linhe-height: 64px;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.aside-menu {
  height: calc(100vh - 64px); /* Header height is 64px */
  overflow-y: auto;
  background-color: var(--el-header-bg-color, #1f2d3d);
}

.main-content {
  height: calc(100vh - 64px); /* Header height is 64px */
  overflow-y: auto;
}

.avatar {
  cursor: pointer;
}
</style>
