const { buildSchema } = require('graphql');

module.exports = buildSchema(`        
         type Event {
             _id : ID!
             title:String!
             description:String!
             price :Float!
             date:String!
             creator:User!
         }
 
         type User {
             _id :ID!
             email:String!
             password:String
            createdEvent:[Event!]    
        }

         input UserInput {
            email:String!
            password:String
         }

         input EventInput {
            title:String!
            description:String!
            price :Float!
            date:String!
         }
        
        type RootQuery {
            events:[Event!]!
        }     
        type RootMuation {
            createEvent(eventInput:EventInput):Event
            createUser(userInput:UserInput):User
        }       
        schema {
            query:RootQuery
            mutation:RootMuation
        }
        `);