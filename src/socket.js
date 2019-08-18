const bd = require("./data");

const { setOnline, addMessage, getCompanion, createMessageList, addToFriends, sendRequest, cancelRequest, removeFriend } = bd.data;



module.exports = server=> {

    const io = require("socket.io")(server);


    io.on("connection", client=>{

        let userId = null;
        let openMessageWindowId = null;
        let openProfileId = null;
        
        let clientInProfile = null;

        client.emit("clientConnected", new Date());
    
        client.on("auth", id=> {
            userId = id;

            setOnline(userId, true);

            console.log(`user ${userId} connected`);

        })
    
        client.on("joinMessageWindow", messageWindowId=>{
            openMessageWindowId = messageWindowId;
            client.join(messageWindowId);
            console.log(`user ${userId} join ${openMessageWindowId} room`)
        })

        client.on("leaveMessageWindow", ()=>{
            console.log(`user ${userId} leave ${openMessageWindowId} room`)
            client.leave(openMessageWindowId);
            openMessageWindowId = null;
        })

        client.on("joinProfile", id=>{
            openProfileId = id;
            client.join(`profile${openProfileId}`);
            clientInProfile = true;
            console.log("join profile")
        })

        client.on("leaveProfile", ()=>{
            client.leave(`profile${openProfileId}`);
            clientInProfile = false;
            console.log("leave profile")
        })

        client.on("addMessage", messageData=>{ 
            addMessage(messageData);
            io.to(openMessageWindowId).emit("updateChat", openMessageWindowId);
        })

        client.on("createMessageList", users=>{
            const newMessageListId = createMessageList(users.user1, users.user2);
            client.emit("createMessageListResult", newMessageListId);
        })

        client.on("addToFriends", users=>{
            addToFriends(users.user1, users.user2);
        });

        client.on("sendRequest", users=> {
            const result = sendRequest(users.user1, users.user2);
            if(result && clientInProfile){
                client.emit("requestSendOk");
            }

        })

        client.on("cancelRequest", users=> {
            const result = cancelRequest(users.user1, users.user2);
            if(result && clientInProfile){
                client.emit("cancelRequestOk");
            }
        })

        client.on("removeFriend", users=> {
            const result = removeFriend(users.user1, users.user2);
            if(result && clientInProfile){
                client.emit("removeFriendOk");
            }
        })


        client.on("disconnect", ()=>{
            if( userId ){

                setOnline(userId, false);

            }
            client.leave(`profile${openProfileId}`);
            clientInProfile = false;
            client.leave(openMessageWindowId);
            console.log(`user ${userId} disconnect`);
        });
    })

}