import { Table, Model, Column, DataType } from 'sequelize-typescript'

export type ClientAttributes = {
  id: number
  company_name: string
  owner_name: string
  owner_email: string
  city: string
  phone: string
  projects: string
}

@Table({
  tableName: 'clients',
  timestamps: true,
})
export class Client extends Model<ClientAttributes> implements ClientAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare company_name: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare owner_name: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare owner_email: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare city: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phone: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare projects: string
}
