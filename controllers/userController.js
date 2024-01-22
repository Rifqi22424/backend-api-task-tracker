const db = require('../db');
const bcrypt = require('bcrypt'); 
const { generateToken, validateToken } = require('../jwtMiddleware');

async function registerUser(req, res) {
  const { username, email, password } = req.body;

  try {
    const [existingUsers] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function loginUser(req, res) {
    const { email, password } = req.body;
  
    try {
      const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  
      if (!user || user.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user[0].password);
  
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      const token = generateToken(user[0].id);
  
      res.json({ success: true, message: 'User logged in successfully', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async function getAllUsers(req, res) {
    try {
        const [users] = await db.execute('SELECT id, username, email FROM users');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
  

async function getUserById(req, res) {
  const userId = req.params.id;

  try {
    const [user] = await db.execute('SELECT id, username, email FROM users WHERE id = ?', [userId]);

    if (!user || user.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(user[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function updateUser(req, res) {
  const userId = req.params.id;
  const { username, email } = req.body;

  try {
    await db.execute('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, userId]);
    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function deleteUser(req, res) {
  const userId = req.params.id;

  try {
    await db.execute('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getUserProjects(req, res) {
  const userId = req.params.id;

  try {
    const [projects] = await db.execute('SELECT projects.* FROM projects INNER JOIN project_members ON projects.id = project_members.project_id WHERE project_members.user_id = ?', [userId]);
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProjects,
};
