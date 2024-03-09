import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class RefreshToken extends Model<RefreshToken> {
  @Column({
    field: 'id',
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({ field: 'token', type: DataType.STRING(200) })
  token: string;

  @ForeignKey(() => User)
  @Column({ field: 'user_id', type: DataType.UUID })
  userId: string;

  @Column({ field: 'expire_at', type: DataType.DATE })
  expireAt: Date;

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

  @BelongsTo(() => User)
  user: User;
}
