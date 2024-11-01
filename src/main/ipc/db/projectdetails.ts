import { ipcMain } from 'electron'
import { ProjectDetails, ProjectDetailsAttributes } from '../../model/ProjectDetails'
import { Client } from '../../model/Client'

ipcMain.handle('projectdetails:add', async (_event, data: ProjectDetailsAttributes) => {
  try {
    const client = await Client.findByPk(data.clientname)
    if (!client) {
      console.error('Client not found:', data.clientname)
      return null
    }

    const projectdetails = await ProjectDetails.create({
      ...data,
      clientname: client.owner_name,
    })
    return projectdetails
    return null
  } catch (e) {
    console.error(e)
    return null
  }
})

ipcMain.handle('projectdetails:getAll', async () => {
  try {
    const projectdetails = await ProjectDetails.findAll()
    return projectdetails.map((ProjectDetails) => ProjectDetails.toJSON())
  } catch (e) {
    console.error(e)
    return null
  }
})

ipcMain.handle('projectdetails:getById', async (_event, projectdetailsId: number) => {
  try {
    const projectdetails = await ProjectDetails.findByPk(projectdetailsId)
    return projectdetails?.toJSON()
  } catch (e) {
    console.error(e)
    return null
  }
})

ipcMain.handle('projectdetails:update', async (_event, data: ProjectDetailsAttributes) => {
  try {
    const projectdetails = await ProjectDetails.update(data, {
      where: {
        project_id: data.project_id,
      },
    })
    return projectdetails
  } catch (e) {
    console.error(e)
    return null
  }
})

ipcMain.handle('projectdetails:delete', async (_event, projectdetailsId: number) => {
  try {
    const projectdetails = await ProjectDetails.destroy({
      where: {
        project_id: projectdetailsId,
      },
    })
    return projectdetails
  } catch (e) {
    console.error(e)
    return null
  }
})
