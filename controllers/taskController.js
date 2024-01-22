const db = require('../db');

async function getTasks(req, res) {
  try {
    const [tasks] = await db.execute('SELECT tasks.*, GROUP_CONCAT(task_assignments.id) AS assignment_ids, GROUP_CONCAT(user_id) AS assigned_users FROM tasks LEFT JOIN task_assignments ON tasks.id = task_assignments.task_id GROUP BY tasks.id');

    const groupedTasks = tasks.reduce((acc, task) => {
      const taskId = task.id;

      if (!acc[taskId]) {
        acc[taskId] = {
          task: {
            id: task.id,
            title: task.title,
            description: task.description,
            project_id: task.project_id,
            completed: task.completed,
            assigned_to: task.assigned_to,
            created_at: task.created_at,
            update_at: task.update_at,
            assigned_users: [],
          },
        };
      }

      // Add assigned user details if available
      if (task.assigned_users !== null) {
        const user_ids = task.assigned_users.split(',');
        const assignment_ids = task.assignment_ids.split(',');

        user_ids.forEach((user_id, index) => {
          acc[taskId].task.assigned_users.push({
            id: parseInt(user_id),  // Assuming user_id is an integer
            assignment_id: parseInt(assignment_ids[index]),  // Assuming assignment_id is an integer
          });
        });
      }

      return acc;
    }, {});

    // Convert the groupedTasks object into an array
    const structuredTasks = Object.values(groupedTasks);

    res.json(structuredTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



async function getTaskById(req, res) {
  const taskId = req.params.id;

  try {
    const [task] = await db.execute('SELECT tasks.*, GROUP_CONCAT(task_assignments.id) AS assignment_ids, GROUP_CONCAT(user_id) AS assigned_users FROM tasks LEFT JOIN task_assignments ON tasks.id = task_assignments.task_id WHERE tasks.id = ? GROUP BY tasks.id', [taskId]);

    if (!task || task.length === 0) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      const structuredTask = task.reduce((acc, task) => {
        acc = {
          id: task.id,
          title: task.title,
          description: task.description,
          project_id: task.project_id,
          completed: task.completed,
          assigned_to: task.assigned_to,
          created_at: task.created_at,
          update_at: task.update_at,
          assigned_users: [],
        };

        // Add assigned user details if available
        if (task.assigned_users !== null) {
          const user_ids = task.assigned_users.split(',');
          const assignment_ids = task.assignment_ids.split(',');

          user_ids.forEach((user_id, index) => {
            acc.assigned_users.push({
              id: parseInt(user_id),  // Assuming user_id is an integer
              assignment_id: parseInt(assignment_ids[index]),  // Assuming assignment_id is an integer
            });
          });
        }

        return acc;
      }, {});

      res.json(structuredTask);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



async function createTask(req, res) {
  const { title, description, projectId } = req.body;

  try {
    const [result] = await db.execute('INSERT INTO tasks (title, description, project_id) VALUES (?, ?, ?)', [title, description, projectId]);
    const taskId = result.insertId;
    res.json({ taskId, title, description, projectId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function markTaskAsCompleted(req, res) {
  const taskId = req.params.id;

  try {
    const [task] = await db.execute('SELECT * FROM tasks WHERE id = ?', [taskId]);

    if (!task || task.length === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const currentStatus = task[0].completed;

    const newStatus = !currentStatus; 
    await db.execute('UPDATE tasks SET completed = ? WHERE id = ?', [newStatus, taskId]);

    res.json({
      success: true,
      message: `Task marked as ${newStatus ? 'completed' : 'uncompleted'} successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


async function deleteTask(req, res) {
  const taskId = req.params.id;

  try {
    await db.execute('DELETE FROM tasks WHERE id = ?', [taskId]);
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function assignTaskToUsers(req, res) {
  const taskId = req.params.id;
  const userIds = req.params.userId;

  try {
    // Ensure all users exist
    const [users] = await db.execute('SELECT id FROM users WHERE id IN (?)', [userIds]);

    if (users.length !== userIds.length) {
      return res.status(404).json({ error: 'One or more users not found' });
    }

    // Assign the task to each user
    for (const userId of userIds) {
      await db.execute('INSERT INTO task_assignments (task_id, user_id) VALUES (?, ?)', [taskId, userId]);
    }

    res.json({ success: true, message: 'Task assigned to users successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function unassignTaskFromUsers(req, res) {
  const taskId = req.params.id;
  const userIds = req.params.userId; // Ubah dari req.params.userId menjadi req.body.userIds

  try {
    await db.execute('DELETE FROM task_assignments WHERE task_id = ? AND user_id IN (?)', [taskId, userIds]);

    res.json({ success: true, message: 'Task unassigned from users successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



module.exports = {
  getTasks,
  getTaskById,
  createTask,
  markTaskAsCompleted,
  deleteTask,
  assignTaskToUsers,
  unassignTaskFromUsers,
};
