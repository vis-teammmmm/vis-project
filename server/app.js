const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const uploadDir = 'uploads/';
//const Papa = require('papaparse');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

const { exec } = require('child_process');
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send({ message: '请上传文件' });
    }
    const filePath = file.path; // 获取文件路径

    // 调用 Python 脚本并传递文件路径
    exec(`python clean.py "${filePath}"`, (error, stdout) => {
        if (error) {
            console.error('执行出错:', error);
            return res.status(500).send({ message: '数据处理失败' });
        }
        const outputPath = stdout.trim();
        fs.readFile(outputPath, 'utf8', (err, data) => {
            if (err) {
                console.error('读取结果文件失败:', err);
                return res.status(500).send({ message: '读取结果文件失败' });
            }
            const arrayData = jsonToArray(JSON.parse(data));
            res.send({ message: '数据处理成功', data: arrayData });
        });
    });
});



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

function jsonToArray(jsonData) {
    // 检查输入是否为空
    if (!jsonData.length) return [];

    // 获取键名作为表头
    const headers = Object.keys(jsonData[0]);

    // 初始化结果数组，并将表头作为第一行
    const result = [headers];

    // 遍历 JSON 数据，将每个对象的值转换为数组并添加到结果数组
    jsonData.forEach(item => {
        const row = headers.map(header => item[header]);
        result.push(row);
    });

    return result;
}

// const arrayData = jsonToArray(jsonData);
// console.log('source:', arrayData);