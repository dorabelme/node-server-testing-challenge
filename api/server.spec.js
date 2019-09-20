const request = require('supertest');

const server = require('./server.js');
const db = require('../database/dbConfig.js');

const bcrypt = require('bcryptjs');


describe('server', () => {
    beforeEach(async () => {
        await db("users").truncate();
    });

    describe('POST /REGISTER', () => {
        it('should return 201 status', () => {
            return request(server).post('/auth/register')
                .send({
                    username: "tommy",
                    password: "password2"
                })
                .set('Content-Type', 'application/json')
                .then(res => {
                    expect(res.status).toBe(201)
                    expect(res.body.username).toBe('tommy')
                })
        })

        it('username should be {Name}', () => {
            return request(server).post('/auth/register')
                .send({
                    username: "lily",
                    password: "pass"
                })
                .set('Content-Type', 'application/json')
                .then(res => {
                    expect(res.status).toBe(201)
                    expect(res.body.username).toBe('lily')
                })
        })
    })
});

let token;

describe('POST /LOGIN', () => {
    it('Token should exist', async () => {
        // await db.seed.run()
        await db('users').insert([
            { username: "admin", password: bcrypt.hashSync("admin", 16) },
            { username: "testuser", password: bcrypt.hashSync("test", 16) }
        ])

        const res = await request(server).post('/auth/login')
            .send({
                username: "admin",
                password: "admin"
            })
            .set('Content-Type', 'application/json')
                
        expect(res.status).toBe(200)
        expect(res.body.token).toBeTruthy()

        token = res.body.token;
    });

    it('should return 200 status', () => {
        return request(server).post('/auth/login')
            .send({
                username: "admin",
                password: "admin"
            })
            .set('Content-Type', 'application/json')
            .then(res => {
                expect(res.status).toBe(200)
                expect(res.body.message).toBe('You are logged in')
            });
    })

    it('username should be {Name}', () => {
        return request(server).post('/auth/login')
            .send({
                username: "lily",
                password: "pass"
            })
            .set('Content-Type', 'application/json')
            .then(res => {
                expect(res.status).toBe(200)
                expect(res.body.message).toBe('You are logged in')
            })
    })
})


let hardcoded_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRvcmEiLCJpYXQiOjE1Njg5MjI5MDEsImV4cCI6MTU2OTAwOTMwMX0.zuYasePVgpcJ6KgF8nLOAFV-ROlyoisTBB0yNGAGaZg';

describe('GET /api/users', () => {
    it('returns json OK', () => {
        return request(server).get('/api/users')
            .expect('Content-Type', /json/)
    });

    it('should return 200 Status', () => {
        return request(server).get('/api/users')
            .set('authorization', token)
            .then(res => {
                expect(res.status).toBe(200)
            })
    })

})



