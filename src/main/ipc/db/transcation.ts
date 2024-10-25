import { ipcMain } from 'electron'
import { Transaction, TransactionAttributes } from '../../model/Transcation'

ipcMain.handle('transaction:add', async (_event, data: TransactionAttributes) => {
  try {
    const transaction = await Transaction.create(data)
    return transaction
  } catch (error) {
    console.log(error)
    return null
  }
})
