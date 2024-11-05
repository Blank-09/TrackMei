import { ipcMain } from 'electron'
import { InternDetails, InternDetailsAttributes } from '../../model/InternDetails'

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
    return interndetails.map((Interndetails) => Interndetails.toJSON())
  } catch (e) {
    console.error('Error retrieving all intern details:', e)
    return []
  }
})

// Handler to get intern by ID
ipcMain.handle('interndetails:getById', async (_event, interndetailsId: number) => {
  try {
    const interndetails = await InternDetails.findByPk(interndetailsId)
    return interndetails?.toJSON()
  } catch (e) {
    console.error(`Error retrieving intern details for ID ${interndetailsId}:`, e)
    return null
  }
})

ipcMain.handle('interndetails:update', async (_event, data) => {
  try {
    const [updated] = await InternDetails.update(data, {
      where: { intern_id: data.intern_id },
    })
    return updated
      ? { success: true, message: 'Intern updated successfully.' }
      : { success: false, message: 'Intern not found or update failed.' }
  } catch (e) {
    console.error('Error updating intern:', e)
    return { success: false, message: 'Error updating intern.' }
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
