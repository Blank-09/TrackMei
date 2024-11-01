import { ipcMain } from 'electron'
import { Transaction, TransactionAttributes } from '../../model/Transcation'
import { Client } from '../../model/Client'
import { ProjectDetails } from '../../model/ProjectDetails'

ipcMain.handle('transaction:add', async (_event, data: TransactionAttributes) => {
  try {
    const client = await Client.findByPk(data.clientname)
    const project = await ProjectDetails.findByPk(data.project_title)
    if (!client || !project) {
      throw new Error('Client or project   not found')
    }
    const transaction = await Transaction.create({
      ...data,
      clientname: client.owner_name,
      project_title: project.project_title,
    })
    return transaction
  } catch (error) {
    console.log(error)
    return null
  }
})

ipcMain.handle('transaction:getAll', async () => {
  try {
    const transactions = await Transaction.findAll()
    return transactions.map((Transaction) => Transaction.toJSON())
  } catch (error) {
    console.log(error)
    return null
  }
})

ipcMain.handle('transaction:getById', async (_event, transactionId: number) => {
  try {
    const transaction = await Transaction.findByPk(transactionId)
    return transaction?.toJSON()
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
