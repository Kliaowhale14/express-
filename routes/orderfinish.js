import express from 'express'
import db from '##/configs/mysql.js' // 引入資料庫配置
const router = express.Router()

/* GET finish order */

router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)

  try {
    const [rows] = await db.query(
      'SELECT * FROM orderlist WHERE orderlist_id = ?',
      [id]
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

export default router
