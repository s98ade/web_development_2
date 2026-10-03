const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types for different file extensions
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json'
};

// Create HTTP server
const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    try {
        // Create a /api/time endpoint that returns current date/time as JSON
        
        if (req.url === '/api/time' && req.method === 'GET') {
            const currentDateTime = new Date().toISOString();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                datetime: currentDateTime,
                timestamp: Date.now()
            }));
            return;
        }
       

        // Routing to HTML files
        let filePath;
        if (req.url === '/') {
            // Home page
            filePath = path.join(PUBLIC_DIR, 'index.html');
        } else if (req.url === '/about') {
            filePath = path.join(PUBLIC_DIR, 'about.html');
        } else if (req.url === '/contact') {
            filePath = path.join(PUBLIC_DIR, 'contact.html');
        // Route to styles sheet
        } else if (req.url.startsWith('/styles/')) {
            filePath = path.join(PUBLIC_DIR, req.url);
            // Security: Prevent path traversal attacks (../ in URL)
            const normalizedPath = path.normalize(filePath);
            if (!normalizedPath.startsWith(PUBLIC_DIR)) {
                handle404(res);
                return;
            }
        } else {
            // No route matched -> 404
            handle404(res);
            return;
        }
        // Step 1: Get the file extension (e.g., '.html', '.css')
        const extname = path.extname(filePath);
        
        // Step 2: Get the content type from MIME_TYPES object
        const contentType = MIME_TYPES[extname] || 'text/html';

        // Step 3: Read the file
        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // File not found
                    handle404(res);
                } else {
                    // Server error
                    handleServerError(res, err);
                }
            } else {
                // Set status to 200 and tells what kind of file it gets back
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });

    } catch (error) {
        // Catch any unexpected errors
        handleServerError(res, error);
    }
});

// Function to handle 404 errors (Page Not Found)
function handle404(res) {
    const notFoundPath = path.join(PUBLIC_DIR, '404.html');
    fs.readFile(notFoundPath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 - Page Not Found');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
   
}

// Function to handle 500 errors (Server Error)
function handleServerError(res, error) {
    console.error(error);

    const serverErrorPath = path.join(PUBLIC_DIR, '500.html');
    
    fs.readFile(serverErrorPath, (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 - Internal Server Error');
        } else {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8')
        }
    });
}


server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
