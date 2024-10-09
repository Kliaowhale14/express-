import express from 'express'
const router = express.Router()

// 資料庫直接使用mysql和sql來查詢
import db from '##/configs/mysql.js'

// GET - 得到所有資料
router.get('/', async function (req, res) {
  const conditions = []

  // 關鍵字 (查詢字串qs: name_like=sa)
  const cart_id = req.query.name_like || ''
  conditions[0] = cart_id ? `cart_id LIKE '%${cart_id}%'` : ''

  //會員ID
  const menber_id = req.query.menber_id || ''
  conditions[0] = menber_id ? `menber_id Like '%${menber_id}%'` : ''

  //   //國家分類
  //   const country = req.query.country ? req.query.country.split(',') : []
  //   conditions[1] =
  //     country.length > 0
  //       ? country.map((v) => `p_country = '${v}'`).join(` OR `)
  //       : ''

  //   //品種分類
  //   const breeds = req.query.breeds ? req.query.breeds.split(',') : []
  //   conditions[2] =
  //     breeds.length > 0 ? breeds.map((v) => `p_breed = '${v}'`).join(` OR `) : ''

  //   //處理法分類
  //   const process = req.query.process ? req.query.process.split(',') : []
  //   conditions[3] =
  //     process.length > 0
  //       ? process.map((v) => `p_process = '${v}'`).join(` OR `)
  //       : ''

  //   //烘焙法
  //   const roast = req.query.roast ? req.query.roast.split(',') : []
  //   conditions[4] =
  //     roast.length > 0 ? roast.map((v) => `p_roast = '${v}'`).join(` OR `) : ''

  //價格
  const price_gte = Number(req.query.price_gte) || 0 // 最小價格
  const price_lte = Number(req.query.price_lte) || 4000 // 最大價格
  conditions[5] = `p_discount BETWEEN ${price_gte} AND ${price_lte}`

  const cvs = conditions.filter((v) => v)
  const where =
    cvs.length > 0 ? 'WHERE' + cvs.map((v) => `(${v})`).join(`AND`) : ''

  //分類跟排序
  const sort = req.query.sort || 'cart_id'
  const order = req.query.order || 'asc'

  const orderBy = `ORDER BY ${sort} ${order}`
  //分頁
  const page = Number(req.query.page) || 1
  const perpage = Number(req.query.perpage) || 15
  const limit = perpage
  const offset = (page - 1) * perpage

  const [rows] = await db.query(
    `SELECT * FROM addcart ${where} ${orderBy} LIMIT ${limit} OFFSET ${offset}`
  )

  const products = rows
  // 處理如果沒找到資料

  // 進行分頁時，額外執行sql在此條件下總共多少筆資料
  const [rows2] = await db.query(`SELECT COUNT(*) AS count FROM addcart`)
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
      products,
    },
  })
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)

  try {
    const [rows] = await db.query('SELECT * FROM addcart WHERE cart_id = ?', [
      id,
    ])
    const cart = rows[0]

    return res.json({ status: 'success', data: { cart } })
  } catch (e) {
    return res.json({
      status: 'error',
      message: '找不到資料',
    })
  }
})

export default router
