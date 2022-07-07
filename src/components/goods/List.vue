<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索商品区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="goAddpage"
            >添加商品</el-button
          ></el-col
        >
      </el-row>
      <!-- 商品列表区域 -->
      <el-table :data="goodsList" border="" stripe="">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格（元）"
          prop="goods_price"
          width="130px"
        ></el-table-column>
        <el-table-column
          label="商品数量"
          prop="goods_number"
          width="90px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="90px"
        ></el-table-column>
        <el-table-column label="添加时间" prop="add_time" width="160px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}</template
          ></el-table-column
        >
        <el-table-column label="当前时间" width="150px"></el-table-column>
        <el-table-column label="操作" width="140px">
          <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
          ></el-button>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 12, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 放置商品列表数据
      goodsList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 6,
      },
      total: 0,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 获取列表数据1.8.1
    async getGoodsList() {
      const { data: res } = await this.$http.get(`goods`, {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败');
      }
      this.$message.success('获取商品列表数据成功');
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      console.log(res.data);
    },
    // 分页区域监听size变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 分页区域监听页码变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    //  添加商品
    goAddpage() {
      this.$router.push('/goods/add');
    },
    addGoods() {},
  },
};
</script>

<style lang="less" scoped></style>
