### 模块说明
* voters：注册、验证
* admin：添加候选人、控制投票状态、查看结果
* votes：提交投票
* public：实时票数

### 功能
* 使用jwt验签，并且控制角色行为
* redis redlock控制选举人多次投票
* redis redlock控制admin 停止投票(防止连点)
* 实时票数用redis缓存10s
* 添加拦截器LoggingInterceptor 记录接口log
* 添加拦截器ResponseInterceptor 统一处理接口返回
* 添加过滤器GlobalExceptionFilter 统一处理错误信息
* 使用swagger写接口文档

### 调用
* 启动 npm run start:dev(你可以修改config/dev.json里面的mysql和redis为指定数据库)
* test测试用例 npm run test:e2e(部分接口存在幂等，会验证不通过)
* 访问swagger文档  http://localhost:3000/api/v1/docs
* 登录admin(admin账号会自动创建,ssn是000-00-0000)
```bash
curl --location 'localhost:3000/api/v1/auth/login' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'ssn=000-00-0000'
```
* 调用接口登记选民
```bash
curl --location 'localhost:3000/api/v1/voters/register' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'name=zhangs' \
--data-urlencode 'ssn=222-22-2222'
```
* docker本地直接部署 docker compose up -d，部署之后访问接口如上

### 后续优化
* jwt 验签的秘钥可以改为RSA方式
* 部分ts type的处理
