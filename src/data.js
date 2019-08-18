const users = [
    {
        id: 1,
        name: "Гена",
        surname: "Букин",
        city: "Екатеринбург",
        age: 40,
        status: "Сделал хеттрик в финале турнира кожанный мяч",
        isOnline: false,
        friends: [2,3],
        groups: [1,2],
        imgId: 1,
        posts: [1,2],
        messageListId: [1,2],
        friendsRequests: [4,5,6]
    },
    {
        id: 2,
        name: "Анатолий",
        surname: "Полено",
        city: "Екатеринбург",
        age: 35,
        status: "Лена, не бей",
        isOnline: false,
        friends: [1],
        groups: [1,2],
        imgId: 2,
        posts: [],
        messageListId: [1],
        friendsRequests: []
    },
    {
        id: 3,
        name: "Роман",
        surname: "Букин",
        city: "Екатеринбург",
        age: 15,
        status: "гранд мастер",
        isOnline: false,
        friends: [1,2,4],
        groups: [1,2],
        imgId: 3,
        posts: [],
        messageListId: [],
        friendsRequests: []
    },
    {
        id: 4,
        name: "Даша",
        surname: "Букина",
        city: "Екатеринбург",
        age: 38,
        status: "",
        isOnline: false,
        imgId:  4,
        friends: [2,3,5],
        groups: [2],
        posts: [],
        messageListId: [2],
        friendsRequests: []
    },
    {
        id: 5,
        name: "Станислава",
        surname: "Вяхирева",
        city: "Москва",
        age: 18,
        status: "",
        isOnline: false,
        imgId:  7,
        friends: [4],
        groups: [1],
        posts: [],
        messageListId: [],
        friendsRequests: []
    },
    {
        id: 6,
        name: "Кирон",
        surname: "Колесников",
        city: "San-andreas",
        age: 20,
        status: "",
        isOnline: false,
        imgId:  8,
        friends: [],
        groups: [1,2],
        posts: [],
        messageListId: [],
        friendsRequests: []
    }
        
];

const posts = [
    {
        id: 1,
        date: "24.03.2019",
        author: 1,
        text: "Всем привет, я зерегестрировался!!!"
    },
    {
        id: 2,
        date: "24.03.2019",
        author: 2,
        text: "Ура, Гена, наконецто нам теперь не придется общаться по рации"
    }
]

const groups = [
    {
        id: 1,
        name: "группа",
        imgId: 5,
        users: [1,2,3,6]
    },
    {
        id: 2,
        name: "подслушано екб",
        imgId: 6,
        users: [1,2,3,4,6]
    }
]

const images = [
    {
        id:1,
        src: "https://vokrug.tv/pic/person/4/8/8/8/48887a7b2347a53c0c01db1caf339464.jpeg"
    },
    {
        id:2,
        src: "https://i.ytimg.com/vi/MhpcZHryauw/maxresdefault.jpg"
    },
    {
        id:3,
        src: "https://i1.sndcdn.com/artworks-000359427951-rm0ajq-t500x500.jpg"
    },
    {
        id:4,
        src: "https://vokrug.tv/pic/person/6/a/f/5/6af59342e10545202452ef0c1eb5cbab.jpeg"
    },
    {
        id:5,
        src: "https://memepedia.ru/wp-content/uploads/2019/02/bez-bab-mem-25.jpg"
    },
    {
        id:6,
        src: "https://a.d-cd.net/6f9da08s-960.jpg"
    },
    {
        id:7,
        src: "https://pp.userapi.com/c851236/v851236844/16ebb4/8ZMMKEtVtZQ.jpg"
    },
    {
        id: 8,
        src: "https://pp.userapi.com/c857436/v857436781/f928/FS2gf4wxyY4.jpg"
    }
]

const messagesList = [
    {
        id: 1,
        users: [1,2],
        messages: [1,2,3,4,5]
    },
    {
        id: 2,
        users: [1,4],
        messages: [6,7]
    }
]

