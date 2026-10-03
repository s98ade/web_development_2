const express = require('express');
const path = require('path');

// ========================================
// TODO: Task 1 - Create Express App
// ========================================
const app = express();

const PORT = process.env.PORT || 3000;

// ========================================
// TODO: Task 2 - Serve Static Files
// ========================================
app.use(express.static('public'));

// ========================================
// TODO: Task 3 - Add Route Handlers
// ========================================
// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// About page route
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// Contact page route
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});


// ========================================
// TODO: Task 4 - Create API Endpoint
// ========================================
app.get('/api/time', (req, res) => {
    res.json({
        datetime: new Date().toISOString(),
        timestamp: Date.now()
    });
});


// ========================================
// TODO: Task 5 - Error Handling Middleware
// ========================================
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.use((req, res) => {
    console.log("Server error.");
    res.status(500).sendFile(path.join(__dirname, 'public', '500.html'));
});


// ========================================
// Start the Server
// ========================================
// TODO: Uncomment the code below to start the server:

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log('\n📍 Available routes:');
    console.log('  GET /              -> Home page');
    console.log('  GET /about         -> About page');
    console.log('  GET /contact       -> Contact page');
    console.log('  GET /api/time      -> Current date/time API');
    console.log('\n⏹️  Press Ctrl+C to stop the server\n');
});


// ========================================
// 🎯 IMPLEMENTATION TIPS
// ========================================
/*
1. Complete tasks in order (Task 1 → Task 6)
2. Uncomment code sections as you work through each task
3. Test each task before moving to the next one
4. Remember: Middleware order matters!
   - Static files first
   - Route handlers second
   - 404 handler third
   - Error handler last

5. Key Express Methods:
   - app.use() → Apply middleware
   - app.get() → Define GET routes
   - res.sendFile() → Send HTML files
   - res.json() → Send JSON responses
   - res.status() → Set HTTP status code

6. Don't forget to:
   - Run 'npm install' before starting
   - Check the console for helpful error messages
   - Test in the browser after each task
*/