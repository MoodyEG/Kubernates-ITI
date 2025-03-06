import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import postRouter from './routes/post.routes.js';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/post', postRouter);

const port = process.env.PORT || 5124;
const host = process.env.HOST || 'http://localhost';

const server = app.listen(
  port,
  console.log(`Server running at ${host}:${port}/`)
);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('createPost', (data) => {
    io.emit('postCreated', data);
  });

  socket.on('deletePost', (data) => {
    io.emit('postDeleted', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

export default app;
