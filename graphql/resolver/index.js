const bcrypt = require('bcryptjs');

const EventModel = require('../../models/event');

const UserModel = require('../../models/user');


const getUserEvents = async eventIds => {
    try {
        const events = await EventModel.find({
            _id: {
                $in: eventIds
            }
        })
        events.map(event => {
            console.log(this , 'lll')
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: getUserByID.bind(this, events.creator)
            }
        })
        return events;
    } catch (err) {        
        console.log(err);
        throw err;
    }
}


const getUserByID = async userID => {
    try {
        const userInformation = await UserModel.findById(userID)
        return {
            ...userInformation._doc,
            _id: userInformation.id,
            createdEvent: getUserEvents.bind(this, userInformation._doc.createdEvents)
        }
    } catch (err) {
        console.log('No record found' + err);
        throw err;
    }
}

module.exports = {
    events: async () => {
        const result = await EventModel.find().populate('creator')
        try {
            return result.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    // creator: {
                    //     ...event.creator._doc,
                    //     _id: event.creator.id
                    // }   

                    //or method using function
                    date: new Date(event._doc.date).toISOString(),
                    creator: getUserByID.bind(this, event.creator._doc)

                };
            })
        } catch (err) {
            console.error(err + 'in posting data');
            throw err;
        }
    },
    createEvent: async (args) => {
        const event = new EventModel({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5ec0e2f4442dc34450f131d6'
        });
        let createdEvent;
        try {
            const result = await event.save()
            createdEvent = {
                ...result._doc,
                _id: result._doc._id.toString(),
                date: new Date(event._doc.date).toISOString(),
                creator: getUserByID.bind(this, result._doc.creator)
            };
            const user = await UserModel.findById('5ec0e2f4442dc34450f131d6')
            if (!user) {
                throw new Error(`User not found.`)
            } else {
                user.createdEvents.push(event); // here we updating the user table createdEventColumn 
                await user.save();
            }
            return createdEvent;
        } catch (err) {
            console.error(err + 'in posting data');
            throw err;
        }
    },

    createUser: async (args) => {        
       try {
        const existingUser = await UserModel.findOne({
            email: args.userInput.email
        })
        if (existingUser) {
            throw new Error(`This email ${args.userInput.email} is already exist.`)
        } else {
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new UserModel({
                email: args.userInput.email,
                password: hashedPassword
            })
            const userResult = await user.save()
            console.log('user added')
            return {
                ...userResult._doc
            }
        }
       } catch(err) {
            console.log('err in craeting user ...' + err);
            throw err;    
       }
    }
}