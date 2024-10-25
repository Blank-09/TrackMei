import { ipcMain } from 'electron'
import { Client, ClientAttributes } from '../../model/Client'

ipcMain.handle('client:add', async (_event, data: ClientAttributes) => {
  try {
    const client = await Client.create(data)
    return client
  } catch (e) {
    console.error(e)
    return null
  }
})
