// 引入必要的模組
import fs from 'fs'
import path from 'path'

// API 處理器來更新會員資料
export default function handler(req, res) {
  if (req.method === 'POST') {
    const updatedMember = req.body

    // 獲取 JSON 文件的路徑
    const membersFilePath = path.join(process.cwd(), 'public', 'member.json')

    // 讀取當前的 JSON 文件
    fs.promises
      .readFile(membersFilePath, 'utf8')
      .then((data) => {
        let members = JSON.parse(data)
        const memberIndex = members.findIndex(
          (member) => member.member_id === updatedMember.member_id
        )

        if (memberIndex === -1) {
          // 如果找不到，新增會員資料
          members.push(updatedMember)
        } else {
          // 如果找到，則更新會員資料
          members[memberIndex] = updatedMember
        }

        // 將更新後的資料寫入 JSON 文件
        return fs.promises.writeFile(
          membersFilePath,
          JSON.stringify(members, null, 2)
        )
      })
      .then(() => {
        res.status(200).json({ message: '更新成功' })
      })
      .catch((err) => {
        console.error('Error handling member file:', err)
        res.status(500).json({ message: '操作失敗' })
      })
  } else {
    res.status(405).json({ message: '只允許 POST 請求' })
  }
}
