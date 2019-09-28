import { Schema } from 'mongoose';
import UserClass from './UserClass';
import db from '../../db';

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  discriminator: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

UserSchema.loadClass(UserClass);

const User = db.model('User', UserSchema);

export default User;