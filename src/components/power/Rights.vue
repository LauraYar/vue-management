<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-table :data="rightsList" border stripe="">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <!--因为要自定义渲染，通过作用域插槽来自定义属性，用scope接收所有数据  -->
          <template slot-scope="scope">
            <!-- 一级蓝色，二级绿色success三级黄色danger红色warning -->
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'"
              >二级</el-tag
            >
            <el-tag type="danger" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 放置权限列表数据
      rightsList: [],
    };
  },
  created() {
    // 在created阶段发起数据请求，通过getRightsList()函数获取所有权限
    this.getRightsList();
  },
  methods: {
    // 定义getRightsList()方法获取权限列表
    async getRightsList() {
      // 从接口文档粘贴请求路径rights/:type，此次请求的是列表类型权限数据
      const { data: res } = await this.$http.get('rights/list');
      if (res.meta.status !== 200)
        return this.$message.error('获取权限列表失败');
      this.$message.success('获取权限列表成功');
      // 把获取到的数据挂载到rightsList中，供页面使用
      this.rightsList = res.data;
      console.log(this.rightsList);
    },
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
</style>
