const fs = require('fs')
const path = require('path')
const XLSX = require('xlsx')

const outDir = path.join(__dirname, '..', 'public', 'templates')
fs.mkdirSync(outDir, { recursive: true })

const rows = [
  ['학생명', '학생 전화', '학부모 전화', '학교', '학년'],
  ['홍길동', '010-1234-5678', '010-9876-5432', 'OO중학교', '중1'],
]
const ws = XLSX.utils.aoa_to_sheet(rows)
ws['!cols'] = [{ wch: 12 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 10 }]
const wb = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb, ws, '학생')
const outPath = path.join(outDir, 'student-template.xlsx')
XLSX.writeFile(wb, outPath)
console.log(outPath)
