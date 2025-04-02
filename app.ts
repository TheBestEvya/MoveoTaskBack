import express, { Express } from 'express';
import https from "https"
import fs from "fs"
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors'
import connectDB from './db';
dotenv.config();
const port = process.env.PORT;
const app = express();
connectDB();
//socket io


//certificates for https

app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173'],
    credentials: true,
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//images?
app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));
//production route - serve html files from react
app.use(express.static(path.resolve(__dirname , '..' , '../front')))

//error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'error handling activated - please check:' +err.message });
  });

//Routes



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});