import { ipcMain } from 'electron'
import { InternDetails, InternDetailsAttributes } from '../../model/InternDetails'
import { ProjectDetails } from '../../model/ProjectDetails'

// Handler to add a new intern
ipcMain.handle('interndetails:add', async (_event, data: InternDetailsAttributes) => {
  try {
    const interndetails = await InternDetails.create(data)
    return interndetails
  } catch (e) {
    console.error('Error adding intern details:', e)
    return null
  }
})

// Handler to get all interns
ipcMain.handle('interndetails:getAll', async () => {
  try {
    const interndetails = await InternDetails.findAll()
    return interndetails
  } catch (e) {
    console.error('Error retrieving all intern details:', e)
    return []
  }
})

// Handler to get intern by ID
ipcMain.handle('interndetails:getById', async (_event, interndetailsId: number) => {
  try {
    const interndetails = await InternDetails.findByPk(interndetailsId)
    return interndetails || null
  } catch (e) {
    console.error(`Error retrieving intern details for ID ${interndetailsId}:`, e)
    return null
  }
})

ipcMain.handle('interndetails:update', async (_event, data: InternDetailsAttributes) => {
  try {
    const projectExists = await ProjectDetails.findOne({
      where: { project_id: data.project_id },
    })

    if (!projectExists) {
      console.error(`Project ID ${data.project_id} does not exist.`)
      return null
    }

    const result = await InternDetails.update(data, {
      where: { intern_id: data.intern_id },
      returning: true,
    })

    const [rowsUpdated, updatedInternDetails] = result

    // Check if the update was successful and return the updated details
    return rowsUpdated > 0 ? updatedInternDetails[0] : null // Return the updated instance
  } catch (e) {
    console.error(`Error updating intern details for ID ${data.intern_id}:`, e)
    return null // Return null in case of error
  }
})

// Handler to delete an intern by ID
ipcMain.handle('interndetails:delete', async (_event, interndetailsId: number) => {
  try {
    const rowsDeleted = await InternDetails.destroy({
      where: { intern_id: interndetailsId },
    })
    return rowsDeleted > 0
  } catch (e) {
    console.error(`Error deleting intern details for ID ${interndetailsId}:`, e)
    return false
  }
})
