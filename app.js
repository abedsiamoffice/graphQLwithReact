const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const graphHttp = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose');
const Event = require("./models/event");
const User = require("./models/user");
const bcrypt = require('bcrypt');


app.use(bodyParser.json());
// app.get('/', (req,res ,next)=> {
//     res.send("Hello!!");
// });

app.use('/graphql', graphHttp({
    schema: buildSchema( `
        type Event{
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        type User{
            _id: ID!
            email: String!
            password: String
        }
        type RootQuery{
            events: [Event!]!
        }
        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        input UserInput{
            _id: ID!
            email: String!
            password: String!
        }
        type RootMutation{
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema{
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: ()=> {
            return Event
             .find()
             .then(events => {
                return events.map(event => {
                    return {...event._doc, _id: event.id};
                });
             })
             .catch(err => {
                 throw err;
             });
        },
        createEvent: (args)=> {
            // mutation{
            //   createEvent(eventInput: {title: "title",description: "description", price: 9.99, date:"Tue Dec 17 2019 11:25:57 GMT+0600"}){
            //     title
            //   }
            // }
            // {
            //     events{
            //       _id
            //       title
            //       description
            //       price
            //       date
            //     }
            //   }
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            // console.log(event);
            return event
            .save()
            .then(result => {
                console.log(result);
                return {...result._doc};
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
            
        },
        
        createUser: (args)=> {
            User.findOne({email: args.userInput.email})
                .then( user => {
                if(user){
                    throw new Error('User Exists');
                }
                return bcrypt.hash(args.userInput.password, 12);
                })
                .then(hashedPassword=>{
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword    
                    });
                    return user.save();
                })
                .then(result => {
                    return {...result._doc,password: null, _id: result.id};
                })
                .catch(err => {
                    throw err;
                });
            
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@multisiam-pugea.mongodb.net/${process.env.MONGO_DB}`, 
{useNewUrlParser:  true, useUnifiedTopology: true})
.then(()=> {
    app.listen(4200, console.log("server running 4200"));
}).catch(err => {
    console.log(err);
})




