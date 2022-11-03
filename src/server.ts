import Koa from 'koa';
import { Context } from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import { AppDataSource } from './data-source';

import { unprotectedRouter, protectedRouter } from './routes';
import logger from './logger';
import { JWT_SECRET } from './constants'
// npm install koa-jwt jsonwebtoken
// koa-jwt 是负责对 token 进行验证的，而 jsonwebtoken 是负责生成 token 的;  jsonwebtoken包在auth.ts文件中有引入
// npm install @types/jsonwebtoken -D jsonwebtoken
import jwt from 'koa-jwt';

// 初始化与数据库的初始连接，注册所有实体
// 和“同步”数据库模式，在应用程序引导程序中调用新创建的数据库的“initialize()”方法一次
AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
    // 初始化 koa 实例
    const app = new Koa();

    // 注册中间件
    app.use(cors());
    app.use(bodyParser());
    // 注册日志中间件
    app.use(logger());

    // 请求错误处理中间件
    app.use(async (ctx: Context, next: () => Promise<void>) => {
      try {
        await next();
      } catch (error) {
        ctx.body = {
          status: error.status,
          message: error.message
        }
      }
    })

    // 响应用户请求 (请求处理函数)
    // app.use((ctx) => {
    //   ctx.body = "hello koa"
    // });
    // 替换为 router 配置
    // 无需token
    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());
    // 注册jwt中间件
    app.use(jwt({ secret: JWT_SECRET }).unless({ method: 'GET' }));
    // 需要token
    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

    // 监听端口，运行服务器
    app.listen(8001);
  })
  .catch((error) => console.log(error))
