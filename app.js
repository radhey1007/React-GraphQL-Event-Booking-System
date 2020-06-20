const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');         // midleware
const graphQlSchema  = require('./graphql/schema/index');
const graphQlResolver  = require('./graphql/resolver/index');

const app = express();
require('dotenv').config();

const mongoose = require('mongoose');

app.use(bodyParser.json());

app.use('/graphql', graphQlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolver,
    graphiql: true
}));


app.get('/', (req, res, next) => {
    res.send('Hello Radhey , Keep doing learning...')
})

const connectionString = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@eventdb-fsi18.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`;

mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(response => {
        app.listen(3000);
        console.log('DB Connected...');
    }).catch(err => {
        console.error(err)
    });