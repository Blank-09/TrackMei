import { Table, Model, Column, DataType } from 'sequelize-typescript'

type AdminRole = 'admin' | 'superadmin'
type AdminDestination = 'founder' | 'co-founder' | 'ceo'
export type AdminDetailsAttributes = {
  admin_id: number
  name: string
  email: string
  phone_number: string
  role: AdminRole
  destination: AdminDestination
}

@Table({
  tableName: 'admin_details',
  timestamps: true,
})
export class AdminDetails extends Model<AdminDetailsAttributes> implements AdminDetailsAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare admin_id: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phone_number: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare role: AdminRole

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare destination: AdminDestination
}
