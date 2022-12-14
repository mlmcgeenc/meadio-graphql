import { v4 as uuidv4 } from "uuid";

const Mutation = {
	createUser(parent, args, { db }, info) {
		const emailTaken = db.users.some((user) => user.email === args.data.email);

		if (emailTaken) {
			throw new Error(
				"Emaill address provided is already in use by an existing user account."
			);
		}

		const user = {
			id: uuidv4(),
			...args.data,
		};

		db.users.push(user);

		return user;
	},
	updateUser(parent, { id, data }, { db }, info) {
		const user = db.users.find((user) => user.id === id);
		if (!user) {
			throw new Error("User not found");
		}

		if (typeof data.email === "string") {
			const emailTaken = db.users.some((user) => user.email === data.email);
			if (emailTaken) {
				throw new Error("Email already in use");
			}

			user.email = data.email;
		}

		if (typeof data.name === "string") {
			user.name = data.name;
		}

		if (typeof data.age !== "undefined") {
			user.age = data.age;
		}

		return user;
	},
	deleteUser(parent, args, { db }, info) {
		const userIndex = db.users.findIndex((user) => user.id === args.id);

		if (userIndex === -1) {
			throw new Error("User not found");
		}

		const deletedUsers = db.users.splice(userIndex, 1);

		db.posts = posts.filter((post) => {
			const match = post.author === args.id;

			if (match) {
				db.comments = db.comments.filter((comment) => comment.post !== post.id);
			}

			return !match;
		});

		db.comments = db.comments.filter((comment) => comment.author !== args.id);

		return deletedUsers[0];
	},
	createPost(parent, args, { db, pubsub }, info) {
		const userExists = db.users.some((user) => user.id === args.data.author);

		if (!userExists) {
			throw new Error("User not found.");
		}

		const post = {
			id: uuidv4(),
			...args.data,
		};

		db.posts.push(post);
		if (args.data.published) {
			pubsub.publish(`post`, {
				post: {
					mutation: "CREATED",
					data: post,
				},
			});
		}

		return post;
	},
	updatePost(parent, { id, data }, { db, pubsub }, info) {
		const post = db.posts.find((post) => post.id === id);
		const originalPost = { ...post }; // object spread operator to clone post object

		if (!post) {
			throw new Error("Post not found");
		}

		console.log(data);
		if (typeof data.title === "string") {
			post.title = data.title;
		}

		if (typeof data.body === "string") {
			post.body = data.body;
		}

		if (typeof data.published === "boolean") {
			post.published = data.published;

			if (originalPost.published && !post.published) {
				pubsub.publish("post", {
					post: {
						mutation: "DELETED",
						data: originalPost,
					},
				});
			} else if (!originalPost.published && post.published) {
				pubsub.publish("post", {
					post: {
						mutation: "CREATED",
						data: post,
					},
				});
			}
		} else if (post.published) {
			pubsub.publish("post", {
				post: {
					mutation: "UPDATED",
					data: post,
				},
			});
		}

		if (typeof data.author === "string") {
			post.author = data.author;
		}

		return post;
	},
	deletePost(parent, args, { db, pubsub }, info) {
		const postIndex = db.posts.findIndex((post) => post.id === args.id);

		if (postIndex === -1) {
			throw new Error("Post not found");
		}

		db.comments = db.comments.filter((comment) => comment.post !== args.id);

		const [post] = db.posts.splice(postIndex, 1); // destructured the post array. this was previously deletedPost[0] when used in later calls

		if (post.published) {
			pubsub.publish("post", {
				post: {
					mutation: "DELETED",
					data: post,
				},
			});
		}

		return post;
	},
	createComment(parent, args, { db, pubsub }, info) {
		const userExists = db.users.some((user) => user.id === args.data.author);
		const postExists = db.posts.some((post) => {
			return post.id === args.data.post && post.published;
		});

		if (!userExists || !postExists) {
			throw new Error("User or post not found.");
		}

		const comment = {
			id: uuidv4(),
			...args.data,
		};

		db.comments.push(comment);
		pubsub.publish(`comment ${comment.post}`, {
			comment: {
				mutation: "CREATED",
				data: comment,
			},
		});

		return comment;
	},
	updateComment(parent, { id, data }, { db, pubsub }, info) {
		const comment = db.comments.find((comment) => comment.id === id);
		if (!comment) {
			throw new Error("Comment not found");
		}

		if (typeof data.text === "string") {
			comment.text = data.text;
		}

		if (typeof data.author === "string") {
			comment.author = data.author;
		}

		if (typeof data.post === "string") {
			comment.post = data.post;
		}

		pubsub.publish(`comment ${comment.post}`, {
			comment: {
				mutation: "UPDATE",
				data: comment,
			},
		});

		return comment;
	},
	deleteComment(parent, args, { db, pubsub }, info) {
		const commentIndex = db.comments.findIndex((comment) => comment.id === args.id);

		if (commentIndex === -1) {
			throw new Error("Comment not found.");
		}

		const [deletedComment] = db.comments.splice(commentIndex, 1);

		pubsub.publish(`comment ${deletedComment.post}`, {
			comment: {
				mutation: "DELETED",
				data: deletedComment,
			},
		});

		return deletedComment;
	},
};

export { Mutation as default };
