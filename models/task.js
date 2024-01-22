// const db = require('../db');

// async function getTasks() {
//   try {
//     const [tasks] = await db.execute('SELECT * FROM tasks');
//     return tasks;
//   } catch (error) {
//     console.error(error);
//     throw new Error('Error fetching tasks');
//   }
// }

// async function getTaskById(id) {
//   try {
//     const [task] = await db.execute('SELECT * FROM tasks WHERE id = ?', [id]);

//     if (!task || task.length === 0) {
//       throw new Error('Task not found');
//     }

//     return task[0];
//   } catch (error) {
//     console.error(error);
//     throw new Error('Error fetching task by ID');
//   }
// }

// async function createTask(title, description, projectId) {
//   try {
//     const [result] = await db.execute('INSERT INTO tasks (title, description, project_id) VALUES (?, ?, ?)', [title, description, projectId]);
//     const taskId = result.insertId;
//     return { taskId, title, description, projectId };
//   } catch (error) {
//     console.error(error);
//     throw new Error('Error creating task');
//   }
// }

// async function markTaskAsCompleted(taskId) {
//   try {
//     await db.execute('UPDATE tasks SET completed = true WHERE id = ?', [taskId]);
//     return { success: true, message: 'Task marked as completed successfully' };
//   } catch (error) {
//     console.error(error);
//     throw new Error('Error marking task as completed');
//   }
// }

// async function deleteTask(taskId) {
//   try {
//     await db.execute('DELETE FROM tasks WHERE id = ?', [taskId]);
//     return { success: true, message: 'Task deleted successfully' };
//   } catch (error) {
//     console.error(error);
//     throw new Error('Error deleting task');
//   }
// }


// module.exports = {
//   getTasks,
//   getTaskById,
//   createTask,
//   markTaskAsCompleted,
//   deleteTask,
// };
