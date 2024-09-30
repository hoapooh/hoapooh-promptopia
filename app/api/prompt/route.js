import { connectToDB } from '@utils/database'
import Prompt from '@models/prompt'

export const GET = async (req) => {
	try {
		await connectToDB()

		// The empty object {} inside find() is a query filter. Since it's empty, it means "find all documents."
		// populate() is a Mongoose method used to replace a referenced field (in this case, creator) with the actual document from the related collection.
		// The populate('creator') method replaces the creator field (which is likely just an ID in the Prompt document) with the full User document (or whatever collection creator refers to).

		// Tức là 'creator' ở đây là cầu nối với collection User vì 'creator' giống như 1 Foreign key tạo nên 1-many relationship với collection User
		const prompts = await Prompt.find({}).populate('creator')

		return new Response(JSON.stringify(prompts), { status: 200 })
	} catch (error) {
		return new Response('Failed to fetch all prompts', { status: 500 })
	}
}
