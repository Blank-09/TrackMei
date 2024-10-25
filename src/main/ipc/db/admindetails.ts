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
