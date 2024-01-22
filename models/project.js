// const db = require('../db');

// async function getProjects() {
//   try {
//     const [projects] = await db.execute('SELECT * FROM projects');
//     return projects;
//   } catch (error) {
//     console.error(error);
//     throw new Error('Error fetching projects');
//   }
// }

// async function getProjectById(id) {
//   try {
//     const [project] = await db.execute('SELECT * FROM projects WHERE id = ?', [id]);

//     if (!project || project.length === 0) {
//       throw new Error('Project not found');
//     }

//     return project[0];
//   } catch (error) {
//     console.error(error);
//     throw new Error('Error fetching project by ID');
//   }
// }

// async function createProject(name, description) {
//   try {
//     const [result] = await db.execute('INSERT INTO projects (name, description) VALUES (?, ?)', [name, description]);
//     const projectId = result.insertId;
//     return { projectId, name, description };
//   } catch (error) {
//     console.error(error);
//     throw new Error('Error creating project');
//   }
// }

// async function addMemberToProject(projectId, userId) {
//   try {
//     await db.execute('INSERT INTO project_members (project_id, user_id) VALUES (?, ?)', [projectId, userId]);
//     return { success: true, message: 'User added to project successfully' };
//   } catch (error) {
//     console.error(error);
//     throw new Error('Error adding user to project');
//   }
// }

// async function deleteProject(projectId) {
//   try {
//     await db.execute('DELETE FROM projects WHERE id = ?', [projectId]);
//     return { success: true, message: 'Project deleted successfully' };
//   } catch (error) {
//     console.error(error);
//     throw new Error('Error deleting project');
//   }
// }


// module.exports = {
//   getProjects,
//   getProjectById,
//   createProject,
//   addMemberToProject,
//   deleteProject,
// };
