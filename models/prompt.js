import { Schema, model, models } from 'mongoose'

// 1-many relationship, 1 user can create many prompt
const promptSchema = new Schema({
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	prompt: {
		type: String,
		required: [true, 'Prompt is required.'],
	},
	tag: {
		type: String,
		required: [true, 'Tag is required.'],
	},
})

const Prompt = models.Prompt || model('Prompt', promptSchema)

export default Prompt
