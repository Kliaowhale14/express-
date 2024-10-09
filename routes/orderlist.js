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
  const [rows2] = await db.query(`SELECT COUNT(*) AS count FROM orderlist`)
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

// // GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
// router.get('/:id', async function (req, res) {
//   // 轉為數字
//   const id = Number(req.params.id)

//   try {
//     const [rows] = await db.query(
//       'SELECT * FROM orderlist WHERE orderlist_id = ?',
//       [id]
//     )
//     const orderlist = rows[0]

//     return res.json({ status: 'success', data: { orderlist } })
//   } catch (e) {
//     return res.json({
//       status: 'error',
//       message: '找不到資料',
//     })
//   }
// })

export default router
