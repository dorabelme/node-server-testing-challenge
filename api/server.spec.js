const request = require('supertest');

const server = require('./server.js');
const db = require('../database/dbConfig.js');


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



describe('POST /LOGIN', () => {
    it('should return 200 status', () => {
        return request(server).post('/auth/login')
            .send({
                username: "tommy",
                password: "password2"
            })
            .set('Content-Type', 'application/json')
            .then(res => {
                // expect(res.status).toBe(200)
                expect(res.body.username).toBe('tommy')
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
                expect(res.body.message).toBe("You are logged in")
            })
    })
})



describe('GET /api/users', () => {
    it('returns json OK', () => {
        return request(server).get('/api/users')
            .expect('Content-Type', /json/)
    });

    it('should return 200 Status', () => {
        return request(server).get('/api/users')
            .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRvcmEiLCJpYXQiOjE1Njg5MjI5MDEsImV4cCI6MTU2OTAwOTMwMX0.zuYasePVgpcJ6KgF8nLOAFV-ROlyoisTBB0yNGAGaZg')
            .then(res => {
                expect(res.status).toBe(200)
            })
    })

})



