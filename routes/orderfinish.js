import express from 'express'
const router = express.Router()

/* POST finish order */
router.post('/', (req, res) => {
  const orderlist_id = req.body.MerchantTradeNo // 訂單編號
  const totalAmount = req.body.TotalAmount // 總金額
  const itemQty = req.body.ItemQty // 商品數量
  const orderItem = req.body.ItemName // 商品內容

  // 返回 JSON 格式的資料
  res.json({
    status: 'success',
    data: {
      orderlist_id,
      totalAmount,
      itemQty,
      orderItem,
    },
  })
})

export default router
