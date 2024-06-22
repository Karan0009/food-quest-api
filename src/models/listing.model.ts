import { Column, DataType, Model, Table } from 'sequelize-typescript';

export enum LISTING_STATUS {
  'active' = 'active',
  'inactive' = 'inactive',
  'promoted' = 'promoted',
}

export enum BHK_TYPES {
  'one_rk' = 'one_rk',
  'one_bhk' = 'one_bhk',
  'two_bhk' = 'two_bhk',
  'three_bhk' = 'three_bhk',
}

@Table({ tableName: 'listings' })
export default class Listing extends Model<Listing> {
  @Column({
    field: 'id',
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    field: 'location',
    type: DataType.GEOMETRY('POINT', 4326),
    allowNull: true,
  })
  location?: number[];

  @Column({
    field: 'bhk_type',
    type: DataType.ENUM(...Object.values(BHK_TYPES)),
    allowNull: false,
  })
  bhk_type: BHK_TYPES;

  @Column({
    field: 'status',
    defaultValue: 'active',
    type: DataType.ENUM(...Object.values(LISTING_STATUS)),
    allowNull: false,
  })
  status: LISTING_STATUS;

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
}
