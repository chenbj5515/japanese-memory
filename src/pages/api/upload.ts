import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename(req: any, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage }).single("audio");

export default async function handler(req: any, res: any) {
  upload(req, res, (error: any) => {
    if (error) {
      console.error("文件上传失败：", error);
      return res.status(500).json({ error: "文件上传失败" });
    }
    console.log("sucess");

    return res.status(200).json({ message: "文件上传成功" });
  });

}

export const config = {
  api: {
    bodyParser: false,
  },
};
