import user from "../fixtures/user.json";
import {faker} from '@faker-js/faker';

let post =   {
    "userId": 79,
    "title": faker.lorem.words(4),
    "body": faker.lorem.paragraph(2)
}

describe('Test', () => {

//first task 
    it('Get all posts', () => {
        cy.request('GET', '/posts').then(response => {
            expect(response.status).to.be.eq(200);
            expect(response.headers['content-type']).to.be.eq('application/json; charset=utf-8');
        })
    })
//second task
    it('Get only first 10 posts', () => {
        cy.request('GET', '/posts?_limit=10').then(response => {
            expect(response.status).to.be.eq(200);
            expect(response.body.length).to.be.eq(10);
        })
    })

// third task
    it('receive id=27 and id=32 on GET', () => {
        cy.request('GET', '/posts?id=27&id=32').then(response => {
            expect(response.status).to.be.eq(200);
            const post_ids = [];

            response.body.forEach(post => {
                post_ids.push(post.id)
            })
            expect(post_ids[0]).to.be.eq(27);
            expect(post_ids[1]).to.be.eq(32);
        })
    })
//
    it('Create post by method POST', () => {
        cy.request({
            method: 'POST',
            url: 'posts',
            body: post,
        }).then(response => {
            expect(response.status).to.be.eq(201);
            expect(response.body.userId).to.be.eq(post.userId);
            expect(response.body.title).to.be.eq(post.title);
            expect(response.body.body).to.be.eq(post.body);
        })
    })
//
    it('Delete non-existing post entity', () => {
        cy.request({
            method: 'PATCH',
            url: 'posts/300',
            body: post,
            failOnStatusCode: false
        }).then(response => {
            expect(response.status).to.be.eq(404);
        })
    })
//
    it('create a post via POST + UPDATE', function() {
        let postId;
        cy.request({
            method: 'POST',
            url: 'posts',
            body: post,
        }).then(response => {
            expect(response.status).to.be.eq(201);
            postId = response.body.id;
            expect(response.body.userId).to.be.eq(post.userId);
            expect(response.body.title).to.be.eq(post.title);
            expect(response.body.body).to.be.eq(post.body);
        }).then(()=> {
            cy.request({
                method: 'PATCH',
                url: `posts/${postId}`,
                body: {
                    "title": 'title_updated'
                },
            }).then(response => {
                expect(response.status).to.be.eq(200);
                expect(response.body.title).to.be.eq('title_updated')
            })
        })
    })
//
    it('Delete non-existing post entity', () => {
        cy.request({
            method: 'DELETE',
            url: 'posts/300',
            body: post,
            failOnStatusCode: false
        }).then(response => {
            expect(response.status).to.be.eq(404);
        })
    })
//tenth task
    it('Create post entity, update the created entity, and delete the entity', function() {
        let postId;
        cy.request({
            method: 'POST',
            url: 'posts',
            body: post,
        }).then(response => {
            expect(response.status).to.be.eq(201);
            postId = response.body.id;
            expect(response.body.userId).to.be.eq(post.userId);
            expect(response.body.title).to.be.eq(post.title);
            expect(response.body.body).to.be.eq(post.body);
        }).then(()=> {
            cy.request({
                method: 'PATCH',
                url: `posts/${postId}`,
                body: {
                    "title": 'title_updated'
                },
            }).then(response => {
                expect(response.status).to.be.eq(200);
                expect(response.body.title).to.be.eq('title_updated')
            })
        }).then(()=> {
            cy.request({
                method: 'DELETE',
                url: `posts/${postId}`,
            }).then(response => {
                expect(response.status).to.be.eq(200);
            })
        }).then(()=> {
            cy.request({
                method: 'GET',
                url: `posts/${postId}`,
                failOnStatusCode: false
            }).then(response => {
                expect(response.status).to.be.eq(404);
            })
        })
    })
})