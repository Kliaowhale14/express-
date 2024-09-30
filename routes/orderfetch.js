// 在 routes/orderforcart.js 中創建新的路由檔案

import express from 'express'
const router = express.Router()
import db from '##/configs/mysql.js'

// 處理前端的 POST 請求
router.post('/', async (req, res) => {
  const {
    order_date,
    number_id,
    pay_ornot,
    pay_id,
    send_tax,
    total_price,
    order_status,
    recipient_address,
    order_detail_id,
  } = req.body

  // 回應前端，表示資料已成功接收
  res.status(200).json({
    message: '後端已經成功接收到訂單！',
    orderData: {
      order_date,
      number_id,
      pay_ornot,
      pay_id,
      send_tax,
      total_price,
      order_status,
      recipient_address,
      order_detail_id,
    },
  })
})

export default router
