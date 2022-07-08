<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 table组件里有expand属性 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 动态绑定class类名，如果索引为0，则加一个上边框，不为0则为一个空对象 -->
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag> {{ item1.autoName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      :class="[i3 === 0 ? '' : 'bdtop']"
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <pre>
                 <!-- {{ scope.row }} -->
            </pre>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <!-- 加作用域插槽 -->
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <!-- 分配权限按钮 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 分配权限弹出框：树形控件el-tree -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 放置数据
      rolesList: [],
      setRightDialogVisible: false,
      // 放权限数据，默认为空
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        // label属性：指定看到的是哪一个属性
        label: 'authName',
        // 父子嵌套children属性，接口文档中也是通过children来实现父子节点嵌套
        children: 'children',
      },
      // 默认选中的节点id值数组,比如一打开默认选中“添加商品id:105,”"商品修改id：116",父节点待选状态
      defKeys: [],
      // 当前即将分配权限的角色Id
      roleId: '',
      // 添加角色对话框显示与隐藏
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur',
          },
        ],
      },
      // 修改角色信息
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles');
      if (res.meta.status != 200)
        return this.$message.error('获取角色列表失败');
      this.$message.success('获取角色列表成功');
      this.rolesList = res.data;
      // console.log(res);
    },
    // 根据Id删除对应的权限
    async removeRightById(role, rightId) {
      // 返回值是一个promise。用await接收
      const confirmResult = await await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err);
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除！');
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败');
      }
      // this.getRolesList();
      role.children = res.data;
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      // 对话框弹出前获取所有数据
      const { data: res } = await this.$http.get('rights/tree');
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限失败');
      }
      // 把获取到的权限数据保存到data中
      this.rightsList = res.data;
      // console.log(this.rightsList);
      // 递归获取三级节点的Id
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
    },
    // 实现已有权限的默认勾选功能。通过递归的形式获取角色下所有三级权限的id，并保存到数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = [];
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      // console.log(keys);
      // 英文逗号。拼接
      const idStr = keys.join(',');
      // 角色授权API
      const { data: res } = await this.$http.post(
        'roles/${this.roleId}/rights',
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色权限失败');
      }
      this.$message.success('分配角色成功');
      // 刷新整个对话框数据列表
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
    // 添加角色1.5.2
    addRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post('roles', this.addForm);
        if (res.meta.status !== 201) return this.$meaasge.error('添加角色失败');
        this.$message.success('添加角色成功');
        this.addDialogVisible = false;
        this.getRolesList();
      });
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 编辑角色
    // 1.点击编辑按钮根据唯一的id值拿到此行数据
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id);
      if (res.meta.status !== 200) {
        return;
      }
      console.log(id);
      console.log(res);
      this.editForm = res.data;
      console.log(this.editForm);
      this.editDialogVisible = true;
    },
    // 编辑后点击确定按钮发送
    editRole() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        // console.log(valid);
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error('编辑提交失败');
        }
        // console.log(this.editForm.roleId);
        // console.log('获取数据了吗', res.data);
        this.editDialogVisible = false;
        this.getRolesList();
      });
    },
    editDialogClosed() {},
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 8px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
