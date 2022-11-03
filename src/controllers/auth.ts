import { Context } from "koa";
// 引入加密工具库
import argon2 from 'argon2';
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";
import { RegisterErrException, NotFoundException, PasswordErrorException } from "../exceptions";

export default class AuthController {
  // 登录
  public static async login(ctx: Context) {
    const { account, password } = ctx.request.body;
    const repository = await AppDataSource.getRepository(User);
    // 由于数据库的 password 设置了查询时默认不选中，所以无法直接通过 findoneBy 获取到带有 password 字段的结果
    // 所以需要使用 createQueryBuilder 方法进行查询，用法参考文档 https://github.com/typeorm/typeorm/blob/master/docs/repository-api.md
    const user = await repository
      .createQueryBuilder()
      .where({ account })
      .addSelect('User.password')
      .getOne();
    // console.log('Look user: ', user);
    if (!user) {
      throw new NotFoundException();
    } else if (await argon2.verify(user.password, password)) {
      ctx.body = { token: jwt.sign({ id: user.id }, JWT_SECRET) }
    } else {
      throw new PasswordErrorException();
    }
  }
  // 注册
  public static async register(ctx: Context) {
    let user = new User();
    user = {
      ...ctx.request.body,
      // 进行密码加密
      password: await argon2.hash(ctx.request.body.password)
    }
    const repository = await AppDataSource.getRepository(User);
    const result = await repository.save(user);
    console.log('result: ', result);
    if (result) {
      ctx.body = { status: 200, msg: '注册成功' }
    } else {
      throw new RegisterErrException();
    }
  }
}