import formidable from "formidable";
import { Storage } from "@google-cloud/storage";
import fs from "fs";

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});
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

    file.save(audioBuffer, {
      public: true,
      resumable: false,
      metadata: {
        contentType: "audio/mp3",
      },
    }).then(() => res.status(200).json({ message: "文件上传成功" }))
    .catch(err => res.status(200).json({ err }))
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
