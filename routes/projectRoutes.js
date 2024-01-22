const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/projectController');
const { validateToken } = require('../jwtMiddleware');


router.use(validateToken);

router.get('/', ProjectController.getProjects);
router.get('/:id', ProjectController.getProjectById);
router.post('/', ProjectController.createProject);
router.put('/:id', ProjectController.addUserToProject);
router.delete('/:id/remove-user', ProjectController.removeUserFromProject);
router.delete('/:id', ProjectController.deleteProject);
router.get('/:id/tasks', ProjectController.getTasksInProject);
router.delete('/:projectId/tasks/:taskId', ProjectController.deleteTaskInProject);


module.exports = router;
