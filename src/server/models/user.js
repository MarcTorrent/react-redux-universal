import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Define our model
const userSchema = new Schema({
	firstName: String,
	lastName: String,
	email: {type: String, unique: true, lowercase: true}
});

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
export default ModelClass;
