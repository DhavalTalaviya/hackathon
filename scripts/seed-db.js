const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database('local.db');

const seed = () => {
    // Read JSON files
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bookings.json'), 'utf-8'));
    const calls = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/calls.json'), 'utf-8'));
    const costs = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/costs.json'), 'utf-8'));

    // Create Tables
    db.exec(`
        CREATE TABLE IF NOT EXISTS bookings (
            id TEXT PRIMARY KEY,
            title TEXT,
            date TEXT,
            time TEXT,
            status TEXT,
            customer TEXT
        );
        
        CREATE TABLE IF NOT EXISTS calls (
            id TEXT PRIMARY KEY,
            date TEXT,
            duration INTEGER,
            "from" TEXT,
            "to" TEXT,
            type TEXT
        );

        CREATE TABLE IF NOT EXISTS costs (
            id TEXT PRIMARY KEY,
            category TEXT,
            amount REAL,
            date TEXT,
            description TEXT
        );
    `);

    // Insert Data
    const insertBooking = db.prepare('INSERT OR REPLACE INTO bookings (id, title, date, time, status, customer) VALUES (@id, @title, @date, @time, @status, @customer)');
    const insertCall = db.prepare('INSERT OR REPLACE INTO calls (id, date, duration, "from", "to", type) VALUES (@id, @date, @duration, @from, @to, @type)');
    const insertCost = db.prepare('INSERT OR REPLACE INTO costs (id, category, amount, date, description) VALUES (@id, @category, @amount, @date, @description)');

    const insertMany = db.transaction((bookings, calls, costs) => {
        for (const booking of bookings) insertBooking.run(booking);
        for (const call of calls) insertCall.run(call);
        for (const cost of costs) insertCost.run(cost);
    });

    insertMany(bookings, calls, costs);
    console.log('Database seeded successfully!');
};

seed();
