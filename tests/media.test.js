const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Media = require('../models/Media');
const path = require('path');

let token;
let mediaId;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Create a test user and authenticate to get a token
    const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
    });

    const res = await request(app)
        .post('/api/auth/login')
        .send({ email: user.email, password: user.password });

    token = res.body.token;
});

afterAll(async () => {
    await User.deleteMany({});
    await Media.deleteMany({});
    await mongoose.connection.close();
});

describe('Media API', () => {
    it('should upload a media file', async () => {
        const res = await request(app)
            .post('/api/media/upload')
            .set('Authorization', `Bearer ${token}`)
            .field('description', 'Test Media Description')
            .attach('mediaFile', path.resolve(__dirname, 'test_media.jpg'));

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('mediaId');
        expect(res.body).toHaveProperty('mediaURL');
        mediaId = res.body.mediaId;
    });

    it('should like a media post', async () => {
        const res = await request(app)
            .post(`/api/media/like/${mediaId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('likesCount');
    });

    it('should comment on a media post', async () => {
        const res = await request(app)
            .post(`/api/media/comment/${mediaId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ comment: 'This is a test comment' });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('commentId');
        expect(res.body).toHaveProperty('comment', 'This is a test comment');
    });

    it('should delete a media post', async () => {
        const res = await request(app)
            .delete(`/api/media/delete/${mediaId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Media deleted successfully');
    });
});
