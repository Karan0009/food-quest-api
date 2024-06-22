import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import User from './user.model';

@Table
export default class RefreshToken extends Model<RefreshToken> {
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
  user_id: string;

  @Column({ field: 'meta', type: DataType.JSON, defaultValue: {} })
  meta: object;

  @Column({ field: 'expire_at', type: DataType.DATE })
  expire_at: string;

  @Column({ field: 'status', defaultValue: 'active' })
  status: string;

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

  @BelongsTo(() => User)
  user: User;
}
