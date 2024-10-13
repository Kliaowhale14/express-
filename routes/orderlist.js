import express from 'express'
const router = express.Router()

// 資料庫直接使用mysql和sql來查詢
import db from '##/configs/mysql.js'

// GET - 得到所有資料
router.get('/', async function (req, res) {
  const conditions = []

  // 關鍵字 (查詢字串qs: name_like=sa)
  const orderlist_id = req.query.name_like || ''
  conditions[0] = orderlist_id ? `orderlist_id LIKE '%${orderlist_id}%'` : ''

  const menber_id = req.query.menber_id || ''
  conditions[0] = menber_id ? `menber_id Like '%${menber_id}%'` : ''

  const cvs = conditions.filter((v) => v)
  const where =
    cvs.length > 0 ? 'WHERE' + cvs.map((v) => `(${v})`).join(`AND`) : ''

  //分類跟排序
  const sort = req.query.sort || 'orderlist_id'
  const order = req.query.order || 'asc'

  const orderBy = `ORDER BY ${sort} ${order}`
  //分頁
  const page = Number(req.query.page) || 1
  const perpage = Number(req.query.perpage) || 15
  const limit = perpage
  const offset = (page - 1) * perpage

  const [rows] = await db.query(
    `SELECT * FROM orderlist ${where} ${orderBy} LIMIT ${limit} OFFSET ${offset}`
  )

  const Orderlist = rows
  // 處理如果沒找到資料

  // 進行分頁時，額外執行sql在此條件下總共多少筆資料
  const [rows2] = await db.query(`SELECT COUNT(*) AS count FROM orderlist `)
  const { count } = rows2[0]
  // 計算總頁數
  const pageCount = Math.ceil(count / perpage)
  // 標準回傳JSON
  return res.json({
    status: 'success',
    data: {
      total: count,
      pageCount,
      page,
      perpage,
      Orderlist,
    },
  })
})

// DELETE - 根據訂單 ID 刪除訂單
router.delete('/:id', async function (req, res) {
  const orderId = req.params.id

  try {
    // 刪除該訂單
    const [result] = await db.query(
      `DELETE FROM orderlist WHERE orderlist_id = ?`,
      [orderId]
    )

    if (result.affectedRows > 0) {
      return res.json({ status: 'success', message: '訂單已成功刪除' })
    } else {
      return res.status(404).json({ status: 'error', message: '訂單不存在' })
    }
  } catch (error) {
    console.error('刪除訂單錯誤:', error)
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

// 獲取指定訂單資料
router.get('/:id/get', async function (req, res) {
  try {
    const orderlist_id = Number(req.params.id)

    // 使用提供的訂單編號查詢資料庫
    const [rows] = await db.query(
   `SELECT * FROM orderlist ORDER BY orderlist_id DESC LIMIT 1`
    )
    const orderlist = rows[0]

    return res.json({ status: 'success', data: { orderlist } })
  } catch (e) {
    return res.json({
      status: 'error',
      message: '找不到資料',
    })
  }
})

// PUT - 更新訂單
router.put('/:id/up', async function (req, res) {
  const orderlist_id = req.params.id;
  const {
    order_date,
    member_id,
    member_name,
    pay_ornot,
    pay_id,
    send_id,
    send_tax,
    total_price,
    order_status,
    recipient_address,
    order_detail_id,
  } = req.body;

  // 驗證必需的欄位
  if (!order_date) {
    return res.status(400).json({ status: 'error', message: '缺少必要的欄位' });
  }

  try {
    const [result] = await db.query(
      `UPDATE orderlist SET 
      order_date = ?, 
      member_id = ?, 
      member_name = ?, 
      pay_ornot = ?, 
      pay_id = ?, 
      send_id = ?, 
      send_tax = ?, 
      total_price = ?, 
      order_status = ?, 
      recipient_address = ?, 
      order_detail_id = ? 
      WHERE orderlist_id = ?`,
      [
        order_date,
        member_id,
        member_name,
        pay_ornot,
        pay_id,
        send_id,
        send_tax,
        total_price,
        order_status,
        recipient_address,
        order_detail_id,
        orderlist_id,
      ]
    );

    if (result.affectedRows > 0) {
      return res.json({ status: 'success', message: '訂單已成功更新' });
    } else {
      return res.status(404).json({ status: 'error', message: '訂單不存在' });
    }
  } catch (error) {
    console.error('更新訂單錯誤:', error.message); // 更詳細的錯誤訊息
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' });
  }
});


export default router
