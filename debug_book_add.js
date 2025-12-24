const API_URL = 'https://pageturner-app.vercel.app/api';

async function runDebug() {
    console.log("1. Logging in as Admin...");
    try {
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: "admin@pageturner.com", password: "admin123" })
        });

        const loginData = await loginRes.json();
        if (!loginRes.ok) {
            console.error("Login Failed:", loginData);
            return;
        }

        console.log("Login Success!");

        console.log("\n2. Fetching Books (Page 1)...");
        const listRes = await fetch(`${API_URL}/books?page=1&limit=100`);
        const listData = await listRes.json();

        console.log(`Total Books in DB: ${listData.count}`);
        console.log("--- BOOK LIST ---");
        listData.books.forEach(b => console.log(`- [${b._id}] ${b.title} (${b.author})`));
        console.log("-----------------");

    } catch (err) {
        console.error("Script Error:", err);
    }
}

runDebug();
