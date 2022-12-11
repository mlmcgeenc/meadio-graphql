import { PubSub } from "graphql-yoga";
import getUserId from "../utilities/getUserId";

const Subscription = {
	comment: {
		subscribe(parent, { postId }, { prisma }, info) {
			return prisma.subscription.comment(
				{
					where: {
						node: {
							post: {
								id: postId,
							},
						},
					},
				},
				info
			);
		},
	},
	post: {
		subscribe(parent, { published }, { prisma }, info) {
			return prisma.subscription.post(
				{
					where: {
						node: {
							published: true,
						},
					},
				},
				info
			);
		},
	},
	myPost: {
		subscribe(parent, args, { prisma, request }, info) {
			const userId = getUserId(request);

			if (!userId) {
				throw new Error("Unable to get posts");
			}

			return prisma.subscription.post(
				{
					where: {
						node: {
							author: {
								id: userId,
							},
						},
					},
				},
				info
			);
		},
	},
};

export { Subscription as default };
