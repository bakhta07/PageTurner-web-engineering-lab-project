const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Book = require("./models/book");
const User = require("./models/user");
const Category = require("./models/category");
const connectDB = require("./config/db");

dotenv.config();
connectDB();



const seedDB = async () => {
    try {
        await Book.deleteMany();
        await Category.deleteMany();
        await User.deleteMany();
        console.log("Cleared Data...");

        // 0. Create Admin User
        const adminUser = await User.create({
            name: "Admin User",
            email: "admin@pageturner.com",
            password: await require("bcryptjs").hash("admin123", 10),
            role: "admin"
        });
        console.log("Admin User Created: admin@pageturner.com / admin123");
        console.log("Cleared Data...");

        // 1. Create Categories
        const categoriesData = [
            { name: "Drama", description: "Emotional and compelling stories." },
            { name: "Thriller", description: "Suspenseful and exciting." },
            { name: "Mystery", description: "Intriguing puzzles and crimes." },
            { name: "Self-Help", description: "Personal improvement and growth." }
        ];
        const createdCategories = await Category.insertMany(categoriesData);

        // Helper to get ID
        const getCatId = (name) => createdCategories.find(c => c.name === name)._id;

        // 2. Create Books with Category IDs
        const books = [
            {
                title: "The Housemaid",
                author: "Freida McFadden",
                category: [getCatId("Drama")], // Linked!
                price: 15,
                description: "Every day I clean the Winchesters' beautiful house top to bottom. I collect their daughter from school. And I cook a delicious meal for the whole family before heading up to my tiny room in the attic. I try to ignore how Nina makes a mess just to watch me clean it up. How she tells strange lies about her own daughter. And how her husband Andrew seems more broken every day. But as I look into Andrew's handsome brown eyes, so full of pain, it's hard not to imagine what it would be like to live Nina's life. The walk-in closet, the fancy car, the perfect husband.",
                imageURL: "https://online.fliphtml5.com/tyfxm/ncmu/files/large/1f108c2d27b378a4180f1eacb18e699c.webp?1735473688",
                rating: 4.5,
                numReviews: 120,
                stock: 50
            },
            {
                title: "The Locked Door",
                author: "Freida McFadden",
                category: [getCatId("Thriller")],
                price: 18,
                description: "Some doors are locked for a reason. While eleven-year-old Nora Davis was up in her bedroom doing homework, she had no idea her father was killing women in the basement. Until the day the police arrived at their front door. Decades later, Nora's father is spending his life behind bars, and Nora is a successful surgeon with a quiet, solitary existence. Nobody knows her father was a notorious serial killer. And she intends to keep it that way. Then Nora discovers one of her young female patients has been murdered.",
                imageURL: "https://static.wixstatic.com/media/f67928_57c942e2d5cb420faba870e39921b1ec~mv2.jpg/v1/fill/w_438,h_700,al_c,lg_1,q_80,enc_avif,quality_auto/f67928_57c942e2d5cb420faba870e39921b1ec~mv2.jpg",
                rating: 4.2,
                numReviews: 85,
                stock: 40
            },
            {
                title: "A Good Girl's Guide to Murder",
                author: "Holly Jackson",
                category: [getCatId("Mystery")],
                price: 20,
                description: "The case is closed. Five years ago, schoolgirl Andie Bell was murdered by Sal Singh. The police know he did it. Everyone in town knows he did it. But having grown up in the same small town that was consumed by the murder, Pippa Fitz-Amobi isn't so sure. When she chooses the case as the topic for her final year project, she starts to uncover secrets that someone in town desperately wants to stay hidden. And if the real killer is still out there, how far will they go to keep Pip from the truth?",
                imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbHmJbWmwW3y264y5uGxapjSxJ81smwBfiKw&s",
                rating: 4.8,
                numReviews: 250,
                stock: 100
            },
            {
                title: "Good Girl, Bad Blood",
                author: "Holly Jackson",
                category: getCatId("Mystery"),
                price: 22,
                description: "Pip is not a detective anymore. With the help of Ravi Singh, she released a true-crime podcast about the murder case they solved together last year. The podcast has gone viral, yet Pip insists her investigating days are behind her. But she will have to break that promise when someone she knows goes missing. Jamie Reynolds has disappeared, on the very night the town hosted a memorial for the sixth-year anniversary of the deaths of Andie Bell and Sal Singh.",
                imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmwzJhK2b0BcKI5RcHufR68C9r8H31j9ng0A&s",
                rating: 4.7,
                numReviews: 180,
                stock: 60
            },
            {
                title: "Atomic Habits",
                author: "James Clear",
                category: [getCatId("Self-Help")],
                price: 16,
                description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results. If you're having trouble changing your habits, the problem isn't you. The problem is your system. Bad habits repeat themselves again and again not because you don't want to change, but because you have the wrong system for change.",
                imageURL: "https://m.media-amazon.com/images/I/81F90H7hnML._AC_UF1000,1000_QL80_.jpg",
                rating: 4.9,
                numReviews: 5000,
                stock: 200
            }
        ];

        await Book.insertMany(books);
        console.log("Data Imported!");

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedDB();
