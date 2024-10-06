import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'OrderDetail', // 模型名稱可以與資料表名稱一致
    {
      order_detail_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true, // 自增序列
        primaryKey: true, // 設定為主鍵
      },
      create_date: {
        type: DataTypes.DATEONLY, // 使用 DATEONLY 對應 SQL 的 date 類型
        allowNull: true,
        comment: '建立日期',
      },
      order_item: {
        type: DataTypes.STRING, // 使用 VARCHAR 對應 SQL 的可變長字串
        allowNull: true,
        comment: '訂購項目',
      },
      item_qty: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '項目數量',
      },
      pay_way: {
        type: DataTypes.STRING(6), // 長度限制為 6 的字串類型
        allowNull: true,
        comment: '付款方式',
      },
      pay_ornot: {
        type: DataTypes.STRING(1), // 長度限制為 1 的字串類型
        allowNull: true,
        comment: '是否付款',
      },
      send_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '運送方式 ID',
      },
      send_way: {
        type: DataTypes.STRING(7), // 長度限制為 7 的字串類型
        allowNull: true,
        comment: '運送方式',
      },
      send_tax: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '運費',
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '總價',
      },
      recipient_address: {
        type: DataTypes.STRING(20), // 長度限制為 20 的字串類型
        allowNull: true,
        comment: '收件人地址',
      },
      orderlist_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '訂單 ID',
      },
    },
    {
      tableName: 'order_detail', // 資料表名稱
      timestamps: false, // 不使用自動生成的時間戳欄位
      paranoid: false, // 不使用軟刪除
      underscored: true, // 使用 snake_case 命名規則
    }
  )
}
