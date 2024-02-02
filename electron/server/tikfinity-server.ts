/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */

// const express = require('express');

import express, { type Express, type Request, type Response} from "express";

const expressPort = 8832;

const expressApp = express();

let server: any;

console.log('tikfinity-server.cjs loaded');

function start() {
    console.log('Starting express server...');

    expressApp.get('/api/sample', (req: Request, res: Response) => {
        res.json({ message: 'Hello from Express!' });
    });
    
    server = expressApp.listen(expressPort, () => {
        console.log(`Express server is running on http://localhost:${expressPort}`);
    });
}

function stop() {
    server.close();
}

module.exports = {
    start,
    expressApp,
    stop,
};