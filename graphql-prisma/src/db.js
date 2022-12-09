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
  {
    id: "206",
    title: "My sixth post",
    body: "abcd",
    author: "101"
  }
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

const db = {
	users,
	posts,
	comments,
};

export { db as default }