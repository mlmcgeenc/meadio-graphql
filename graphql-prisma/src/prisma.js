import { Prisma } from "prisma-binding";

const prisma = new Prisma({
	typeDefs: "src/generated/prisma.graphql",
	endpoint: "http://localhost:4466",
});

// prisma.query
// prisma.mutation
// prisma.subscription
// prisma.exists

const createPostForUser = async (authorId, data) => {
	const post = await prisma.mutation.createPost(
		{
			data: {
				...data,
				author: {
					connect: {
						id: authorId,
					},
				},
			},
		},
		"{ id }"
	);
	const user = await prisma.query.user(
		{
			where: {
				id: authorId,
			},
		},
		"{ id name email posts{ id title published } }"
	);

	return user;
};

// createPostForUser("cla9x5ep401h00f60nfzxav20", {
//   title: "Great books to read",
//   body: "The War of Art",
//   published: true
// }).then((user) => console.log(JSON.stringify(user, undefined, 2)));

const updatePostForUser = async (postId, data) => {
	const post = await prisma.mutation.updatePost(
		{
			data: {
				...data,
			},
			where: {
				id: postId,
			},
		},
		"{ author { id } }"
	);
	const user = await prisma.query.user(
		{
			where: {
				id: post.author.id,
			},
		},
		"{id name email posts{ id title published } }"
	);

	return user;
};

updatePostForUser("cla9xkprz01me0f609ofrxpds", {
	title: "Updated title5",
	body: "Updated Body5",
	published: true,
}).then((user) => console.log(JSON.stringify(user, undefined, 2)));

// prisma.mutation
// 	.updatePost(
// 		{
// 			data: {
// 				published: true,
// 			},
// 			where: {
// 				id: "claa17dxq02a60f60sibi0jkz",
// 			},
// 		},
// 		"{ id title body published }"
// 	)
// 	.then((data) => {
// 		console.log(data);
// 		return prisma.query.posts(null, "{ id title body published }");
// 	})
// 	.then((data) => {
// 		console.log(JSON.stringify(data, undefined, 2));
// 	});
