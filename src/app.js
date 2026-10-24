
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>My First Website</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    background: #f0f4f8;
                    padding-top: 100px;
                }

                h1 {
                    color: #2563eb;
                }

                button {
                    padding: 12px 20px;
                    background: #2563eb;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <h1>Welcome to My Website!</h1>
            <p>This website is running with Node.js and Express.</p>
            <button onclick="alert('Hello! Your website works!')">
                Click Me
            </button>
        </body>
        </html>
    `);
});

module.exports = app;

