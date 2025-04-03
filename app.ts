import express, { Express } from 'express';
import https from "https"
import http from "http"
import fs from "fs"
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors'
import connectDB from './db';
import codeBlockRoutes from './src/routes/codeBlockRoutes';
import { io } from './socket'; // Import the io instance from socket.ts

dotenv.config();
const port = process.env.PORT;
const app = express();
connectDB();
const env = process.env.NODE_ENV;
let server: any;



//certificates for https
if(env !== 'development') {
const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH || ''),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH || '')
  };
  
    server = https.createServer(options, app);
}else{
    server = http.createServer(app);
}


io.attach(server);

app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173'],
    credentials: true,
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//images?
app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));
//production route - serve html files from react
// app.use(express.static(path.resolve(__dirname , '..' , '../front')))

//error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'error handling activated - please check:' +err.message });
  });

//Routes

app.use('/api/codeBlocks', codeBlockRoutes);
app.use( (req,res)=>{
    // res.sendFile(path.resolve(__dirname , '..' , '../front/index.html'))
    res.status(404).json({ message: 'Route not found' });
  })
server.listen(port, () => {
    console.log(`Server is running on port ${port} -   ${env}`);
});

export { app, server, port };
