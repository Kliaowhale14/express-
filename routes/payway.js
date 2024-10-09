import express from 'express'
const router = express.Router()

// 資料庫直接使用mysql和sql來查詢
import db from '##/configs/mysql.js'

// GET - 得到所有資料
router.get('/', async function (req, res) {
  const conditions = []

  const cvs = conditions.filter((v) => v)
  const where =
    cvs.length > 0 ? 'WHERE' + cvs.map((v) => `(${v})`).join(`AND`) : ''

  //分類跟排序
  const sort = req.query.sort || 'pay_id'
  const pay = req.query.pay || 'asc'

  const payBy = `ORDER BY ${sort} ${pay}`
  //分頁
  const page = Number(req.query.page) || 1
  const perpage = Number(req.query.perpage) || 15
  const limit = perpage
  const offset = (page - 1) * perpage

  const [rows] = await db.query(
    `SELECT * FROM pay_way ${where} ${payBy} LIMIT ${limit} OFFSET ${offset}`
  )

  const payway = rows
  // 處理如果沒找到資料

  // 進行分頁時，額外執行sql在此條件下總共多少筆資料
  const [rows2] = await db.query(`SELECT COUNT(*) AS count FROM pay_way`)
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
      payway,
    },
  })
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)

  try {
    const [rows] = await db.query('SELECT * FROM pay_way WHERE pay_id = ?', [
      id,
    ])
    const payway = rows[0]

    return res.json({ status: 'success', data: { payway } })
  } catch (e) {
    return res.json({
      status: 'error',
      message: '找不到資料',
    })
  }
})

export default router
