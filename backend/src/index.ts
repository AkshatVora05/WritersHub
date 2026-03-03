import { Hono } from 'hono';
import authRoutes from './routes/authRoutes';
import blogRoutes from './routes/blogRoutes';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', cors({
    origin: [
        "https://writers-hub-new.vercel.app"
    ],
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"]
}))

//Auth routes
app.route('/api/v1/user', authRoutes);

//Blog routes
app.route('/api/v1/blog', blogRoutes);

export default app;