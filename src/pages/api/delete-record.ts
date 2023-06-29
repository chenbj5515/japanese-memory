// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import path from "path";
import fs from "fs";

const directoryPath = path.join(process.cwd(), "public", "uploads"); // 替换为实际的文件目录路径

export default async function handler(req: any, res: any) {
  const { prefix } = JSON.parse(req.body);
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    const matchingFiles = files.filter((file) => file.startsWith(prefix));
    if (matchingFiles.length === 1) {
      const filePath = path.join(directoryPath, matchingFiles[0]);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully.");
        }
      });
    }
    return res.status(200).json({ message: "文件删除成功" });
  });
}