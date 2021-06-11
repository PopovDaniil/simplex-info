const mongoDB = require('mongodb')
const uri = 'mongodb+srv://root:root@cluster0.19fcr.mongodb.net/simplex?retryWrites=true&w=majority';



exports.handler = async function(event, context) {
    const client = await mongoDB.connect(uri, { useNewUrlParser: true })
    const db = client.db('simplex')

    console.log(db.collection('reviews').find());
    return {
        statusCode: 501,
        body: "Unknown method"
    }
}