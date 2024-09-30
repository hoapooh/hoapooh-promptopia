import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import User from '@models/user'
import { connectToDB } from '@utils/database'

// Every NextJS route is known as Serverless -> It is a Lamda function that opens up only when it get call --> spin up the server and make connection to database

// NOTE: THIS IS THE DEFAULT SESSION OBJECT PROVIDED BY NEXTAUTH.JS
// NOTE: THAT IS THE REASON WHY WHEN CREATE A NEW USER, WE GET 3 FIELD THAT IS name, image and email

// export interface DefaultSession extends Record<string, unknown> {
//   user?: {
//     name?: string | null
//     email?: string | null
//     image?: string | null
//   }
//   expires?: string
// }

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	callbacks: {
		async session({ session }) {
			const sessionUser = await User.findOne({
				email: session.user.email,
			})

			session.user.id = sessionUser._id.toString()

			return session
		},
		async signIn({ profile }) {
			try {
				await connectToDB()

				// Check if a user already exists
				const userExists = await User.findOne({
					email: profile.email,
				})
				// If not, create a new user and save to db
				if (!userExists) {
					await User.create({
						email: profile.email,
						username: profile.name.replace(' ', '').toLowerCase(),
						image: profile.picture,
					})
				}

				return true
			} catch (error) {
				console.error(error)
				return false
			}
		},
	},
})

export { handler as GET, handler as POST }
