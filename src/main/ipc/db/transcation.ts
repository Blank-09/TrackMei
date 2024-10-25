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

ipcMain.handle('transaction:getAll', async () => {
  try {
    const transactions = await Transaction.findAll()
    return transactions
  } catch (error) {
    console.log(error)
    return null
  }
})

ipcMain.handle('transaction:getById', async (_event, transactionId: number) => {
  try {
    const transaction = await Transaction.findByPk(transactionId)
    return transaction
  } catch (error) {
    console.log(error)
    return null
  }
})

ipcMain.handle('transaction:update', async (_event, data: TransactionAttributes) => {
  try {
    const transaction = await Transaction.update(data, {
      where: {
        transid: data.transid,
      },
    })
    return transaction
  } catch (error) {
    console.log(error)
    return null
  }
})

ipcMain.handle('transaction:delete', async (_event, transactionId: number) => {
  try {
    const transaction = await Transaction.destroy({
      where: {
        transid: transactionId,
      },
    })
    return transaction
  } catch (error) {
    console.log(error)
    return null
  }
})
