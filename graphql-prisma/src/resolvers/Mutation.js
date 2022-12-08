import { v4 as uuidv4 } from "uuid";

const Mutation = {
	async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email })

		if (emailTaken) {
			throw new Error(
				"Emaill address provided is already in use by an existing user account."
			);
		}

    const user = await prisma.mutation.createUser({ data: args.data }, info)

		return user;
	},
	async updateUser(parent, args, { prisma }, info) {
    return prisma.mutation.updateUser({
      where: {
        id: args.id
      },
      data: args.data
    }, info)
	},
	async deleteUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.id })

    if (!userExists) {
      throw new Error("No user with that id found")
    }

    const user = await prisma.mutation.deleteUser({ where: { id: args.id } } , info)

    return user
	},
	async createPost(parent, args, { prisma }, info) {
    return prisma.mutation.createPost({ 
      data: {
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author: {
          connect: {
            id: args.data.author
          }
        }
      }
    }, info)
	},
	async updatePost(parent, { id, data }, { prisma }, info) {
    return await prisma.mutation.updatePost({
      where: {
        id: id
      },
      data: data
    }, info)
	},
	async deletePost(parent, args, { prisma }, info) {
    return await prisma.mutation.deletePost({ where: { id: args.id } }, info)
	},
	async createComment(parent, args, { prisma }, info) {
    return await prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author: {
          connect: {
            id: args.data.author
          }
        },
        post: {
          connect: {
            id: args.data.post
          }
        }
      }
    }, info)
	},
	async updateComment(parent, { id, data }, { prisma }, info) {
    return await prisma.mutation.updateComment({
      where: {
        id: id
      },
      data: data
    }, info)
	},
	async deleteComment(parent, args, { prisma }, info) {
		return await prisma.mutation.deleteComment({
      where: {
        id: args.id
      }
    })
	},
};

export { Mutation as default };
