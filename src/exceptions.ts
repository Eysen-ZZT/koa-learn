// src/exceptions.ts
export class BaseException extends Error {
  // 状态码
  status: number;
  // 提示信息
  message: string;
}

export class RegisterErrException extends BaseException {
  status = 400;

  constructor(msg?: string) {
    super();
    this.message = msg || '注册失败';
  }
}

export class NotFoundException extends BaseException {
  status = 404;

  constructor(msg?: string) {
    super();
    this.message = msg || '未查找到对应内容';
  }
}

export class UnauthorizedException extends BaseException {
  status = 401;

  constructor(msg?: string) {
    super();
    this.message = msg || '未登录，请先登入';
  }
}

export class ForbiddenException extends BaseException {
  status = 403;

  constructor(msg?: string) {
    super();
    this.message = msg || '暂无权限';
  }
}

export class PasswordErrorException extends BaseException {
  status = 400;

  constructor(msg?: string) {
    super();
    this.message = msg || '密码错误';
  }
}