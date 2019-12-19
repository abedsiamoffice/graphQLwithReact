const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const graphHttp = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
app.use(bodyParser.json());
// app.get('/', (req,res ,next)=> {
//     res.send("Hello!!");
// });
app.use(isAuth);
app.use('/graphql', graphHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}));
const URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@multisiam-pugea.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
mongoose.connect(URI, {useNewUrlParser:  true, useUnifiedTopology: true})
.then(()=> {
    app.listen(8000, console.log("server running 8000"));
}).catch(err => {
    console.log(err);
})




