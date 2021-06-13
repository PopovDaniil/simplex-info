const mongoDB = require('mongodb')
const uri = 'mongodb+srv://root:root@cluster0.19fcr.mongodb.net/simplex?retryWrites=true&w=majority';

exports.handler = async function (event, context) {
    const client = await mongoDB.connect(
        uri,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    const db = client.db('simplex')
    const reviews = db.collection('reviews')

    try {
    switch (event.httpMethod) {
        case 'GET':
            const allReviews = await reviews.find().toArray();
            return {
                statusCode: 200,
                body: JSON.stringify(allReviews)
            }
        case 'POST':
            const { name, email, text } = JSON.parse(event.body)
            console.log(name, email, text);
            if (!(name && email && text))
                return {
                    statusCode: 500,
                    body: 'Body must contain fields: name, email, text'
                }
            const review = { name, email, text }
            const status = await reviews.insertOne(review)
            return {
                statusCode: 200,
                body: JSON.stringify(status.insertedId)
            }
        default:
            return {
                statusCode: 501,
                body: "Unknown method"
            }
        }
    } finally {
        client.close()
    }
}