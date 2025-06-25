import { Test } from '@nestjs/testing';
import {
  ConsoleLogger,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as request from 'supertest';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import * as _ from 'lodash';
describe('Vote E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  it('创建候选人并开始选举', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ssn: '000-00-0000' })
      .expect(201);
    const token = _.get(res.body, 'data.access_token') as string;

    await request(app.getHttpServer())
      .post('/admin/candidates')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Bob' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/admin/start')
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
  });

  it('注册选民 + 验证身份', async () => {
    await request(app.getHttpServer())
      .post('/voters/register')
      .send({ name: 'Alice', ssn: '111-11-1111' })
      .expect(201);
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ssn: '111-11-1111' })
      .expect(201);
    const token = _.get(res.body, 'data.access_token') as string;
    // 选民身份验证
    await request(app.getHttpServer())
      .post('/voters/verify')
      .set('Authorization', `Bearer ${token}`)
      .send({ ssn: '111-11-1111' })
      .expect(201);
  });
  it('查看本人登记情况', async () => {
    let res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ssn: '111-11-1111' })
      .expect(201);
    const token = _.get(res.body, 'data.access_token') as string;
    res = await request(app.getHttpServer())
      .get('/voters/info')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const ssn = _.get(res.body, 'data.ssn') as string;
    expect(ssn).toBe('111-11-1111');
  });

  it('提交投票', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ssn: '111-11-1111' })
      .expect(201);
    const token = _.get(res.body, 'data.access_token') as string;

    await request(app.getHttpServer())
      .post('/votes')
      .set('Authorization', `Bearer ${token}`)
      .send({ candidateId: 1 })
      .expect(201);
  });

  it('停止选举以及查看选举结果', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ssn: '000-00-0000' })
      .expect(201);
    const token = _.get(res.body, 'data.access_token') as string;

    await request(app.getHttpServer())
      .post('/admin/stop')
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    await request(app.getHttpServer())
      .get('/admin/results')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('公共查看选举结果', async () => {
    await request(app.getHttpServer()).get('/public/live-results').expect(200);
  });
  afterAll(async () => {
    await app.close();
  });
});
