// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const db = require('../db');

// async function registerUser(username, email, password) {

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const [rows] = await db.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

//   const token = jwt.sign({ userId: rows.insertId, username, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

//   return { userId: rows.insertId, username, email, token };
// }

// async function loginUser(email, password) {

//   const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

//   if (!user || user.length === 0) {
//     throw new Error('Invalid email or password');
//   }

//   const isValidPassword = await bcrypt.compare(password, user[0].password);

//   if (!isValidPassword) {
//     throw new Error('Invalid email or password');
//   }

//   // Generate JWT token
//   const token = jwt.sign({ userId: user[0].id, username: user[0].username, email: user[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' });

//   return { userId: user[0].id, username: user[0].username, email: user[0].email, token };
// }


// module.exports = {
//   registerUser,
//   loginUser,
// };
