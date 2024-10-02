// 在 routes/orderforcart.js 中創建新的路由檔案

// import express from 'express'
// const router = express.Router()
// import db from '##/configs/mysql.js'

// // 處理前端的 POST 請求
// router.post('/', async (req, res) => {
//   const {
//     order_date,
//     number_id,
//     pay_ornot,
//     pay_id,
//     send_tax,
//     total_price,
//     order_status,
//     recipient_address,
//     order_detail_id,
//   } = req.body

//   // 回應前端，表示資料已成功接收
//   res.status(200).json({
//     message: '後端已經成功接收到訂單！',
//     orderData: {
//       order_date,
//       number_id,
//       pay_ornot,
//       pay_id,
//       send_tax,
//       total_price,
//       order_status,
//       recipient_address,
//       order_detail_id,
//     },
//   })
// })

// export default router


// import express from 'express'
// const router = express.Router()
// import db from '##/configs/mysql.js'

// // 處理前端的 POST 請求
// router.post('/', async (req, res) => {
//   const {
//     order_date = new Date().toISOString().split('T')[0],  // 格式化為日期型別
//     member_id = null,  // member_id 允許為 NULL
//     send_id = null,    // send_id 允許為 NULL
//     send_tax = 0,      // 默認運費為 0
//     total_price = 0,   // 默認總價格為 0
//     order_status = 'pending',  // 默認狀態為 'pending'
//     order_detail_id = null,    // 訂單詳細 ID 允許為 NULL
//   } = req.body;

//   try {
//     const insertOrderlist = `
//       INSERT INTO orderlist 
//       (order_date, member_id, send_id, send_tax, total_price, order_status, order_detail_id) 
//       VALUES (?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//       order_date, 
//       member_id, 
//       send_id, 
//       send_tax, 
//       total_price, 
//       order_status, 
//       order_detail_id
//     ];


//     const insertOrder_detail = `
//     INSERT INTO order_detail
//     (order_date, member_id, pay_ornot, pay_id, send_id, send_tax, total_price, order_status, recipient_address, order_detail_id) 
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;



//     const [result] = await db.execute(insertOrderlist, values);
//     res.status(201).json({
//       message: '訂單已成功新增到資料庫！',
//       orderId: result.insertId,
//     });
//   } catch (error) {
//     console.error('新增訂單時發生錯誤:', error);
//     res.status(500).json({
//       message: '無法新增訂單，請稍後再試。',
//       error: error.message,
//     });
//   }
// });

// export default router;


import express from 'express';
const router = express.Router();
import db from '##/configs/mysql.js';  // 假設你的資料庫連線在這裡配置

router.post('/', async (req, res) => {
  const {
    order_date = new Date().toISOString().split('T')[0],  // 格式化為日期型別
    member_id = null,
    pay_ornot = '0',
    pay_id = null,
    send_id = null,
    send_tax = 0,
    total_price = 0,
    order_status = 'pending',
    recipient_address = '',
    order_detail = {},  // 來自前端的 order_detail 資料
  } = req.body;

  const {
    create_date = new Date().toISOString().split('T')[0],  // 預設值
    send_date = null,
    pay_way = '',
    price = 0,
    send_way = '',
  } = order_detail;

  try {
    // 開始 SQL 交易
    await db.getConnection().then(async (connection) => {
      await connection.beginTransaction();

      try {
        // 插入到 orderlist 表
        const insertOrderlistQuery = `
         INSERT INTO orderlist 
          (order_date, member_id, send_id, send_tax, total_price, order_status) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        const orderlistValues = [
          order_date, member_id, send_id, send_tax, total_price, order_status,
        ];

        const [orderlistResult] = await connection.execute(insertOrderlistQuery, orderlistValues);
        const orderlist_id = orderlistResult.insertId;  // 取得剛插入的 orderlist_id

        // 插入到 order_detail 表
        const insertOrderDetailQuery = `
          INSERT INTO order_detail
          (create_date, send_date, pay_id, send_id, send_way, send_tax, price, recipient_address, order_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const orderDetailValues = [
          new Date().toISOString().split('T')[0], // 假設創建日期
          null, // 假設發送日期
          null, // pay_id 可為 null
          send_id, // 將 send_id 傳遞給 order_detail
          null, // send_way 可以根據需要填寫
          send_tax, // 將運費傳遞給 order_detail
          total_price, // 總價格
          '', // 可以根據需求填寫收件人地址
          orderlist_id, // 這是剛插入的 orderlist_id
        ];

        await connection.execute(insertOrderDetailQuery, orderDetailValues);

        // 提交交易
        await connection.commit();
        connection.release();

        // 回應前端成功訊息
        res.status(201).json({
          message: '訂單與訂單詳細已成功新增到資料庫！',
          orderlistId: orderlist_id,
        });
      } catch (err) {
        // 如果有錯誤，回滾交易
        await connection.rollback();
        connection.release();
        throw err;
      }
    });
  } catch (error) {
    console.error('新增訂單時發生錯誤:', error);
    res.status(500).json({
      message: '無法新增訂單，請稍後再試。',
      error: error.message,
    });
  }
});

export default router;
