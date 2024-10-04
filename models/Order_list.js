import { DataTypes } from 'sequelize';

export default async function (sequelize) {
  return sequelize.define(
    'OrderList', // 模型名稱可以與資料表名稱一致
    {
      orderlist_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true, // 對應 SQL 的自增序列
        primaryKey: true, // 設定為主鍵
      },
      order_date: {
        type: DataTypes.DATEONLY, // 使用 DATEONLY 對應 SQL 的 date 類型
        allowNull: false,
        comment: '訂單日期',
      },
      member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '會員 ID',
      },
      send_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '運送方式 ID',
      },
      send_tax: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '運費',
      },
      total_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '訂單總價',
      },
      order_status: {
        type: DataTypes.STRING(5), // 長度限制為 5 的字串類型
        allowNull: false,
        comment: '訂單狀態',
      },
      order_detail_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '訂單明細 ID',
      },
    },
    {
      tableName: 'orderlist', // 資料表名稱
      timestamps: false, // 不使用自動生成的時間戳欄位
      paranoid: false, // 不使用軟刪除
      underscored: true, // 使用 snake_case 命名規則
    }
  );
}
