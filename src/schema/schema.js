

const { 
    users, images, groups, posts, messages, messagesList, 
    checkForMessageList, checkForFriends, findById } = require("../data").data;

const OK = {
    code: 1
}
const UNDEFINED_USER = {
    code: 0
}
const USER_ALREADY_IN_ACTION = {
    code: 5
}
const BAD_CHANGE_TYPE = {
    code: 2
}
const graphql = require("graphql");

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLSchema, GraphQLBoolean, GraphQLList, GraphQLInt } = graphql;

const mutationAnswer = new GraphQLObjectType({
    name: "Answer",
    fields: () => ({
        code: { type: GraphQLInt }
    })
})

const GroupType = new GraphQLObjectType({
    name: "Group",
    fields: ()=> ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        img: { 
            type: GraphQLString,
            resolve(parent, args){
                return images.find( image => image.id == parent.imgId ).src;
            }
        },
        text: { type: GraphQLString },
        users: { 
            type: new GraphQLList(UserType),
            resolve(parent, args){              
                return parent.users.map( userId => users.find( user => user.id == userId ) );
            }
        }
        
    })
})

const MessageType = new GraphQLObjectType({
    name: "Message",
    fields: ()=> ({
        id: { type: GraphQLID },
        author: { 
            type: UserType,
            resolve(parent, args){
                return users.find( user=> user.id == parent.author );
            }
        },
        text: { type: GraphQLString },
        date: { type: GraphQLString }
    })
})

const MessageListType = new GraphQLObjectType({
    name: "MessageList",
    fields: ()=> ({
        id: { type: GraphQLID },
        companion: { 
            type: UserType,
            args: { userId: { type: GraphQLID } },
            resolve(parent, args){
                const companionId = parent.users[0] == args.userId ? parent.users[1] : parent.users[0];
                return users.find( user => user.id == companionId );
            }
        },
        message: {
            type: MessageType,
            resolve(parent, args){
                return messages.slice().reverse().find( message => message.id == parent.messages[parent.messages.length - 1] );
            }
        }
    })
})

const PostType = new GraphQLObjectType({
    name: "POST",
    fields: ()=> ({
        id: { type: GraphQLID },
        date: { type: GraphQLString },
        text: { type: GraphQLString },
        author: { 
            type: UserType,
            resolve(parent, args){
                return users.find( user => user.id == parent.author );
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        surname: { type: GraphQLString },
        city: { type: GraphQLString },
        age: { type: GraphQLInt },
        status: { type: GraphQLString },
        img: { 
            type: GraphQLString,
            resolve(parent, args){
                return images.find( img=> img.id == parent.imgId ).src
            }
        },
        imgId: { type: GraphQLInt },
        friends: { 
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return parent.friends.map( friend => users.find( user => user.id == friend ) )
            }
        },
        friendsLimited: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return parent.friends.map( friend => users.find( user => user.id == friend ) ).slice(0, 6);
            }
        },
        groupsLimited: {
            type: new GraphQLList(GroupType),
            resolve(parent, args){
                return parent.groups.map( groupId => groups.find( group => group.id == groupId ) ).slice(0, 6);
            }
        },
        postsLimited: {
            type: new GraphQLList(PostType),
            resolve(parent, args){
                return parent.posts.map( postId => posts.find( post => post.id == postId ) ).slice(-6).reverse();
            }
        },
        isOnline: { type: GraphQLBoolean },
        haveMessageList: { 
            type: GraphQLID,
            args: { companionId: { type: GraphQLID } },
            resolve(parent, args){
                return checkForMessageList(parent.id, args.companionId);
            }
        },
        haveFriends: {
            type: GraphQLInt,
            args: { companionId: { type: GraphQLID } },
            resolve(parent, args){
                return checkForFriends(parent.id, args.companionId);
            }
        },
        requests: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return parent.friendsRequests.map( userId => findById(userId, users))
            }
        }
    })
})


