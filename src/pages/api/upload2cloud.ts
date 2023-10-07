import formidable from "formidable";
import { Storage } from "@google-cloud/storage";
import fs from "fs";

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  // keyFilename: 'public/assets/upbeat-cargo-361203-a3f7b5c84402.json',
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});
// const bucket = storage.bucket(process.env.NEXT_PUBLIC_GOOGLE_CLOUD_BUKET!);
// const storage = new Storage();
const bucket = storage.bucket(process.env.NEXT_PUBLIC_GOOGLE_CLOUD_BUKET!);

// 在这里可以使用 storage 客户端进行 Google Cloud Storage 操作
export default async function handler(req: any, res: any) {
  const form = formidable({ multiples: false });
  form.parse(req, (err: any, fields: any, files: any) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    // 检查是否存在名为 "audio" 的文件字段
    if (!files.audio) {
      res.status(400).send('Missing audio file');
      return;
    }

    // 将文件转换为 Buffer 类型
    const {filepath, originalFilename} = files.audio[0];
    const audioBuffer = Buffer.from(fs.readFileSync(filepath));
    const file = bucket.file(originalFilename);

    // file.save(audioBuffer, {
    //   public: true,
    //   resumable: false,
    //   metadata: {
    //     contentType: "audio/aac",
    //   },
    // }).then(() => res.status(200).json({ message: "文件上传成功" }))
    // .catch(err => res.status(200).json({ err }))

    // 创建一个可以写入的流
    const writeStream = file.createWriteStream({
      metadata: {
        // 设置文件的元数据（可选）
        contentType: "audio/aac",
      },
      // 公开文件（如果你的bucket设置为公开的，这将是不必要的）
      // public: true,
    });

    // 将Buffer数据写入流中
    writeStream.end(audioBuffer);

    writeStream.on('error', err => {
      res.status(500).json({ err })
    });
    writeStream.on('finish', () => {
      res.status(200).json({ message: "文件上传成功" })
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
