import express from 'express'
import upload from './../utils/upload-imgs.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

// 資料庫直接使用mysql和sql來查詢
import db from '##/configs/mysql.js'
import uploadImgs from '##/utils/upload-imgs.js'

// GET - 得到所有資料
router.get('/', async function (req, res) {
  const conditions = []

  // 關鍵字 (查詢字串qs: name_like=sa)
  const name_like = req.query.name_like || ''
  conditions[0] = name_like ? `p_name LIKE '%${name_like}%'` : ''

  //國家分類
  const country = req.query.country ? req.query.country.split(',') : []
  conditions[1] =
    country.length > 0
      ? country.map((v) => `p_country = '${v}'`).join(` OR `)
      : ''

  //品種分類
  const breeds = req.query.breeds ? req.query.breeds.split(',') : []
  conditions[2] =
    breeds.length > 0 ? breeds.map((v) => `p_breed = '${v}'`).join(` OR `) : ''

  //處理法分類
  const process = req.query.process ? req.query.process.split(',') : []
  conditions[3] =
    process.length > 0
      ? process.map((v) => `p_process = '${v}'`).join(` OR `)
      : ''

  //烘焙法分類
  const roast = req.query.roast ? req.query.roast.split(',') : []
  conditions[4] =
    roast.length > 0 ? roast.map((v) => `p_roast = '${v}'`).join(` OR `) : ''

  // //大分類
  // const type = req.query.type ? req.query.type : []
  // conditions[6] = type.length > 0 ? type.map((v) => `p_type = '${v}'`) : ''

  //價格
  const price_gte = Number(req.query.price_gte) || 0 // 最小價格
  const price_lte = Number(req.query.price_lte) || 4000 // 最大價格
  conditions[5] = `p_discount BETWEEN ${price_gte} AND ${price_lte}`

  const cvs = conditions.filter((v) => v)
  const where =
    cvs.length > 0 ? 'WHERE' + cvs.map((v) => `(${v})`).join(`AND`) : ''

  //分類跟排序
  const sort = req.query.sort || 'p_id'
  const order = req.query.order || 'asc'

  const orderBy = `ORDER BY ${sort} ${order}`

  //分頁
  const page = Number(req.query.page) || 1
  const perpage = Number(req.query.perpage) || 16
  const limit = perpage
  const offset = (page - 1) * perpage

  const [rows] = await db.query(
    `SELECT * FROM product_list ${where} ${orderBy} LIMIT ${limit} OFFSET ${offset}`
  )

  const products = rows
  // 處理如果沒找到資料

  // 進行分頁時，額外執行sql在此條件下總共多少筆資料
  const [rows2] = await db.query(
    `SELECT COUNT(*) AS count FROM product_list ${where}`
  )
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
// 處理新增的資料項目

<<<<<<< HEAD
// GET - 得到所有資料
router.get('/sold', async function (req, res) {
  const [rows] = await db.query(
    `SELECT * FROM product_list ORDER BY p_sold DESC LIMIT 5`
  )

  const products = rows
  // 標準回傳JSON
  return res.json({
    status: 'success',
    data: {
      products,
    },
  })
})
// 處理新增的資料項目
=======
>>>>>>> yumi
router.post(
  '/api',
  upload.fields([
    { name: 'p_pic1', maxCount: 1 },
    { name: 'p_pic2', maxCount: 1 },
    { name: 'p_pic3', maxCount: 1 },
    { name: 'p_pic4', maxCount: 1 },
    { name: 'p_pic5', maxCount: 1 },
  ]),
  async (req, res) => {
    const output = {
      success: false,
      result: null,
      bodyData: req.body, // 除錯用
    }
    const data = { ...req.body } // 表單資料

    data.p_date = new Date()
    //console.log('upload', upload)
    //console.log('getFilename', upload.storage.filerename)
    if (req.files.p_pic1) {
      data.p_pic1 = req.files.p_pic1[0].filename
    }
    if (req.files.p_pic2) {
      data.p_pic2 = req.files.p_pic2[0].filename
    }
    if (req.files.p_pic3) {
      data.p_pic3 = req.files.p_pic3[0].filename
    }
    if (req.files.p_pic4) {
      data.p_pic4 = req.files.p_pic4[0].filename
    }
    if (req.files.p_pic5) {
      data.p_pic5 = req.files.p_pic5[0].filename
    }

    console.log('storage', upload.storage.filerename)
    console.log('多檔', req.files)

    const sql2 = 'INSERT INTO `product_list` SET ?'
    // INSERT, UPDATE 最好用 try/catch 做錯誤處理
    try {
      const [result] = await db.query(sql2, [data])
      output.success = !!result.affectedRows
      output.result = result
    } catch (ex) {
      output.error = ex
    }
    res.json(output)
  }
)
//刪除項目
router.delete('/api/:p_id', async (req, res) => {
  const output = {
    success: false,
    p_id: req.params.p_id,
    error: '',
  }
  const p_id = parseInt(req.params.p_id) || 0
  if (p_id) {
    // 除了 "讀取" 之外, 都應該要做錯誤處理
    try {
      const sql = `DELETE FROM product_list WHERE p_id=${p_id}`
      const [result] = await db.query(sql)
      output.success = !!result.affectedRows
    } catch (ex) {
      output.error = '可能因為外鍵限制, 無法刪除資料'
    }
  } else {
    output.error = '不合法的編號'
  }
  res.json(output)
})
//編輯當筆資料
router.get('/api/:p_id', async (req, res) => {
  const output = {
    success: false,
    data: {},
    error: '',
  }

  const p_id = parseInt(req.params.p_id) || 0
  if (!p_id) {
    output.error = 'PK 不正確'
    return res.json(output)
  }
  const sql = `SELECT * FROM product_list WHERE p_id=${p_id}`
  const [rows] = await db.query(sql)
  if (!rows.length) {
    // 沒有該筆資料
    return res.redirect('/product/backend')
  }
  const row = rows[0]
  output.data = row
  output.success = true // 表示有正常拿到資料
  console.log('output', output)
  return res.json(output)
})

//更新資料
router.put(
  '/api/:p_id',
  upload.fields([
    { name: 'p_pic1', maxCount: 1 },
    { name: 'p_pic2', maxCount: 1 },
    { name: 'p_pic3', maxCount: 1 },
    { name: 'p_pic4', maxCount: 1 },
    { name: 'p_pic5', maxCount: 1 },
  ]),
  async (req, res) => {
    const output = {
      success: false,
      p_id: req.params.p_id,
      result: null,
      bodyData: req.body, // 除錯用
    }
    const p_id = parseInt(req.params.p_id) || 0
    if (!p_id) {
      output.error = '無此編號'
      return res.json(output)
    }
    const data = { ...req.body } // 表單資料
    console.log('資料', data)

    data.p_date = new Date()
    //console.log('upload', upload)
    //console.log('getFilename', upload.storage.filerename)
    if (req.files.p_pic1) {
      data.p_pic1 = req.files.p_pic1[0].filename
    }
    if (req.files.p_pic2) {
      data.p_pic2 = req.files.p_pic2[0].filename
    }
    if (req.files.p_pic3) {
      data.p_pic3 = req.files.p_pic3[0].filename
    }
    if (req.files.p_pic4) {
      data.p_pic4 = req.files.p_pic4[0].filename
    }
    if (req.files.p_pic5) {
      data.p_pic5 = req.files.p_pic5[0].filename
    }

    console.log('storage', upload.storage.filerename)
    console.log('多檔', req.files)

    const sql2 = 'UPDATE `product_list` SET ? WHERE p_id = ?'
    // INSERT, UPDATE 最好用 try/catch 做錯誤處理
    try {
      const [result] = await db.query(sql2, [data, p_id])
      output.success = !!(result.affectedRows && result.changedRows)
      output.result = result
    } catch (ex) {
      output.error = ex
    }
    res.json(output)
  }
)
// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)

  try {
    const [rows] = await db.query(`SELECT * FROM product_list WHERE p_id = ?`, [
      id,
    ])
    const product = rows[0]
    console.log(product)
    return res.json({ status: 'success', data: { product } })
  } catch (e) {
    return res.json({
      status: 'error',
      message: '找不到資料',
    })
  }
})

