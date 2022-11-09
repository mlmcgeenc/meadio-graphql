const Query = {
		users(parent, args, { db }, info) {
			if (!args.query) {
				return db.users;
			}

			return db.users.filter((user) => {
				return db.user.name.toLowerCase().includes(args.query.toLowerCase());
			});
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
		posts(parent, args, { db }, info) {
			if (!args.query) {
				return db.posts;
			}

			return db.posts.filter((post) => {
				return (
					post.title.toLowerCase().includes(args.query.toLowerCase()) ||
					post.body.toLowerCase().includes(args.query.toLowerCase())
				);
			});
		},
		comments(parent, args, { db }, info) {
			return db.comments;
		},
	}

export { Query as default }