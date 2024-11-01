import { ipcMain } from 'electron'
import { Client, ClientAttributes } from '../../model/Client'
import { Transaction } from '../../model/Transcation'

ipcMain.handle('client:add', async (_event, data: ClientAttributes) => {
  try {
    const client = await Client.create(data)
    return client
  } catch (e) {
    console.error(e)
    return null
  }
})

ipcMain.handle('client:getAll', async () => {
  try {
    const clients = await Client.findAll()
    return clients.map((client) => client.toJSON())
  } catch (e) {
    console.error(e)
    return null
  }
})

ipcMain.handle('client:getById', async (_event, clientId: number) => {
  try {
    const client = await Client.findByPk(clientId)
    return client?.toJSON()
  } catch (e) {
    console.error(e)
    return null
  }
})

ipcMain.handle(
  'client:update',
  async (_event, clientId: number, data: Partial<ClientAttributes>) => {
    try {
      const client = await Client.findByPk(clientId)
      if (client) {
        await client.update(data) // Update the client details
        return { success: true, message: 'Client updated successfully', client } // Return the updated client
      } else {
        return { success: false, message: 'Client not found' } // Return an error message if client not found
      }
    } catch (e) {
      console.error('Error updating client:', e) // Log the error for debugging
      return { success: false, message: 'Failed to update client' } // Return a structured error message
    }
  },
)

ipcMain.handle('client:delete', async (_event, id: number) => {
  try {
    // First, delete related transactions if not using cascade
    await Transaction.destroy({ where: { project_title: id } }) // Adjust based on your foreign key

    const client = await Client.findByPk(id)
    if (!client) {
      return { success: false, message: 'Client not found' }
    }

    // Now delete the client
    await client.destroy()
    return { success: true, message: 'Client deleted successfully' }
  } catch (e: any) {
    console.error('Error during deletion:', e)
    return { success: false, message: 'Error during deletion: ' + e.message }
  }
})