// GET - 得到分類資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/type/:type', async function (req, res) {
  const type = String(req.params.type)
  const conditions = []

  // 關鍵字 (查詢字串qs: name_like=sa)
  const name_like = req.query.name_like || ''
  conditions[0] = name_like ? `p_name LIKE '%${name_like}%'` : ''

  //國家分類
  const country = req.query.country ? req.query.country.split(',') : []
  conditions[1] =
    country.length > 0
      ? country.map((v) => `p_country = '${v}'`).join(` OR `)
      : ''

  //品種分類
  const breeds = req.query.breeds ? req.query.breeds.split(',') : []
  conditions[2] =
    breeds.length > 0 ? breeds.map((v) => `p_breed = '${v}'`).join(` OR `) : ''

  //處理法分類
  const process = req.query.process ? req.query.process.split(',') : []
  conditions[3] =
    process.length > 0
      ? process.map((v) => `p_process = '${v}'`).join(` OR `)
      : ''

  //烘焙法分類
  const roast = req.query.roast ? req.query.roast.split(',') : []
  conditions[4] =
    roast.length > 0 ? roast.map((v) => `p_roast = '${v}'`).join(` OR `) : ''

  //價格
  const price_gte = Number(req.query.price_gte) || 0 // 最小價格
  const price_lte = Number(req.query.price_lte) || 4000 // 最大價格
  conditions[5] = `p_discount BETWEEN ${price_gte} AND ${price_lte}`

  const cvs = conditions.filter((v) => v)
  const where =
    cvs.length > 0 ? 'WHERE ' + cvs.map((v) => `(${v})`).join(`AND`) : ''

  //分類跟排序
  const sort = req.query.sort || 'p_id'
  const order = req.query.order || 'asc'

  const orderBy = `ORDER BY ${sort} ${order}`
  //分頁
  const page = Number(req.query.page) || 1
  const perpage = Number(req.query.perpage) || 16
  const limit = perpage
  const offset = (page - 1) * perpage

  const [rows] = await db.query(
    `SELECT * FROM product_list ${where} && p_type = ? ${orderBy} LIMIT ${limit} OFFSET ${offset}`,
    [type]
  )

  const products = rows
  // 處理如果沒找到資料

  // 進行分頁時，額外執行sql在此條件下總共多少筆資料
  const [rows2] = await db.query(
    `SELECT COUNT(*) AS count FROM product_list ${where} && p_type=?`,
    [type]
  )
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

