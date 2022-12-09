import { Prisma } from "prisma-binding";

const prisma = new Prisma({
	typeDefs: "src/generated/prisma.graphql",
	endpoint: "http://localhost:4466",
  secret: "demostring"
});

export { prisma as default }

// prisma.query
// prisma.mutation
// prisma.subscription
// prisma.exists

// prisma.exists
// 	.Comment({
// 		id: "304",
// 	})
// 	.then((exists) => {
// 		console.log(exists);
// 	});

// const createPostForUser = async (authorId, data) => {
// 	const userExists = await prisma.exists.User({
// 		id: authorId,
// 	});

// 	if (!userExists) {
// 		throw new Error("User Not Found");
// 	}

// 	const post = await prisma.mutation.createPost(
// 		{
// 			data: {
// 				...data,
// 				author: {
// 					connect: {
// 						id: authorId,
// 					},
// 				},
// 			},
// 		},
// 		"{ author { name email posts{ id title published } } }"
// 	);

// 	return post.author;
// };

// createPostForUser("cla9x5ep401h00f60nfzxav20", {
// 	title: "Great books to read",
// 	body: " The War of Art",
// 	published: true,
// })
// 	.then((user) => {
// 		console.log(JSON.stringify(user, undefined, 2));
// 	})
// 	.catch((error) => {
// 		console.log(error.message);
// 	});

// const updatePostForUser = async (postId, data) => {
// 	const postExists = await prisma.exists.Post({
// 		id: postId,
// 	});

// 	if (!postExists) {
// 		throw new Error("Post not found");
// 	}

// 	const post = await prisma.mutation.updatePost(
// 		{
// 			data: {
// 				...data,
// 			},
// 			where: {
// 				id: postId,
// 			},
// 		},
// 		"{ author {name email posts{ id title published } } }"
// 	);

// 	return post;
// };

// updatePostForUser("clag03ac2000z0f595sj2math", {
// 	title: "Updated title5",
// 	body: "Updated Body5",
// 	published: true,
// })
// 	.then((user) => console.log(JSON.stringify(user, undefined, 2)))
// 	.catch((error) => console.log(error.message));
