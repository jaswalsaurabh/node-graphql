const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const { default: axios } = require("axios");

const PORT = 4000;
async function startServer() {
  try {
    const app = express();
    const server = new ApolloServer({
      typeDefs: `

      type User {
      id: ID!
      name: String!
      username: String!
      email: String!
      phone: String!
      website: String!
      }

      type Todo {
      id: ID!
      title: String!
      completed: Boolean
      user: User
      }

      type Query {
      getTodos: [Todo]
      getAllUsers: [User]
      getUser(id:ID!): User
      }

      `,
      resolvers: {
        Todo: {
          user: async (todo) =>
            (
              await axios.get(
                "https://jsonplaceholder.typicode.com/users/" + todo.userId
              )
            ).data,
        },
        Query: {
          getTodos: async () =>
            (await axios.get("https://jsonplaceholder.typicode.com/todos"))
              .data,
          getAllUsers: async () =>
            (await axios.get("https://jsonplaceholder.typicode.com/users"))
              .data,
          getUser: async (parent, { id }) =>
            (
              await axios.get(
                "https://jsonplaceholder.typicode.com/users/" + id
              )
            ).data,
        },
      },
    });
    app.use(cors());
    app.use(express.json());

    await server.start();
    app.use("/graphql", expressMiddleware(server));

    app.listen(PORT, () => {
      console.log("server is started at port", PORT);
    });
  } catch (error) {
    console.log("error ", error);
    return error;
  }
}

startServer();

// const app = express();

// app.use(express.json());
// app.use(cors());
// app.use(router);

// const PORT = 4000;

// app.listen(PORT, async () => {
//   console.log("server is started at port", PORT);
// });
