import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from "uuid";

// Scalar Types
//  String, Boolean, Int, Float, ID

// Demo user data
const users = [
	{
		id: "101",
		name: "Matt",
		email: "matt@email.com",
		age: 39,
	},
	{
		id: "102",
		name: "Sarah",
		email: "sarah@email.com",
	},
	{
		id: "103",
		name: "Chris",
		email: "chris@email.com",
		age: 38,
	},
];

const posts = [
	{
		id: "201",
		title: "My first post",
		body: "Abcde",
		published: true,
		author: "101",
	},
	{
		id: "202",
		title: "My second post",
		body: "fghij",
		published: false,
		author: "102",
	},
	{
		id: "203",
		title: "My third post",
		body: "klmno",
		published: true,
		author: "101",
	},
	{
		id: "204",
		title: "My fourth post",
		body: "pqrst",
		published: false,
		author: "102",
	},
	{
		id: "205",
		title: "My fifth post",
		body: "uvwxy",
		published: true,
		author: "101",
	},
];

const comments = [
	{
		id: "301",
		text: "Comment number one",
		author: "101",
		post: "202",
	},
	{
		id: "302",
		text: "The second comment",
		author: "102",
		post: "203",
	},
	{
		id: "303",
		text: "Third comment goes here",
		author: "103",
		post: "204",
	},
	{
		id: "304",
		text: "This is the fourth comment",
		author: "101",
		post: "201",
	},
];

// Type defs (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    createComment(text: String!, author: ID!, post: ID!): Comment!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }

`;

// Resolvers
const resolvers = {
	Query: {
		users(parent, args, context, info) {
			if (!args.query) {
				return users;
			}

			return users.filter((user) => {
				return user.name.toLowerCase().includes(args.query.toLowerCase());
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
		posts(parent, args, context, info) {
			if (!args.query) {
				return posts;
			}

			return posts.filter((post) => {
				return (
					post.title.toLowerCase().includes(args.query.toLowerCase()) ||
					post.body.toLowerCase().includes(args.query.toLowerCase())
				);
			});
		},
		comments(parent, args, context, info) {
			return comments;
		},
	},
	Mutation: {
		createUser(parent, { name, email, age }, context, info) {
			const emailTaken = users.some((user) => user.email === email);

			if (emailTaken) {
				throw new Error(
					"Emaill address provided is already in use by an existing user account."
				);
			}

			const user = {
				id: uuidv4(),
				name,
				email,
				age,
			};

			users.push(user);

			return user;
		},
		createPost(parent, { title, body, published, author }, context, info) {
			const userExists = users.some((user) => user.id === author);

			if (!userExists) {
				throw new Error("User not found.");
			}

			const post = {
				id: uuidv4(),
				title,
				body,
				published,
				author,
			};

			posts.push(post);

			return post;
		},
		createComment(parent, args, context, info) {
      console.log(args)
      const userExists = users.some((user) => user.id === args.author)
      const postExists = posts.some((post) => {
        return post.id === args.post && post.published
      })

      if(!userExists) {
        throw new Error(
          "User not found."
        )
      }

      if(!postExists) {
        throw new Error(
          "Post does not exist."
        )
      }
      

      const comment = {
        id: uuidv4(),
        text: args.text,
        author: args.author,
        post: args.post
      }

      comments.push(comment)

      return comment
		},
	},
	Post: {
		author(parent, args, context, info) {
			return users.find((user) => user.id === parent.author);
		},
		comments(parent, args, context, info) {
			return comments.filter((comment) => comment.post === parent.id);
		},
	},
	User: {
		posts(parent, args, context, info) {
			return posts.filter((post) => post.author === parent.id);
		},
		comments(parent, args, context, info) {
			return comments.filter((comment) => comment.author === parent.id);
		},
	},
	Comment: {
		author(parent, args, context, info) {
			return users.find((user) => user.id === parent.author);
		},
		post(parent, args, context, info) {
			return posts.find((post) => post.id === parent.post);
		},
	},
};

const server = new GraphQLServer({
	typeDefs,
	resolvers,
});

server.start(() => {
	console.log("The server is running at localhost:4000");
});
