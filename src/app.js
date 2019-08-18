const app = require("express")();
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const cors = require("cors");
const server = require("http").createServer(app);




const PORT = 3005;


app.use(cors());

app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}));

app.get("/", (req, res)=>{
    res.send("hello world");
});

require("./socket")(server);

server.listen(PORT, error=> {
    error ? console.log(error) : console.log("server started");
})