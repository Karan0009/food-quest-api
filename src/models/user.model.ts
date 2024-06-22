import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import RefreshToken from './refresh-tokens.model';

export enum USER_STATUS {
  'active' = 'active',
}

@Table({ tableName: 'users' })
export default class User extends Model<User> {
  @Column({
    field: 'id',
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    field: 'country_code',
    type: DataType.STRING(5),
    defaultValue: '+91',
    allowNull: false,
  })
  country_code: string;

  @Column({
    field: 'phone_number',
    type: DataType.STRING(15),
    allowNull: false,
  })
  phone_number: string;

  @Column({
    field: 'profile_picture',
    type: DataType.STRING(200),
    defaultValue: '',
  })
  profile_picture: string;

  @Column({
    field: 'full_name',
    type: DataType.STRING(100),
    defaultValue: '',
  })
  full_name: string;

  @Column({
    field: 'current_location',
    type: DataType.GEOMETRY('POINT', 4326),
    allowNull: true,
  })
  current_location?: number[];

  @Column({
    field: 'status',
    defaultValue: 'active',
    type: DataType.ENUM(...Object.values(USER_STATUS)),
    allowNull: false,
  })
  status: USER_STATUS;

  @Column({
    field: 'created_at',
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at: Date;

  @Column({
    field: 'updated_at',
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updated_at: Date;

  @HasMany(() => RefreshToken)
  refresh_tokens: RefreshToken[];
}
