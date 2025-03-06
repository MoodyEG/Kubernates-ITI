import { model, Schema } from 'mongoose';

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Post = model('Post', postSchema);

export default Post;
