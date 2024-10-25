import { Table, Model, Column, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript'
import { ProjectDetails } from './ProjectDetails'

type InternCurrentStatus = 'active' | 'inactive' | 'completed'

export type InternDetailsAttributes = {
  intern_id: number
  name: string
  email: string
  phone: string
  city: string
  project_id: number
  date_of_joining: Date
  date_of_leaving: Date
  status: InternCurrentStatus
}

@Table({
  tableName: 'interns',
  timestamps: true,
})
export class InternDetails extends Model<InternDetailsAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare intern_id: number

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
  declare phone: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare city: string

  @ForeignKey(() => ProjectDetails)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare project_id: number

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare date_of_joining: Date

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare date_of_leaving: Date

  @Column({
    type: DataType.ENUM('active', 'inactive', 'completed'), // Use ENUM to restrict status values
    allowNull: false,
  })
  declare status: InternCurrentStatus

  // Define a belongs-to relationship with ProjectDetails
  @BelongsTo(() => ProjectDetails)
  project!: ProjectDetails // Singular type for a single project association
}
