import express from 'express'
const router = express.Router()

/* POST finish order */
router.post('/', (req, res) => {
  // 假設綠界回傳的訂單編號、總金額、商品數量、商品內容等資訊
  const orderlist_id = req.body.MerchantTradeNo // 綠界傳回的訂單編號
  const totalAmount = req.body.TotalAmount // 綠界傳回的訂單總金額
  const itemQty = req.body.ItemQty // 綠界傳回的商品數量
  const orderItem = req.body.ItemName // 綠界傳回的商品名稱

  // 將這些資訊導向前端成功頁面，並將訂單資訊附加到 URL 中
  res.redirect(
    `http://localhost:3000/addcart/finishorder?amount=${totalAmount}&orderlist_id=${orderlist_id}&item_qty=${itemQty}&order_item=${orderItem}`
  )
})

export default router