router.post('/login-jwt', async (req, res) => {
  const output = {
    success: false,
    error: '',
    code: 0,
    data: {
      id: 0,
      account: '',
      nickname: '',
      token: '',
    },
  }

  let { account, password } = req.body || {}
  account = account.trim() // 去頭尾空白
  password = password.trim() // 去頭尾空白
  // 1. 先判斷有沒有資料
  if (!account || !password) {
    output.error = '欄位資料不足'
    return res.json(output)
  }

  const sql = 'SELECT * FROM admins WHERE account =?'
  const [rows] = await db.query(sql, [account])
  // 2. 沒有這個帳號
  if (!rows.length) {
    output.error = '帳號或密碼錯誤'
    output.code = 400
    return res.json(output)
  }
  const row = rows[0]

  // 3. 比對密碼

  const result = await bcrypt.compare(password, row.password)

  console.log('result', result)

  if (result) {
    // 帳密都對
    const data = {
      id: row.id,
      account: row.account,
    }
    const token = jwt.sign(data, process.env.JWT_SECRET)
    output.data = {
      id: row.id,
      account: row.account,
      nickname: row.nickname,
      token,
    }
    output.success = true
  } else {
    // 密碼是錯的
    output.error = '帳號或密碼錯誤'
    output.code = 450
    console.log('output2', output)
  }
  res.json(output)
})

export default router
