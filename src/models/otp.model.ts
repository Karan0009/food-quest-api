import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export default class Otp extends Model {
  @Column({
    field: 'id',
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({ field: 'otp', type: DataType.STRING(6) })
  otp: string;

  @Column({
    field: 'time_to_live_in_sec',
    type: DataType.INTEGER,
  })
  time_to_live_in_sec: number;

  @Column({
    field: 'is_used',
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_used: boolean;

  // @Column({
  //   field: 'created_at',
  //   type: DataType.DATE,
  //   defaultValue: DataType.NOW,
  // })
  // created_at: Date;

  // @Column({
  //   field: 'updated_at',
  //   type: DataType.DATE,
  //   defaultValue: DataType.NOW,
  // })
  // updated_at: Date;
}
