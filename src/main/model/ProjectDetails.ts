import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript'
import { Transaction } from './Transcation'
import { InternDetails } from './InternDetails'

type ProjectCategory = 'Web development' | 'mobile development' | 'design' | 'Project Management'
type ProjectPayType = 'monthly' | 'yearly'
type ProjectStatus = 'completed' | 'in progress' | 'not started'

export type ProjectDetailsAttributes = {
  project_id: number
  project_title: string
  // client_id: number
  clientname: string
  categories: ProjectCategory
  project_description: string
  project_start_date: Date
  project_due_date: Date
  project_price: number
  payment_options: ProjectPayType
  project_status: ProjectStatus
}

@Table({
  tableName: 'projectdetails',
  timestamps: true,
})
export class ProjectDetails extends Model<ProjectDetailsAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare project_id: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare project_title: string

  // @ForeignKey(() => Client)
  // @Column({
  //   type: DataType.INTEGER,
  //   allowNull: false,
  //   onDelete: 'CASCADE',
  // })
  // declare client_id: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare clientname: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare categories: ProjectCategory

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare project_description: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare project_start_date: Date

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare project_due_date: Date

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare project_price: number

  @Column({
    type: DataType.ENUM('monthly', 'yearly'),
    allowNull: false,
  })
  declare payment_options: ProjectPayType

  @Column({
    type: DataType.ENUM('completed', 'in progress', 'not started'),
    allowNull: false,
  })
  declare project_status: ProjectStatus

  // Define the belongs-to relationship with Client
  // @BelongsTo(() => Client)
  // client!: Client

  // Define the one-to-many relationship with  Intern
  @HasMany(() => InternDetails)
  intern!: InternDetails

  // Define a one-to-many relationship with transactions
  @HasMany(() => Transaction)
  transactions!: Transaction[]
}
