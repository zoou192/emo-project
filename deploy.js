import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// 确保dist目录存在
if (!fs.existsSync('dist')) {
  console.error('dist目录不存在，请先运行 npm run build')
  process.exit(1)
}

// 复制必要的文件到dist目录
const filesToCopy = [
  'public',
  'server'
]

filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    const dest = path.join('dist', file)
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true, force: true })
    }
    fs.cpSync(file, dest, { recursive: true })
  }
})

// 创建.env文件
const envContent = `VITE_API_BASE_URL=https://aigc.sankuai.com
VITE_APP_ID=申请的AppId`

fs.writeFileSync(path.join('dist', '.env'), envContent)

console.log('部署文件准备完成！')
console.log('请将dist目录下的文件上传到您的服务器。') 