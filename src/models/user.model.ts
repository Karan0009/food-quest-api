import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import RefreshToken from './refresh-tokens.model';

@Table({ tableName: 'users' })
export default class User extends Model<User> {
  @Column({
    field: 'id',
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({ field: 'phone_number', type: DataType.STRING(15) })
  phoneNumber: string;

  @Column({
    field: 'profile_picture',
    type: DataType.STRING(200),
    defaultValue: '',
  })
  profilePicture: string;

  @Column({ field: 'status', defaultValue: 'active' })
  status: string;

  @Column({
    field: 'created_at',
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Column({
    field: 'updated_at',
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;

  @HasMany(() => RefreshToken)
  refreshToken: RefreshToken[];
}
