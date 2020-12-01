<template >
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户的按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表(表格)区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <!-- 用户当前状态的按钮 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <!-- 三个操作按钮 -->
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              >
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
              >
              </el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="this.queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 对话框主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的弹出框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 对话框主体区域 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        return cb();
      }
      //返回一个错误提示
      cb(new Error("请输入合法的邮箱"));
    };
    //验证手机号码的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      //返回一个错误提示
      cb(new Error("请输入合法的手机号码"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editForm: {
        username: "",
        email: "",
        mobile: "",
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名在3~10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名在6~15个字符之间",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            message: "邮箱格式不正确，请重新输入",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            validator: checkMobile,
            message: "手机号码不正确，请重新输入",
            trigger: "blur",
          },
        ],
      },
      editFormRules: {
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          {
            validator: checkEmail,
            message: "邮箱格式不正确，请重新输入",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: "blur",
          },
          {
            validator: checkMobile,
            message: "手机号码不正确，请重新输入",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //   更新列表
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200)
        return this.$message.error("获取用户列表失败");
      console.log(res);
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 改变当前列表显示条目数
    handleSizeChange(newSize) {
      console.log(this.queryInfo.pagesize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 改变当前列表页数
    handleCurrentChange(current) {
      console.log(this.queryInfo.pagenum);
      this.queryInfo.pagenum = current;
      this.getUserList();
    },
    // 改变用户当前状态
    async userStateChanged(row) {
      const { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      );
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state;
        return this.$message.error("修改状态失败");
        console.log("no");
      }
      this.$message.success("更新状态成功");
      console.log("ok");
    },
    // 关闭弹出框时清空输入框
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 添加用户提交按钮
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请填写完整信息");
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status != 201) {
          return this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    // 编辑用户提交按钮
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请填写完整信息");
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          this.editForm
        );
        if (res.meta.status != 200) {
          return this.$message.error("修改用户失败");
        }
        this.$message.success("修改用户成功");
        this.editDialogVisible = false;
        this.getUserList();
      });
    },
    // 通过id获取要修改的值
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status != 200) {
        return this.$message.error("获取用户信息失败");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
      console.log(this.editForm);
    },
    // 删除用户
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        "请问是否要永久删除该用户",
        "删除提示",
        {
          confirmButtonText: "确认删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.error("已取消操作");
      }

      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status != 200) {
        return this.$message.error("删除数据失败");
      }
      this.$message.success("删除成功");
if (document.querySelectorAll('.el-card tbody tr').length === 1) {
        this.queryInfo.pagenum = this.queryInfo.pagenum > 1 ? this.queryInfo.pagenum - 1 : 1
      }
      this.getUserList();
    },
  },
  //   创建页面时刷新列表
  created() {
    this.getUserList();
    console.log('小伙子你不讲武德');
    console.log('来骗，来偷袭');
    console.log('我一个69岁的，老程序员')
    console.log('这好吗，这不好')
  },
};
</script>

<style lang="less" scoped >
</style>

<style lang="less">
.el-table {
  th {
    text-align: center;
  }
}
</style>