import { Table, Model, Column, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript'
import { ProjectDetails } from './ProjectDetails'

type PaymentType = 'upi' | 'credit card' | 'debit card' | 'netbanking' | 'cash'

export type TransactionAttributes = {
  transid: number
  clientname: string
  project_id: number
  fromMobilenumber: number
  toMobilenumber: number
  payment: PaymentType
  acnumber: number
  paidamount: number
  bankname: string
  date: Date
  description: string
}

@Table({
  tableName: 'transactions',
  timestamps: true,
})
export class Transaction extends Model<TransactionAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare transid: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare clientname: string

  @ForeignKey(() => ProjectDetails)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE', // Enable cascading deletion
  })
  declare project_id: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare fromMobilenumber: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare toMobilenumber: number

  @Column({
    type: DataType.ENUM('upi', 'credit card', 'debit card', 'netbanking', 'cash'),
    allowNull: false,
  })
  declare payment: PaymentType

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare acnumber: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare paidamount: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare bankname: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare date: Date

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare description: string

  // Define a belongs relationship with ProjectDetails
  @BelongsTo(() => ProjectDetails)
  project!: ProjectDetails
}
