const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

let token;
let userId;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe('User API', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('username');
        userId = res.body.userId;
    });

    it('should login the user and return a token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('should update the user profile', async () => {
        const res = await request(app)
            .put('/api/user/update')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'updateduser',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('username', 'updateduser');
    });

    it('should delete the user account', async () => {
        const res = await request(app)
            .delete('/api/user/delete')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'User account deleted successfully');
    });
});
