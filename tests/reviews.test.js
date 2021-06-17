const { handler } = require('../netlify/functions/reviews')

const mongoDB = require('mongodb')
const uri = 'mongodb+srv://root:root@cluster0.19fcr.mongodb.net/simplex?retryWrites=true&w=majority';

describe('GET-запрос без параметров', () => {
    jest.setTimeout(20000)
    let data, body
    beforeAll(async () => {
        data = await handler({
            httpMethod: 'GET'
        })
        body = JSON.parse(data.body)
    })
    test('Возвращает код 200 и тело', () => {
        expect(data.statusCode).toBe(200)
        expect(body).toStrictEqual(expect.any(Array))
    })
    test('Возвращаемое тело содержит объекты с полями name. email, text, _id', () => {
        body.forEach(review => {
            expect(review).toStrictEqual({
                name: expect.any(String),
                email: expect.any(String),
                text: expect.any(String),
                time: expect.any(String),
                _id: expect.any(String)
            })
        })
    })
    afterAll(async () => {
        await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
    });
})

describe('POST-запрос c параметрами name, email, text', () => {
    jest.setTimeout(20000)
    let data, body
    beforeAll(async () => {
        data = await handler({
            httpMethod: 'POST',
            body: "name=Alex&email=alexgmail.com&text=Text"
        })
    })
    test('Возвращает код 301 и заголовок переадресации', () => {
        expect(data.statusCode).toBe(301)
        expect(data.headers).toHaveProperty('Location', '/reviews.html')
    })
    test('Записывает в БД объект с полями name, email, text, time', async () => {
        const client = await mongoDB.connect(
            uri,
            { useNewUrlParser: true, useUnifiedTopology: true }
        )
        const user = await client.db('simplex').collection('reviews').findOneAndDelete({
            name: 'Alex',
            email: 'alexgmail.com',
            text: 'Text'
        })
        client.close()
        expect(user.value).toBeTruthy()
        expect(user.value.time).toStrictEqual(expect.any(String))
    })
    afterAll(async () => {
        await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
    });
})