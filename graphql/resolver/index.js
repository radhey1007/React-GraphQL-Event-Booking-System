const bcrypt = require('bcryptjs');

const EventModel = require('../../models/event');

const UserModel = require('../../models/user');


const getUserEvents = (eventIds) => {
    return EventModel.find({
            _id: {
                $in: eventIds
            }
        })
        .then(events => {
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    date:new Date(event._doc.date).toISOString(),
                    creator: getUserByID.bind(this, events.creator)
                }
            })
        })
        .catch(err => {
            throw err;
        })
}


const getUserByID = (userID) => {
    return UserModel.findById(userID)
        .then(userInformation => {
            return {
                ...userInformation._doc,
                _id: userInformation.id,
                createdEvents: getUserEvents.bind(this, userInformation._doc.createdEvents)
            }
        }).catch(err => {
            console.log('No record found' + err);
            throw err;
        })

}

module.exports = {
    events: () => {
        return EventModel.find().populate('creator')
            .then(result => {
                return result.map(event => {
                    console.log(event._doc.date);
                    return {
                        ...event._doc,
                        _id: event.id,
                        // creator: {
                        //     ...event.creator._doc,
                        //     _id: event.creator.id
                        // }   

                        //or method using function 
                        
                        date:new Date(event._doc.date).toISOString(),
                        creator: getUserByID.bind(this, event.creator._doc)

                    };
                })
            }).catch(err => {
                console.error(err + 'in posting data');
                throw err;
            })
    },
    createEvent: (args) => {
        const event = new EventModel({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5ec0e2f4442dc34450f131d6'
        });
        let createdEvent;
        return event.save().then(result => {
            console.log(result , 'savve')
                createdEvent = {
                    ...result._doc,
                    _id: result._doc._id.toString(),
                    date:new Date(event._doc.date).toISOString(),
                    creator:getUserByID.bind(this, result._doc.creator)
                };
                return UserModel.findById('5ec0e2f4442dc34450f131d6')
                    .then(user => {
                        if (!user) {
                            throw new Error(`User not found.`)
                        } else {
                            user.createdEvents.push(event); // here we updating the user table createdEventColumn 
                            return user.save();
                        }
                    })
            })
            .then(result => {
                return createdEvent;
            })
            .catch(err => {
                console.error(err + 'in posting data');
                throw err;
            })
    },

    createUser: (args) => {

        return UserModel.findOne({
            email: args.userInput.email
        }).then(user => {
            if (user) {
                throw new Error(`This email ${args.userInput.email} is already exist.`)
            } else {
                return bcrypt.hash(args.userInput.password, 12)
                    .then(hashedPassword => {
                        const user = new UserModel({
                            email: args.userInput.email,
                            password: hashedPassword
                        })
                        return user.save().then(userResult => {
                            console.log('user added')
                            return {
                                ...userResult._doc
                            }
                        }).catch(err => {
                            console.log(err + 'in adding user');
                            throw err;
                        })
                    })
                    .catch(err => {
                        throw err;
                    })
            }
        })
    }
}