import { readFileSync } from "fs";
import path from "path";
import { usersResolver } from "./resolvers/user.resolver";

const getGraphqlFile = (fileName: string) => {
  return readFileSync(path.join(__dirname, `./typeDefs/${fileName}.graphql`), {
    encoding: "utf-8",
  });
};

const userTypes = getGraphqlFile("user");
const postTypes = getGraphqlFile("post");

const typeDefs = `#graphql
    ${userTypes}
    ${postTypes}
`;

const resolvers = {
  Query: {
    ...usersResolver.Query,
  },
  Mutation: {
    ...usersResolver.Mutation,
  },
};

export { typeDefs, resolvers };
