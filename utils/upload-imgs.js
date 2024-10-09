import multer from 'multer'
import { v4 } from 'uuid'

// 篩選檔案和決定副檔名
const extMap = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
}

// fileFilter 篩選檔案
const fileFilter = (req, file, callback) => {
  // 錯誤先行: 第一個參數是丟錯誤
  // 第二個參數是布林值, 這個檔案要 (true) 還是不要 (false)
  callback(null, !!extMap[file.mimetype])
}

// storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //console.log('destination file', file)
    cb(null, 'public/img')
  },
  filename: (req, file, cb) => {
    //console.log('filename file', file)
    const f = v4() // 主檔名
    const ext = extMap[file.mimetype] // 副檔名

    cb(null, f + ext)
  },
})

export default multer({ fileFilter, storage })
