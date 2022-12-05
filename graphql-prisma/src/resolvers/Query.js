const Query = {
		users(parent, args, { db, prisma }, info) {
      return prisma.query.users(null, info)

      // second arg can have nothing, string, object

			// if (!args.query) {
			// 	return db.users;
			// }

			// return db.users.filter((user) => {
			// 	return db.user.name.toLowerCase().includes(args.query.toLowerCase());
			// });
		},
		me() {
			return {
				id: "123098",
				name: "Mike",
				email: "mike@example.com",
				age: 28,
			};
		},
		post() {
			return {
				id: "1230987",
				title: "Post Title",
				body: "Post Body Text Goes here",
				published: true,
			};
		},
		posts(parent, args, { db, prisma }, info) {
      return prisma.query.posts(null, info)

			// if (!args.query) {
			// 	return db.posts;
			// }

			// return db.posts.filter((post) => {
			// 	return (
			// 		post.title.toLowerCase().includes(args.query.toLowerCase()) ||
			// 		post.body.toLowerCase().includes(args.query.toLowerCase())
			// 	);
			// });
		},
		comments(parent, args, { db }, info) {
			return db.comments;
		},
	}

export { Query as default }