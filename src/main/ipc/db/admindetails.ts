import { ipcMain } from 'electron'
import { AdminDetails, AdminDetailsAttributes } from '../../model/AdminDetails'

ipcMain.handle('adminDetails:add', async (_event, data: AdminDetailsAttributes) => {
  try {
    const adminDetails = await AdminDetails.create(data)
    return adminDetails
    return null
  } catch (e) {
    console.error(e)
    return null
  }
})

ipcMain.handle('adminDetails:getAll', async () => {
  try {
    const adminDetails = await AdminDetails.findAll()
    return adminDetails
  } catch (e) {
    console.error(e)
    return null
  }
})

ipcMain.handle('adminDetails:getById', async (_event, adminDetailsId: number) => {
  try {
    const adminDetails = await AdminDetails.findByPk(adminDetailsId)
    return adminDetails
  } catch (e) {
    console.error(e)
    return null
  }
})

ipcMain.handle(
  'adminDetails:update',
  async (_event, adminDetailsId: number, data: AdminDetailsAttributes) => {
    try {
      const adminDetails = await AdminDetails.findByPk(adminDetailsId)
      if (adminDetails) {
        await adminDetails.update(data)
        return adminDetails
      }
      console.log(`Admin details with ID ${adminDetailsId} not found.`) // Log if not found
      return null
    } catch (e) {
      console.error(e)
      return null
    }
  },
)

ipcMain.handle('adminDetails:delete', async (_event, adminDetailsId: number) => {
  try {
    const adminDetails = await AdminDetails.findByPk(adminDetailsId)
    if (adminDetails) {
      await adminDetails.destroy()
      return true
    }
    return false
  } catch (e) {
    console.error(e)
    return false
  }
})
