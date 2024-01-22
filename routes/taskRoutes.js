const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');
const { validateToken } = require('../jwtMiddleware'); // Import validateToken


router.use(validateToken);

router.get('/', TaskController.getTasks);
router.get('/:id', TaskController.getTaskById);
router.post('/', TaskController.createTask);
router.put('/:id', TaskController.markTaskAsCompleted);
router.delete('/:id', TaskController.deleteTask);
router.put('/:id/assign/:userId', TaskController.assignTaskToUsers);
router.put('/:id/unassign/:userId', TaskController.unassignTaskFromUsers);


module.exports = router;
