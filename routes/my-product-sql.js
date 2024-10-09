import express from 'express'
const router = express.Router()

// 資料庫直接使用mysql和sql來查詢
import db from '##/configs/mysql.js'
// GET - 得到所有資料
//變數.方法('路徑',(req,res){函式內容}
router.get('/', async function (req, res) {
  // where條件 ---- START
  const conditions = []

  // 關鍵字 (查詢字串qs: name_like=sa)
  const name_like = req.query.name_like || ''
  conditions[0] = name_like ? `name LIKE '%${name_like}%'` : ''

  // 品牌 複選 (查詢字串QS: brands=Apple,Google)
  const brands = req.query.brands ? req.query.brands.split(',') : []
  conditions[1] =
    brands.length > 0 ? brands.map((v) => `brand = '${v}'`).join(` OR `) : ''

  // 價格, 5000~150000 (查詢字串QS: price_gte=5000&price_lte=15000)
  const price_gte = Number(req.query.price_gte) || 0 // 最小價格
  const price_lte = Number(req.query.price_lte) || 20000 // 最大價格
  conditions[2] = `price BETWEEN ${price_gte} AND ${price_lte}`

  // 以下開始組合where從句
  // 1. 過濾有空白條件情況
  const cvs = conditions.filter((v) => v)
  // 2. 用AND來串接所有條件(注意csv中如果是空陣列時不要套用where)
  const where =
    cvs.length > 0 ? 'WHERE ' + cvs.map((v) => `( ${v} )`).join(` AND `) : ''

  // where條件 ---- END

  // 排序，例如價格由低到高 (查詢字串qs: sort=price&order=asc) (順向asc，逆向desc)
  const sort = req.query.sort || 'id' // 預設的排序資料表欄位
  const order = req.query.order || 'asc' //預設使用順向 asc (1234..)

  // 建立sql從句字串
  const orderBy = `ORDER BY ${sort} ${order}`

  // 分頁 (查詢字串qs: page=2&perpage=5) (目前第page頁，每頁perpage筆資料)
  // 公式: limit = perpage
  //      offset = (page-1) * perpage
  const page = Number(req.query.page) || 1 // page 預設為 1
  const perpage = Number(req.query.perpage) || 10 // perpage 預設為 10
  const limit = perpage
  const offset = (page - 1) * perpage

  // 查詢到這頁的資料
  // sql套用的順序: [where] [orderby] [limit+offset]
  const [rows] = await db.query(
    `SELECT * FROM my_product ${where} ${orderBy} LIMIT ${limit} OFFSET ${offset}`
  )
  const products = rows

  // 進行分頁時，額外執行sql在此條件下總共多少筆資料
  const [rows2] = await db.query(
    `SELECT COUNT(*) AS count FROM my_product ${where}`
  )
  const { count } = rows2[0]
  // 計算總頁數
  const pageCount = Math.ceil(count / perpage)

  // 標準回傳JSON
  return res.json({
    status: 'success',
    data: {
      total: count, // 總筆數
      pageCount, // 總頁數
      page, // 目前頁
      perpage, // 每頁筆數
      products,
    },
  })
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)

  try {
    const [rows] = await db.query('SELECT * FROM my_product WHERE id = ?', [id])
    const product = rows[0]

    return res.json({ status: 'success', data: { product } })
  } catch (e) {
    return res.json({
      status: 'error',
      message: '找不到資料',
    })
  }
})

export default router
