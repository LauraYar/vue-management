<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 主体表格区域 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="(scope.row.cat_delele = false)"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!--操作  -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-search" size="mini"
            >编辑</el-button
          >
          <el-button type="primary" icon="el-icon-search" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的弹出对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="30%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        label-width="80px"
        :rules="addCateFormRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- Cascader组件 option用来指定数据源 props配置选项v-model必须绑定一个数组而不是值或对象 change-on-select允许只选择父级而不是最近一级（新版已取消） -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 放置商品数据列表
      cateList: [],
      // 总数据条数
      total: 10,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok',
        },
        {
          label: '排序',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order',
        },
        {
          label: '操作',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt',
        },
      ],
      // 控制添加分类弹出对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 父级分类的ID
        cat_pid: 0,
        // 将要添加的分类的名称
        cat_name: '',
        // 0代表分类等级默认添加一级分类
        cat_level: 0,
      },
      // 验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' },
        ],
      },
      // 放置父级分类数列表
      parentCateList: [],
      // 用来指定级联选择器的配置对象
      cascaderProps: {
        // Props.value	指定选项的值为选项对象的某个属性值
        value: 'cat_id',
        // Props.label	指定选项标签为选项对象的某个属性值
        label: 'cat_name',
        // Props.children	指定选项的子选项为选项对象的某个属性值
        children: 'children',
      },
      // 选中的父级分类的ID数组
      selectedKeys: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品数据分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryinfo,
      });
      if (res.meta.status != 200)
        return this.$message.error('获取商品分类数据列表失败');
      // this.$message.success('获取商品分类数据列表成功');
      // console.log(res);
      // 把数据列表赋值给catelist
      this.cateList = res.data.result;
    },
    // 监听pagesize改变
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize;
      this.getCateList();
    },
    // 监听pagenum改变
    handleCurrentChange(newPage) {
      this.queryinfo.pagenum = newPage;
      this.getCateList();
    },
    // 点击添加分类btn按钮显示对话框
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList();
      // 再展示出对话框
      this.addCateDialogVisible = true;
    },
    // 获取父级1.6.1商品分类的数据列表
    async getParentCateList() {
      // type:2代表获取前两层的数据
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      });
      if (res.meta.status != 200) return this.$message.error('获取失败');
      this.parentCateList = res.data;
    },
    // 选择项发生变化时触发这个函数
    parentCateChanged() {
      console.log(this.selectedKeys);
      // 如果selectedKeys数组中的length大于0，证明选中的父级分类，反之说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0;
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    // 点击对话框确定按钮，添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        );
        if (res.meta.status != 201) {
          return this.$message.error('添加分类失败');
        }
        this.$message.success('添加成功');
        this.getCateList();
        this.addCateDialogVisible = false;
        console.log(this.addCateForm);
      });
    },
    // 监听对话框的关闭事件，清空重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      (this.selectedKeys = []), (this.addCateForm.cat_level = 0);
      this.addCateForm.cat_pid = 0;
    },
  },
};
</script>

<style scoped lang="less">
.treeTable {
  margin-top: 10px;
}
.el-cascader {
  width: 100%;
}
</style>
