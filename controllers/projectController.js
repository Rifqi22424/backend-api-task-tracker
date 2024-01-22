const db = require('../db');

async function getProjects(req, res) {
  try {
    const [tasks] = await db.execute(`
      SELECT projects.id as project_id,
             projects.name as project_name,
             projects.description as project_description,
             projects.created_at as project_created_at,
             projects.update_at as project_update_at,
             project_members.user_id,
             project_members.project_id as member_project_id
      FROM projects
      LEFT JOIN project_members ON projects.id = project_members.project_id
    `);

    // Group projects and members
    const groupedTasks = tasks.reduce((acc, task) => {
      const projectId = task.project_id;

      if (!acc[projectId]) {
        acc[projectId] = {
          project: {
            id: task.project_id,
            name: task.project_name,
            description: task.project_description,
            created_at: task.project_created_at,
            update_at: task.project_update_at,
            project_members: [],
          },
        };
      }

      // Add project member details if available
      if (task.member_project_id !== null) {
        acc[projectId].project.project_members.push({
          user_id: task.user_id,
          project_id: task.member_project_id,
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

async function getProjectById(req, res) {
  const projectId = req.params.id;

  try {
    console.log('Requested Project ID:', projectId);

    const [project] = await db.execute(`
      SELECT projects.id as project_id,
             projects.name as project_name,
             projects.description as project_description,
             projects.created_at as project_created_at,
             projects.update_at as project_update_at,
             project_members.id as project_member_id,
             project_members.user_id,
             project_members.project_id as member_project_id
      FROM projects
      LEFT JOIN project_members ON projects.id = project_members.project_id
      WHERE projects.id = ?
    `, [projectId]);

    if (!project || project.length === 0) {
      res.status(404).json({ error: 'Project not found' });
    } else {
      // Group project members by project_id
      const groupedProject = project.reduce((acc, task) => {
        const projectId = task.project_id;

        if (!acc[projectId]) {
          acc[projectId] = {
            project: {
              id: task.project_id,
              name: task.project_name,
              description: task.project_description,
              created_at: task.project_created_at,
              update_at: task.project_update_at,
              project_members: [],
            },
          };
        }

        // Add project member details if available
        if (task.project_member_id !== null) {
          acc[projectId].project.project_members.push({
            id: task.project_member_id,
            user_id: task.user_id,
          });
        }

        return acc;
      }, {});

      // Convert the groupedProject object into an array
      const structuredProject = Object.values(groupedProject)[0]; // Since it's a single project

      res.json(structuredProject);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



async function createProject(req, res) {
  const { name, description } = req.body;

  try {
    const [result] = await db.execute('INSERT INTO projects (name, description) VALUES (?, ?)', [name, description]);
    const projectId = result.insertId;
    res.json({ projectId, name, description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function addUserToProject(req, res) {
  const projectId = req.params.id;
  const userId = req.body.userId;

  try {
    await db.execute('INSERT INTO project_members (project_id, user_id) VALUES (?, ?)', [projectId, userId]);
    res.json({ success: true, message: 'User added to project successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function removeUserFromProject(req, res) {
  const projectId = req.params.id;
  const userId = req.body.userId;

  try {
    await db.execute('DELETE FROM project_members WHERE project_id = ? AND user_id = ?', [projectId, userId]);
    res.json({ success: true, message: 'User removed from project successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


async function deleteProject(req, res) {
    const projectId = req.params.id;
  
    try {
      // Delete project members associated with the project
      await db.execute('DELETE FROM project_members WHERE project_id = ?', [projectId]);
  
      // Delete the project
      await db.execute('DELETE FROM projects WHERE id = ?', [projectId]);
  
      res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  

async function getTasksInProject(req, res) {
  const projectId = req.params.id;

  try {
    const [tasks] = await db.execute('SELECT * FROM tasks WHERE project_id = ?', [projectId]);
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function deleteTaskInProject(req, res) {
  const projectId = req.params.projectId;
  const taskId = req.params.taskId;

  try {
    await db.execute('DELETE FROM tasks WHERE id = ? AND project_id = ?', [taskId, projectId]);
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = {
  getProjects,
  getProjectById,
  createProject,
  addUserToProject,
  removeUserFromProject,
  deleteProject,
  getTasksInProject,
  deleteTaskInProject,
};
