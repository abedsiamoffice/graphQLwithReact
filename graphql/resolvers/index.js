const Event = require("../../models/event");
const User = require("../../models/user");
const bcrypt = require('bcrypt');

//with promise
// const events = eventIds => {
// 	return Event.find({ _id: { $in: eventIds } })
// 		.then(events => {
// 			return events.map(event => {
// 				return {
// 					...event._doc,
//                     _id: event.id,
//                     date: new Date(event._doc.date).toISOString(),
// 					creator: user.bind(this, event.creator)
// 				}
// 			})
// 		})
// 		.catch(err => {
// 			throw err;
// 		})
// }

//with Async Await
const events = async eventIds => {
    try{
        const events = await Event.find({ _id: { $in: eventIds } });
		events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            };
        });
        return events;
    }
    catch (err) {
	    throw err;
	}
}

//with promise
// const user = userId => {
// 	return User.findById(userId)
// 		.then(user => {
// 			return {
// 				...user._doc,
// 				_id: user.id,
// 				createdEvents: events.bind(this, user._doc.createdEvents)
// 			}
// 		})
// 		.catch(err => {
// 			throw err;
// 		})
// }


//with async 

const user = async userId => {
    try{
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    }
    catch(err) {
		throw err;
	}
};

//promise
// module.exports =  {
//     events: ()=> {
//         return Event.find()
//         .populate('creator')
//          .then(events => {
//             return events.map(event => {
//                 return {...event._doc, 
//                     _id: event.id, 
//                     date: new Date(event._doc.date).toISOString(),
//                     creator: user.bind(this, event._doc.creator)};
//             });
//          })
//          .catch(err => {
//              throw err;
//          });
//     },
//     createEvent: (args)=> {
//         // mutation{
//         //   createEvent(eventInput: {title: "title",description: "description", price: 9.99, date:"Tue Dec 17 2019 11:25:57 GMT+0600"}){
//         //     title
//         //   }
//         // }
//         // {
//         //     events{
//         //       _id
//         //       title
//         //       description
//         //       price
//         //       date
//         //     }
//         //   }
//         // mutation{
//         //     createUser(userInput: {email: "siamabeddfhg3@gmail.com", password: "siam33"}){
//         //       email
//         //       password
//         //     }
//         //   }
//         const event = new Event({
//             title: args.eventInput.title,
//             description: args.eventInput.description,
//             price: args.eventInput.price,
//             date: new Date(args.eventInput.date),
//             creator: '5df9afb00b578b29e0894d72'
//         });
//         // console.log(event);
//         let CEvents;
//         return event
//         .save()
//         .then(result =>{
//             CEvents = {...result._doc,
//                 _id: result._doc._id.toString(),
//                  date: new Date(event._doc.date).toISOString(),
//                   creator: user.bind(this, result._doc.creator)}
//             return User.findById('5df9afb00b578b29e0894d72');
//         })
//         .then(user=> {
//             if(!user){
//                 throw new Error('User not found!');
//             }
//             user.createdEvents.push(event);
//             return user.save();
//         })
//         .then(result => {

//             console.log(result);
//             return CEvents;
//         })
//         .catch(err => {
//             console.log(err);
//             throw err;
//         });
        
//     },

//     createUser: (args)=> {
//         return User.findOne({email: args.userInput.email})
//             .then( user => {
//                 if(user){
//                     throw new Error('User Exists');
//                 }
//                 return bcrypt.hash(args.userInput.password, 12);
//             })
//             .then(hashedPassword=>{
//                 const user = new User({
//                     email: args.userInput.email,
//                     password: hashedPassword    
//                 });
//                 return user.save();
//             })
//             .then(result => {
//                 console.log("sfasf");
//                 return {...result._doc,password: null};
//             })
//             .catch(err => {
//                 throw err;
//             });
        
//     }
// };



module.exports = {
    events: async () => {
      try {
        const events = await Event.find();
        return events.map(event => {
          return {
            ...event._doc,
            _id: event.id,
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, event._doc.creator)
          };
        });
      } catch (err) {
        throw err;
      }
    },
    createEvent: async args => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: '5c0fbd06c816781c518e4f3e'
      });
      let createdEvent;
      try {
        const result = await event.save();
        createdEvent = {
          ...result._doc,
          _id: result._doc._id.toString(),
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, result._doc.creator)
        };
        const creator = await User.findById('5c0fbd06c816781c518e4f3e');
  
        if (!creator) {
          throw new Error('User not found.');
        }
        creator.createdEvents.push(event);
        await creator.save();
  
        return createdEvent;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    createUser: async args => {
      try {
        const existingUser = await User.findOne({ email: args.userInput.email });
        if (existingUser) {
          throw new Error('User exists already.');
        }
        const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
  
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword
        });
  
        const result = await user.save();
  
        return { ...result._doc, password: null, _id: result.id };
      } catch (err) {
        throw err;
      }
    }
  };