import { config } from "dotenv-safe";
import express, { json, urlencoded } from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { Logger } from "./utils/logger";

class Server {
  private app: express.Application;
  private port: string | number;
  private apolloServer!: ApolloServer;

  logger = Logger.getInstance();

  constructor(port: string | number) {
    config();
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeRoutes();

    this.startApolloServer();
  }

  private async startApolloServer() {
    const typeDefs = `#graphql
        type Book {
          title: String
          author: String
        }
  
        type Query {
          books: [Book]
        }
      `;

    const books = [
      {
        title: "The Awakening",
        author: "Kate Chopin",
      },
      {
        title: "City of Glass",
        author: "Paul Auster",
      },
      {
        title: "The Awakening",
        author: "Kate Chopin",
      },
      {
        title: "City of Glass",
        author: "Paul Auster",
      },
    ];

    const resolvers = {
      Query: {
        books: () => books,
      },
    };

    // Initialize Apollo Server
    this.apolloServer = new ApolloServer({ typeDefs, resolvers });

    await this.apolloServer.start();
    this.app.use(
      "/graphql",
      cors<cors.CorsRequest>(),
      express.json(),
      expressMiddleware(this.apolloServer)
    );
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    // this.app.use("/", (req, res) => {
    //   res.send("hossein");
    // });
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      this.logger.info(`🚀 Server is running on port ${this.port}`);
    });
  }
}

const PORT = process.env.APP_PORT ?? 5000;

const server = new Server(PORT);
server.listen();
