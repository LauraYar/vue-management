<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索订单区域 -->
      <el-row>
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column type="index" label="序号">
          <!-- 序号改进 -->
          <template scope="scope">
            <span>{{
              (queryInfo.pagenum - 1) * queryInfo.pagesize + scope.$index + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="220">
        </el-table-column>
        <el-table-column prop="order_id" label="订单id"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格" align="center">
        </el-table-column>
        <el-table-column prop="order_pay" label="是否付款" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay == 0"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" align="center">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}</template
          >
        </el-table-column>
        <el-table-column label="操作">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="addressVisible = true"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-location"
            size="mini"
            @click="showProgress"
          ></el-button>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.newPage"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.newsize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 编辑弹出对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="30%"
        @close="addressClosed"
      >
        <el-form
          ref="addressFormRef"
          :model="addressForm"
          label-width="100px"
          :rules="addressFormRules"
        >
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              :options="cityData"
              v-model="addressForm.address1"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-cascader></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 物流进度按钮弹出对话框 -->
      <el-dialog
        title="物流进度"
        :visible.sync="progressVisible"
        width="50%"
        @close="progressClosed"
      >
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(progress, index) in progressList"
            :key="index"
            :timestamp="progress.time"
          >
            {{ progress.context }}
          </el-timeline-item>
        </el-timeline>
        <span slot="footer" class="dialog-footer">
          <el-button @click="progressVisible = false">取 消</el-button>
          <el-button type="primary" @click="progressVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// 导入级联选择器“省市区/县”的数据，命名cityData接收。在data里定义cityData，结构里用：option绑定
import cityData from './citydata.js';
export default {
  data() {
    return {
      // 用来放接口请求参数的集合
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 8,
        user_id: '',
        pay_status: '',
        is_send: '',
        order_fapiao_company: '',
      },
      // 用来接收请求回来的所有数组
      orderList: [],
      // 定义数据总条数res.data.total
      total: 0,
      // 编辑对话框的显示与隐藏
      addressVisible: false,
      addressForm: {
        address1: '',
        address2: '',
      },
      addressFormRules: {
        address1: {
          required: true,
          message: '请选择省市区/县',
          trigger: 'blur',
        },
        address2: {
          required: true,
          message: '请选择详细地址',
          trigger: 'blur',
        },
      },
      cityData: cityData,
      // 进度对话框显示与隐藏
      progressVisible: false,
      progressForm: {
        progress1: '',
        progress2: '',
      },
      progressFormRules: {
        progress1: {
          required: true,
          message: '请选择省市区/县',
          trigger: 'blur',
        },
        progress2: {
          required: true,
          message: '请选择详细地址',
          trigger: 'blur',
        },
      },
      // 放置物流信息
      progressList: [],
      reverse: true,
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    // 1.8.1获取订单表格数据
    async getOrderList() {
      console.log('chaxun');
      const { data: res } = await this.$http.get(`orders`, {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表数据失败');
      }
      // console.log(res);
      this.orderList = res.data.goods;
      this.total = res.data.total;
      console.log(this.orderList);
    },
    // 分页功能
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getOrderList();
    },
    // 监听页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    addressClosed() {
      this.$refs.addressFormRef.resetFields();
    },
    // 点击progress按钮，发起数据请求
    async showProgress() {
      this.progressVisible = true;
      const { data: res } = await this.$http.get(`/kuaidi/1106975712662`);
      if (res.meta.status !== 200)
        return this.$message.error('获取物流信息失败');
      this.progressList = res.data;
      // console.log(this.progressList);
    },
    progressClosed() {},
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
