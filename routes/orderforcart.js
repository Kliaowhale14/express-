import express from 'express'
const router = express.Router()
import db from '#configs/db.js'

const { orderlist } = db.models
let orders = []
router.post('/api/order', async function (req, res) {
  const { items, totalQty, totalPrice, shippingMethod, totalWithShipping } =
    req.body // 從請求體中獲取資料
  const cmd = "INSERT INTO orderlist (order_id, column2, column3, ...)
VALUES (value1, value2, value3, ...);"

  return res.json(orders)
})
export default router
