import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { RefreshToken } from './refresh-tokens.model';

@Table
export class User extends Model<User> {
  @Column({
    field: 'id',
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({ field: 'username', type: DataType.STRING(50) })
  username: string;

  @Column({ field: 'email', type: DataType.STRING(50) })
  email: string;

  @Column({
    field: 'profile-picture',
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
