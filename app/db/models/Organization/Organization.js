import { Schema } from 'mongoose';
import db from '../../db';

const OrganizationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectID,
    ref: 'User',
  },
});

const Organization = db.model('Organization', OrganizationSchema);

export default Organization;
