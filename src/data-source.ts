import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from './entity/User';

// 在确保 MySQL 实例运行之后，我们打开终端，通过命令行连接数据库：
// $ mysql -u root -p

// 复制代码输入预先设置好的根帐户密码之后，就进入了 MySQL 的交互式执行客户端，然后运行以下命令：
// --- 创建数据库
// CREATE DATABASE koa;

// --- 创建用户并授予权限
// CREATE USER 'user'@'localhost' IDENTIFIED BY 'pass';
// GRANT ALL PRIVILEGES ON koa.* TO 'user'@'localhost';

// --- 处理 MySQL 8.0 版本的认证协议问题
// ALTER USER 'user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'pass';
// flush privileges;

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  // 这个地方不是填 username: "root", password: "123456", 而是填上面注释里头创建的用户
  // 否则会报 ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client
  username: "user",
  password: "pass",
  database: "koa",
  entities: [User],
  synchronize: true,
  logging: false,
})