import getUserId from "../utilities/getUserId";

const User = {
	email: {
		fragment: "fragment userId on User { id }",
		resolve(parent, args, { request }, info) {
			const userId = getUserId(request, false);

			if (userId && userId === parent.id) {
				return parent.email;
			} else {
				return null;
			}
		},
	},
	posts: {
		fragment: "fragment userId on User { id }",
		resolve(parent, args, { prisma }, info) {
      return prisma.query.posts({
        where: {
          published: true,
          author: {
            id: parent.id
          }
        }
      })

			// if (userId && userId === parent.id) {
			// 	return prisma.query.posts({
			// 		where: {
			// 			AND: [
			// 				{
			// 					author: {
			// 						id: userId,
			// 					},
			// 				},
			// 				{
			// 					published: true,
			// 				},
			// 			],
			// 		},
			// 	});
			// } else {
			// 	return null;
			// }
		},
	},
};

export { User as default };
