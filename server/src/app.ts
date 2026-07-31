import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import routes from './routes'
import { ApiError } from './utils/ApiError'
import errorHandler from './middleware/error.middleware'

import path from 'path'
const app = express()

const allowedOrigins = [
  "http://localhost:5173",
  "https://expory-management-8oua.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no Origin (e.g. Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json())


app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Export Management API Running',
  })
})

app.use('/api', routes)
app.use(errorHandler);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    })
  }

  console.error(err) // log unexpected errors
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  })
})

export default app
