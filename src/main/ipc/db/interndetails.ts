import { ipcMain } from 'electron'
import { InternDetails, InternDetailsAttributes } from '../../model/InternDetails'

ipcMain.handle('interndetails:add', async (_event, data: InternDetailsAttributes) => {
  try {
    const interndetails = await InternDetails.create(data)
    return interndetails
  } catch (e) {
    console.error(e)
    return null
  }
})
