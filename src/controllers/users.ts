import { Context } from "koa";
import { AppDataSource } from "../data-source";
import { User } from '../entity/User';
import argon2 from 'argon2';
import { ForbiddenException, NotFoundException } from "../exceptions";

export default class UserController {
  // 用户列表
  public static async userList(ctx: Context) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.find();
    ctx.body = { status: 200, data: user };
  }
  // 用户详情
  public static async showUserDetail(ctx: Context) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: ctx.params.id });
    if (user) {
      ctx.status = 200;
      ctx.body = { status: 200, data: user };
    } else {
      ctx.status = 404;
    }
  }
  // 更新用户信息
  public static async updateUser(ctx: Context) {
    if (ctx.state.user.id !== +ctx.params.id) {
      throw new ForbiddenException();
      return;
    }
    const userRepository = AppDataSource.getRepository(User);
    let user = await userRepository.findOneBy({ id: ctx.params.id });
    if (user) {
      user = {
        ...ctx.request.body as User,
        id: user.id,
        password: await argon2.hash(ctx.request.body.password)
      };
      await userRepository.save(user);
      ctx.body = { status: 200, msg: '更新成功' }
    } else {
      throw new NotFoundException();
    }
  }
  // 删除用户
  public static async deleteUser(ctx: Context) {
    // console.log('Look Both ID: ', ctx.state.user.id, +ctx.params.id);
    if (ctx.state.user.id !== +ctx.params.id) {
      throw new ForbiddenException();
      return;
    }
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: ctx.params.id });
    if (user) {
      await userRepository.remove(user);
      ctx.body = { status: 200, msg: '删除成功' }
    } else {
      throw new NotFoundException();
    }
  }
}