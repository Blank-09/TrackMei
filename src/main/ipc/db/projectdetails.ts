import { ipcMain } from 'electron'
import { ProjectDetails, ProjectDetailsAttributes } from '../../model/ProjectDetails'

ipcMain.handle('projectdetails:add', async (_event, data: ProjectDetailsAttributes) => {
  try {
    const projectdetails = await ProjectDetails.create(data)
    return projectdetails
    return null
  } catch (e) {
    console.error(e)
    return null
  }
})
