const https = require('https');

const url = 'https://pageturner-app.vercel.app/api/books';

https.get(url, (res) => {
    let data = '';

    console.log('Status Code:', res.statusCode);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            if (res.statusCode === 200) {
                const json = JSON.parse(data);
                console.log('Success! API returned valid JSON.');
                console.log('Number of books:', json.books ? json.books.length : 'Unknown structure');
                if (json.books && json.books.length > 0) {
                    console.log('First Book:', json.books[0].title);
                } else {
                    console.log('Warning: No books found in array.');
                }
            } else {
                console.error('API Error Response:', data);
            }
        } catch (e) {
            console.error('Failed to parse JSON:', e.message);
            console.log('Raw Output:', data);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
