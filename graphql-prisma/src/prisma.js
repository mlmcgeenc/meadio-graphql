import { Prisma } from "prisma-binding";

const prisma = new Prisma({
	typeDefs: "src/generated/prisma.graphql",
	endpoint: "http://localhost:4466",
});

// prisma.query
// prisma.mutation
// prisma.subscription
// prisma.exists

// prisma.query
// 	.users(
// 		null,
// 		"{ id name email posts { id title comments { id author { name } text } } }"
// 	)
// 	.then((data) => {
// 		console.log(JSON.stringify(data, undefined, 2));
// 	});

// prisma.query.comments(null, '{ id text author { id name } }').then((data) => {
//   console.log(JSON.stringify(data,undefined, 2 ))
// })

// prisma.mutation
// 	.createPost(
// 		{
// 			data: {
// 				title: "This is a second post from NODE",
// 				body: "This post was created from a prisma.mutation call within NODE. It will be created each time the app gets run. The post is written by Kate.",
// 				published: true,
// 				author: {
// 					connect: {
// 						id: "cla9x93vv01ho0f60zukgyrqg",
// 					},
// 				},
// 			},
// 		},
// 		"{ id title body published }"
// 	)
// 	.then((data) => {
// 		console.log(data);
// 		return prisma.query.users(null, "{ id name email posts { id title } }");
// 	}).then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
//   })

prisma.mutation
	.updatePost(
		{
			data: {
				published: true,
			},
			where: {
				id: "claa17dxq02a60f60sibi0jkz",
			},
		},
		"{ id title body published }"
	)
	.then((data) => {
		console.log(data);
		return prisma.query.posts(null, "{ id title body published }");
	})
	.then((data) => {
		console.log(JSON.stringify(data, undefined, 2));
	});
