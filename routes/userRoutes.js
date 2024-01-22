const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { validateToken } = require('../jwtMiddleware');

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);

router.use(validateToken);

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.get('/:id/projects', UserController.getUserProjects);


module.exports = router;
