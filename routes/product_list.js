import express from 'express'
const router = express.Router()

// 資料庫直接使用mysql和sql來查詢
import db from '##/configs/mysql.js'

// GET - 得到所有資料
router.get('/', async function (req, res) {
  const conditions = []

  // 關鍵字 (查詢字串qs: name_like=sa)
  const name_like = req.query.name_like || ''
  conditions[0] = name_like ? `p_name LIKE '%${name_like}%'` : ''

  const cvs = conditions.filter((v) => v)
  const where =
    cvs.length > 0 ? 'WHERE' + cvs.map((v) => `(${v})`).join(`AND`) : ''

  const sort = req.query.sort || 'p_id'
  const order = req.query.order || 'asc'

  const orderBy = `ORDER BY ${sort} ${order}`

  const page = Number(req.query.page) || 1
  const perpage = Number(req.query.perpage) || 15
  const limit = perpage
  const offset = (page - 1) * perpage

  const [rows] = await db.query(
    `SELECT * FROM product_list ${where} ${orderBy} LIMIT ${limit} OFFSET ${offset}`
  )

  const products = rows
  // 處理如果沒找到資料

  const [rows2] = await db.query(
    `SELECT COUNT(*) AS count FROM product_list LIMIT ${limit} OFFSET ${offset}`
  )
  const { count } = rows2[0]
  const pageCount = Math.ceil(count / perpage)
  // 標準回傳JSON
  return res.json({
    status: 'success',
    data: {
      total: count,
      pageCount,
      page,
      perpage,
      products,
    },
  })
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)

  const [rows] = await db.query('SELECT * FROM product_list WHERE p_id = ?', [
    id,
  ])
  const product = rows[0]

  return res.json({ status: 'success', data: { product } })
})

export default router
