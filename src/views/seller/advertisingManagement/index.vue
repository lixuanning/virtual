<template>
    <el-container>
      <!-- 顶部搜索表单 -->
      <el-header class="header">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item :label="$t('form.label')">
            <el-input v-model="searchForm.query"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">{{ $t('form.search') }}</el-button>
            <el-button @click="handleReset">{{ $t('form.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </el-header>
  
      <!-- 顶部操作按钮 -->
      <el-header class="header">
        <el-button type="primary" @click="showAddDialog">{{ $t('form.add') }}</el-button>
      </el-header>
  
      <!-- 表格和分页 -->
      <el-main>
        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading">
          <el-table-column prop="date" :label="$t('form.date')" width="180"></el-table-column>
          <el-table-column prop="name" :label="$t('form.name')" width="180"></el-table-column>
          <el-table-column prop="address" :label="$t('form.address')"></el-table-column>
          <el-table-column :label="$t('form.actions')" width="300">
            <template #default="scope">
              <el-button type="text" @click="showViewDialog(scope.row)">{{ $t('form.view') }}</el-button>
              <el-button type="text" @click="showEditDialog(scope.row)">{{ $t('form.edit') }}</el-button>
              <el-popconfirm
                title="确定要删除这条记录吗？"
                confirm-button-text="是"
                cancel-button-text="否"
                @confirm="() => handleDelete(scope.row)"
              >
                <template #reference>
                  <el-button type="text">{{ $t('form.delete') }}</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalItems"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
        ></el-pagination>
      </el-main>
  
      <!-- 查看详情对话框 -->
      <el-dialog :title="$t('form.view')" v-model="isViewDialogVisible">
        <el-form :model="viewForm" label-width="100px">
          <el-form-item :label="$t('form.date')">
            <el-input v-model="viewForm.date" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('form.name')">
            <el-input v-model="viewForm.name" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('form.address')">
            <el-input v-model="viewForm.address" disabled></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="isViewDialogVisible = false">{{ $t('form.close') }}</el-button>
        </template>
      </el-dialog>
  
      <!-- 新增对话框 -->
      <el-dialog :title="$t('form.add')" v-model="isAddDialogVisible">
        <el-form :model="addForm" :rules="rules" ref="addFormRef" label-width="100px">
          <el-form-item :label="$t('form.date')" prop="date">
            <el-input v-model="addForm.date"></el-input>
          </el-form-item>
          <el-form-item :label="$t('form.name')" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('form.address')" prop="address">
            <el-input v-model="addForm.address"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="isAddDialogVisible = false">{{ $t('form.cancel') }}</el-button>
          <el-button type="primary" :loading="dialogLoading" @click="handleAddSubmit">{{ $t('form.add') }}</el-button>
        </template>
      </el-dialog>
  
      <!-- 编辑对话框 -->
      <el-dialog :title="$t('form.edit')" v-model="isEditDialogVisible">
        <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="100px">
          <el-form-item :label="$t('form.date')" prop="date">
            <el-input v-model="editForm.date"></el-input>
          </el-form-item>
          <el-form-item :label="$t('form.name')" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('form.address')" prop="address">
            <el-input v-model="editForm.address"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="isEditDialogVisible = false">{{ $t('form.cancel') }}</el-button>
          <el-button type="primary" :loading="dialogLoading" @click="handleEditSubmit">{{ $t('form.save') }}</el-button>
        </template>
      </el-dialog>
    </el-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { ElMessage } from 'element-plus';
  
  // 模拟获取数据的函数
  const fetchData = async (query = '', page = 1, pageSize = 10) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const total = 100;
        const data = Array.from({ length: pageSize }, (_, index) => ({
          date: `2016-05-${String(index + 1).padStart(2, '0')}`,
          name: `John Doe ${index + (page - 1) * pageSize}`,
          address: `No. 189, Grove St, Los Angeles`
        }));
        resolve({ data, total });
      }, 500);
    });
  };
  
  const { t } = useI18n();
  
  const searchForm = ref({
    query: ''
  });
  
  const tableData = ref([]);
  const totalItems = ref(0);
  const pageSize = ref(10);
  const currentPage = ref(1);
  
  const viewForm = ref({});
  const addForm = ref({
    date: '',
    name: '',
    address: ''
  });
  const editForm = ref({
    date: '',
    name: '',
    address: ''
  });
  
  const rules = ref({
    date: [{ required: true, message: t('form.date_required'), trigger: 'blur' }],
    name: [{ required: true, message: t('form.name_required'), trigger: 'blur' }],
    address: [{ required: true, message: t('form.address_required'), trigger: 'blur' }]
  });
  
  const isViewDialogVisible = ref(false);
  const isAddDialogVisible = ref(false);
  const isEditDialogVisible = ref(false);
  const addFormRef = ref(null);
  const editFormRef = ref(null);
  const dialogLoading = ref(false); // 对话框按钮加载状态
  const tableLoading = ref(false); // 表格加载状态
  
  // 加载数据函数
  const loadData = async () => {
    tableLoading.value = true;
    console.log(currentPage);
    const { data, total } = await fetchData(searchForm.value.query, currentPage.value, pageSize.value);
    tableData.value = data;
    totalItems.value = total;
    tableLoading.value = false;
  };
  
  // 处理搜索
  const handleSearch = () => {
    currentPage.value = 1; // 重置到第一页
    loadData();
  };
  
  // 处理重置
  const handleReset = () => {
    searchForm.value.query = '';
    handleSearch();
  };
  
  // 处理删除
  const handleDelete = (row) => {
    ElMessage.success(`Deleted ${row.name}`);
    // 模拟删除后刷新数据
    loadData();
  };
  
  // 处理查看详情
  const handleView = (row) => {
    viewForm.value = { ...row };
    isViewDialogVisible.value = true;
  };
  
  // 处理分页
  const handlePageChange = (page) => {
    currentPage.value = page;
    loadData();
  };
  
  // 处理新增提交
  const handleAddSubmit = () => {
    dialogLoading.value = true;
    addFormRef.value.validate((valid) => {
      if (valid) {
        setTimeout(() => {
          ElMessage.success('Added successfully');
          // 模拟添加后刷新数据
          isAddDialogVisible.value = false;
          dialogLoading.value = false;
          loadData();
        }, 1000); // 模拟请求延迟
      } else {
        dialogLoading.value = false;
      }
    });
  };
  
  // 处理编辑提交
  const handleEditSubmit = () => {
    dialogLoading.value = true;
    editFormRef.value.validate((valid) => {
      if (valid) {
        setTimeout(() => {
          ElMessage.success('Updated successfully');
          // 模拟编辑后刷新数据
          isEditDialogVisible.value = false;
          dialogLoading.value = false;
          loadData();
        }, 1000); // 模拟请求延迟
      } else {
        dialogLoading.value = false;
      }
    });
  };
  
  // 显示查看对话框
  const showViewDialog = (row) => {
    viewForm.value = { ...row };
    isViewDialogVisible.value = true;
  };
  
  // 显示新增对话框
  const showAddDialog = () => {
    addForm.value = {
      date: '',
      name: '',
      address: ''
    };
    isAddDialogVisible.value = true;
  };
  
  // 显示编辑对话框
  const showEditDialog = (row) => {
    editForm.value = { ...row };
    isEditDialogVisible.value = true;
  };
  
  // 页面挂载时加载数据
  onMounted(() => {
    loadData();
  });
  </script>
  
  <style scoped>
  .header {
    padding: 10px;
    background-color: #f0f2f5;
    display: flex;
    align-items: center;
  }
  
  .demo-form-inline .el-form-item {
    margin-right: 10px;
  }
  
  .el-main {
    padding: 20px;
    background-color: #fff;
  }
  </style>
  