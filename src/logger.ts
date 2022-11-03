// 引入 ctx 类型
import { Context } from "koa";

// 导出日志函数
export default function logger() {
  // 返回请求函数（Request Handle），next 类型是一个函数，且返回值是 Promise
  // 由于 next 返回的是 Promise ，所以使用async await 进行异步等待
  return async (ctx: Context, next: () => Promise<void>) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} ${ctx.status} -- ${ms}`);
  }
}