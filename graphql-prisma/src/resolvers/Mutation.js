import getUserId from "../utilities/getUserId";
import bcrypt from "bcryptjs";
import generateToken from "../utilities/generateToken"
import hashPassword from "../utilities/hashPassword";

// jwt.sign({payload}, 'secret')
// jwt.sign({ id: 46 }, 'mysecret')
// payload = userId
// secret = env

// jwt.verify(token, 'secret')

// const isMatch = await bcrypt.compare(password, hashedpassword)
// returns a boolean

const Mutation = {
	async createUser(parent, args, { prisma }, info) {
		const password = await hashPassword(args.data.password)
		const user = await prisma.mutation.createUser({
			data: {
				...args.data,
				password,
			},
		});

		return {
			user,
			token: generateToken(user)
		};
	},
	async loginUser(parent, args, { prisma }, info) {
		const user = await prisma.query.user({
			where: {
				email: args.data.email,
			},
		});

		if (!user) {
			throw new Error("Email or password entered incorrectly");
		}

		const passwordValid = await bcrypt.compare(args.data.password, user.password);

		if (!passwordValid) {
			throw new Error("Email or password entered incorrectly");
		}

		return {
			user,
			token: generateToken(user)
		};
	},
	async updateUser(parent, args, { prisma, request }, info) {
		const userId = getUserId(request);

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password)
    }

		return prisma.mutation.updateUser(
			{
				where: {
					id: userId,
				},
				data: args.data,
			},
			info
		);
	},
	async deleteUser(parent, args, { prisma, request }, info) {
		const userId = getUserId(request);

		return prisma.mutation.deleteUser(
			{
				where: {
					id: userId,
				},
			},
			info
		);

		// const userExists = await prisma.exists.User({ userId });
		// if (!userExists) {
		// 	throw new Error("No user with that id found");
		// }
		// const user = await prisma.mutation.deleteUser({ where: userId }, info);
		// return user;
	},
	async createPost(parent, args, { prisma, request }, info) {
		const userId = getUserId(request);

		return prisma.mutation.createPost(
			{
				data: {
					title: args.data.title,
					body: args.data.body,
					published: args.data.published,
					author: {
						connect: {
							id: userId,
						},
					},
				},
			},
			info
		);
	},
	async updatePost(parent, args, { prisma, request }, info) {
		const userId = getUserId(request);
		const postExists = await prisma.exists.Post({
			id: args.id,
			author: {
				id: userId,
			},
		});

    const postIsPublished = await prisma.exists.Post({ id: args.id, published: true });

		if (!postExists) {
			throw new Error("Unable to edit post");
		}

    if (postIsPublished && args.data.published === false) {
      await prisma.mutation.deleteManyComments({ where: { post: { id: args.id } } })
    }

		return prisma.mutation.updatePost(
			{
				where: {
					id: args.id,
				},
				data: args.data,
			},
			info
		);
	},
	async deletePost(parent, args, { prisma, request }, info) {
		const userId = getUserId(request);

		const postExists = await prisma.exists.Post({
			id: args.id,
			author: {
				id: userId,
			},
		});

		if (!postExists) {
			throw new Error("Unable to delete post");
		}

		return prisma.mutation.deletePost(
			{
				where: {
					id: args.id,
				},
			},
			info
		);
	},
	async createComment(parent, args, { prisma, request }, info) {
		const userId = getUserId(request);
		const postExists = await prisma.exists.Post({
			id: args.data.post,
			published: true,
		});

		if (!postExists) {
			throw new Error("Unable to comment on the selected post");
		}

		return prisma.mutation.createComment(
			{
				data: {
					text: args.data.text,
					author: {
						connect: {
							id: userId,
						},
					},
					post: {
						connect: {
							id: args.data.post,
						},
					},
				},
			},
			info
		);
	},
	async updateComment(parent, args, { prisma, request }, info) {
		const userId = getUserId(request);

		const commentExists = await prisma.exists.Comment({
			id: args.id,
			author: {
				id: userId,
			},
		});

		if (!commentExists) {
			throw new Error("Unable to edit comment");
		}

		return await prisma.mutation.updateComment(
			{
				where: {
					id: args.id,
				},
				data: args.data,
			},
			info
		);
	},
	async deleteComment(parent, args, { prisma, request }, info) {
		const userId = getUserId(request);

		const commentExists = await prisma.exists.Comment({
			id: args.id,
			author: {
				id: userId,
			},
		});

		if (!commentExists) {
			throw new Error("Unable to delete comment");
		}

		return prisma.mutation.deleteComment(
			{
				where: {
					id: args.id,
				},
			},
			info
		);
	},
};

export { Mutation as default };