const messages = [
    {
        id: 1,
        author: 2,
        text: "Гена привет это я толик, добавь в други",
        date: "26.04.2019"
    },
    {
        id: 2,
        author: 2,
        text: "ГЕЕЕНА не молчи добавь меня",
        date: "27.04.2019"
    },
    {
        id: 3,
        author: 2,
        text: "я вижу ты онлайн не молчи!",
        date: "27.04.2019"
    },
    {
        id: 4,
        author: 2,
        text: "у меня есть пиво",
        date: "28.04.2019"
    },
    {
        id: 5,
        author: 1,
        text: "через 3 минуты буду",
        date: "28.04.2019"
    },
    {
        id: 6,
        author: 1,
        text: "Даша я в больнице, возможно скоро умру",
        date: "29.04.2019"
    },
    {
        id: 7,
        author: 4,
        text: "Хорошо, только вынеси мусор",
        date: "29.04.2019"
    }
]

const createId = target => {

    return target[target.length-1].id + 1;

}

const getCompanion = id => {
    return messagesList.find( messageList => messageList.id == id ).companionId;
}

const setOnline = (id, isOnline)=> {

    const selectedUser = users.find( user => user.id == id );
    selectedUser.isOnline = isOnline;
    return {
        code: 1
    }

}

const createMessageList = (user1, user2)=> {
    const newMessageListId = createId(messagesList);
    const selectedUser1 = findById(user1, users).messageListId;
    const selectedUser2 = findById(user2, users).messageListId;

    const newMessageListItem = {
        id: newMessageListId,
        users: [user1, user2],
        messages: []
    }

    messagesList.push(newMessageListItem);
    selectedUser1.push(newMessageListId);
    selectedUser2.push(newMessageListId);

    return newMessageListId;
}

const checkForMessageList = (userId, companionId)=> {
    const selectedUser = findById(userId, users).messageListId;
    const selectedCompanion = findById(companionId, users).messageListId;
    return selectedUser.find( messageListId => selectedCompanion.find( id => id == messageListId) );
}

const checkForFriends = (userId, companionId)=> {
    const selectedUser = findById(userId, users);


    if( selectedUser.friends.includes(Number(companionId)) ){
        return 1;
    }                                       

    if ( selectedUser.friendsRequests.includes(Number(companionId))){
        return 0;
    }
    
    return 2;
}

const addMessage = messageData=> {
    const { authorId, chatId, date, text } = messageData;
    const selectedChatList = messagesList.find( messageList => messageList.id == chatId );
    const messageId = createId(messages);
    const message = { 
        id: messageId,
        author: authorId,
        text,
        date
    }
    messages.push(message);
    selectedChatList.messages.push(messageId);
}

const addToFriends = (id1, id2)=> {
    const user1 = findById(id1, users);
    const user2 = findById(id2, users);

    const user1RequestsIndex = user1.friendsRequests.indexOf(id2);
    const user2RequestsIndex = user2.friendsRequests.indexOf(id1);

    if ( user1RequestsIndex != -1){
        user1.friendsRequests.splice(user1RequestsIndex,1);
    }
    if ( user2RequestsIndex != -1){
        user2.friendsRequests.splice(user2RequestsIndex,1);
    }
    
    user1.friends.push(Number(id2));
    user2.friends.push(Number(id1));

    return true;
}

const removeFriend = (id1, id2)=> {


    const user1 = findById(id1, users);
    const user2 = findById(id2, users);

    const user1friendIndex = user1.friends.indexOf(Number(id2));
    const user2friendIndex = user2.friends.indexOf(Number(id1));
    

    if ( user1friendIndex != -1){
        console.log("user - ")
        user1.friends.splice(user1friendIndex,1);
    }
    if ( user2friendIndex != -1){
        console.log("user - ")
        user2.friends.splice(user2friendIndex,1);
    }

    return true;

}

const sendRequest = (id1, id2)=> {

    const user1 = findById(id1, users);

    if( !user1.friendsRequests.includes(id2) ){
        user1.friendsRequests.push(id2);
        return true;
    }

    return false;

}

const cancelRequest = (id1, id2) => {

    const user1 = findById(id1, users);

    const index = user1.friendsRequests.indexOf(id2);

    if( index != -1 ){
        user1.friendsRequests.splice(index, 1);
        return true;
    }
    return false;

}

const findById = (id, targets)=> {
    return targets.find( target => target.id == id );
}

exports.data = {
    users,
    posts,
    images,
    groups,
    messages,
    messagesList,
    setOnline,
    addMessage,
    getCompanion,
    checkForMessageList,
    createMessageList,
    checkForFriends,
    addToFriends,
    sendRequest,
    cancelRequest,
    removeFriend,
    findById
}
