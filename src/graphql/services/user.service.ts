import { PrismaClient } from "@prisma/client";
import { extractSelection } from "@src/utils/graphQLExtractSelections";
import { GraphQLResolveInfo } from "graphql";

interface GetUsersArgs {
  info: GraphQLResolveInfo;
}

interface GetUserArgs extends GetUsersArgs {
  id: string;
}

interface UserInput {
  email: string;
  username?: string;
}

const prisma = new PrismaClient();

const getUsers = async ({ info }: GetUsersArgs) => {
  const extractSelections = extractSelection(info);
  const postIncluded = extractSelections.includes("posts");

  if (postIncluded) {
    return await prisma.user.findMany({ include: { posts: true } });
  }

  return await prisma.user.findMany();
};

const getUser = async ({ id, info }: GetUserArgs) => {
  const extractSelections = extractSelection(info);
  const postIncluded = extractSelections.includes("posts");

  if (postIncluded) {
    return await prisma.user.findUnique({
      where: { id },
      include: { posts: true },
    });
  }

  return await prisma.user.findUnique({ where: { id } });
};

const createUser = async ({ email, username }: UserInput) => {
  console.log({ email, username });

  const createdUser = await prisma.user.create({
    data: {
      email,
      username,
    },
  });

  return createdUser;
};

export { getUsers, getUser, createUser };