const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addUser: {
            type: mutationAnswer,
            args: {
                name: { type: GraphQLString },
                surname: { type: GraphQLString },
                city: { type: GraphQLString },
                age: { type: GraphQLInt },
                status: { type: GraphQLString },
                isOnline: { type: GraphQLBoolean }
            },
            resolve(parent, args){
                const { name, surname, city, age, status, isOnline } = args;
                users.push({
                    id: users[users.length-1].id+1,
                    name,
                    surname,
                    city,
                    age,
                    status,
                    isOnline,
                    fields: []
                })
                return OK;
            }
        },
        deleteUser: {
            type: mutationAnswer,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args){
                let index = null;
                users.find( (user, i)=> {
                    if(user.id == args.id){
                        index = i;
                        return true;
                    }
                    return false;
                })
                if( index === 0 || index ){
                    users.splice(index,1);
                    return OK;
                }else {
                    return UNDEFINED_USER;
                }
            }
        },
        updateUser: {
            type: mutationAnswer,
            args: {  
                id: { type: GraphQLID },
                type: { type: GraphQLString },
                value: { type: GraphQLString }
            },
            resolve(parent, { id, type, value }){
                const user = users.find( user=> user.id == id );
                switch(type){
                    case "CHANGE_CITY":
                            user.city = value; return OK;
                    case "CHANGE_AGE":
                            user.age = Number(value); return OK;
                    case "CHANGE_STATUS":
                            user.status = value; return OK;
                    default:
                            return BAD_CHANGE_TYPE;
                }
            }
        },
        addFriend: {
            type: mutationAnswer,
            args: {
                id: { type: GraphQLID },
                value: { type: GraphQLID }
            },
            resolve(parent, args){
                if( !users.includes(args.friendId) ){
                    users.find( user=> user.id == args.id ).friends.push(args.value);
                    return OK;
                } else {
                    return USER_ALREADY_IN_ACTION;
                }
            }
        },
        removeFriend: {
            type: mutationAnswer,
            args: {
                id: { type: GraphQLID },
                value: { type: GraphQLID }
            },
            resolve(parent, args){
                const newFriendList = users.find(user=>user.id == args.id).friends.filter( friend => {
                    if(!friend.id == args.value){
                        return false;
                    } else {
                        return true;
                    }
                });
                users.find(user=>user.id == args.id).friends = newFriendList;
                return OK;
            }
        }
    }
})

const Query = new GraphQLObjectType({
    name: "Query",
    fields: {
        getUser: {
            type: UserType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args){
                return users.find( user=> user.id == args.id );
            }
        },
        getAllUsers: {
            type: new GraphQLList(UserType),
            resolve(){
                return users;
            }

        },
        userPosts: {
            type: new GraphQLList(PostType),
            args: {
                userId: { type: GraphQLID },
                page: { type: GraphQLInt }
            },
            resolve(parent, args){
                const selectedUser = users.find( user => user.id == args.userId );
                const selectedPosts = selectedUser.posts.map( postId => posts.find( post => post.id == postId) );
                return selectedPosts.reverse().slice( ( args.page - 1 ) * 6 , ( ( args.page - 1 ) * 6 ) + 6 );
            }
        },
        userMessageList: {
            type: new GraphQLList(MessageListType),
            args: { userId: { type: GraphQLID } },
            resolve(parent, args){
                const selectedUser = users.find( user => user.id == args.userId );
                return selectedUser.messageListId.map( messageListId => messagesList.find( messageList => messageList.id == messageListId ) ).reverse();
            }
        },
        userMessagesWithCompanion: {
            type: new GraphQLList(MessageType),
            args: { messagesId: { type: GraphQLID } },
            resolve(parent, args){
                const selectedMessages = messagesList.find( messageList => messageList.id == args.messagesId ).messages;
                return selectedMessages.map( messageId => messages.find( message => message.id == messageId ) );
            }
        }  
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
})