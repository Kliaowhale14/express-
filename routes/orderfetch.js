import express from 'express'
const router = express.Router()
import db from '##/configs/mysql.js' // 假設你的資料庫連線在這裡配置

router.post('/', async (req, res) => {
  const {
    order_date = new Date().toISOString().split('T')[0], // 格式化為日期型別
    member_id = 0,
    send_id = 0,
    send_tax = 0,
    total_price = 0,
    order_status = '包貨中',
    pay_id = 0, // 新增的 pay_id
    pay_ornot = '', //默認狀態
    recipient_address = '',
    mobile = '',
    email = '',
    remark = '',
    member_name = '',
    order_detail = {}, // 來自前端的 order_detail 資料
  } = req.body

  const {
    create_date = order_date,
    order_item,
    item_qty,
    pay_way,
    send_way,
    price,
  } = order_detail

  let connection
  try {
    connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      // 1. 插入到 orderlist 表
      const insertOrderlistQuery = `
        INSERT INTO orderlist 
        (order_date, member_id, send_id, send_tax, total_price, order_status, pay_id, recipient_address, mobile, email, remark ,member_name, pay_ornot) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      const orderlistValues = [
        order_date,
        member_id,
        send_id,
        send_tax,
        total_price,
        order_status,
        pay_id,
        recipient_address,
        mobile,
        email,
        remark,
        member_name,
        pay_ornot,
      ]

      const [orderlistResult] = await connection.execute(
        insertOrderlistQuery,
        orderlistValues
      )

      const orderlist_id = orderlistResult.insertId // 獲取剛插入的 orderlist_id

      // 2. 插入到 order_detail 表，將 orderlist_id 設置為剛插入的 orderlist_id
      const insertOrderDetailQuery = `
        INSERT INTO order_detail
        (create_date, order_item, item_qty, pay_way, send_id, send_way, send_tax, price, recipient_address, orderlist_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      const orderDetailValues = [
        create_date,
        order_item,
        item_qty,
        pay_way,
        send_id,
        send_way,
        send_tax,
        price,
        recipient_address,
        orderlist_id, // 設置 orderlist_id 作為外鍵
      ]

      const [orderDetailResult] = await connection.execute(
        insertOrderDetailQuery,
        orderDetailValues
      )

      const order_detail_id = orderDetailResult.insertId // 獲取剛插入的 order_detail_id

      // 更新 orderlist 表，將 order_detail_id 存入
      const updateOrderlistQuery = `
        UPDATE orderlist 
        SET order_detail_id = ? 
        WHERE orderlist_id = ?
      `
      await connection.execute(updateOrderlistQuery, [
        order_detail_id,
        orderlist_id,
      ])

      await connection.commit()
      res.status(201).json({
        message: '訂單與訂單詳細已成功新增到資料庫！',
        orderlistId: orderlist_id, // 可以返回剛插入的 orderlist_id
        orderdetailId: order_detail_id, // 返回 order_detail_id
      })
    } catch (err) {
      await connection.rollback()
      throw err
    }
  } catch (error) {
    console.error('新增訂單時發生錯誤:', error)
    res.status(500).json({
      message: '無法新增訂單，請稍後再試。',
      error: error.message,
    })
  } finally {
    if (connection) connection.release()
  }
})

export default router
