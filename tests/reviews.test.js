const { handler } = require('../netlify/functions/reviews')

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
                _id: expect.any(String)
            })
        })
    })
    afterAll(async () => {
        await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
    });
})