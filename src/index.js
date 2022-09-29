import { GraphQLServer } from "graphql-yoga";

// Scalar Types
//  String, Boolean, Int, Float, ID

// Demo user data
const users = [
  {
    id: 1,
    name: "Matt",
    email: "matt@email.com",
    age: 39
  },
  {
    id: 2,
    name: "Sarah",
    email: "sarah@email.com",
  },
  {
    id: 3,
    name: "Chris",
    email: "chris@email.com",
    age: 38
  },
]

const posts = [
	{
		id: 1,
		title: "My first post",
		body: "Abcde",
		published: true,
		author: 1,
	},
	{
		id: 2,
		title: "My second post",
		body: "fghij",
		published: false,
		author: 2,
	},
	{
		id: 3,
		title: "My third post",
		body: "klmno",
		published: true,
		author: 1,
	},
	{
		id: 4,
		title: "My fourth post",
		body: "pqrst",
		published: false,
		author: 2,
	},
	{
		id: 5,
		title: "My fifth post",
		body: "uvwxy",
		published: true,
		author: 1,
	},
];

// Type defs (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    me: User!
    post: Post!
    posts(query:String): [Post!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }

`;

// Resolvers
const resolvers = {
	Query: {
    users(parent, args, context, info) {
      if (!args.query) {
        return users
      }

      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
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
        return posts
      }

      return posts.filter((post) => {
        return (
					post.title.toLowerCase().includes(args.query.toLowerCase()) ||
					post.body.toLowerCase().includes(args.query.toLowerCase())
				);
      })
    }
	},
  Post: {
    author(parent, args, context, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    }
  }
};

const server = new GraphQLServer({
	typeDefs,
	resolvers,
});

server.start(() => {
	console.log("The server is running at localhost:4000");
});
