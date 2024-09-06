import express, { application } from 'express'
import db from '##/configs/mysql.js'
const router = express.Router()

/* GET home page. */
router.get('/', async function (req, res, next) {
  const [rows] = await db.query('SELECT * FROM product_list')
  const product = rows

  return res.json({ status: 'success', data: { product } })
})

export default router
