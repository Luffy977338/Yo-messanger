const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

class FileService {
  saveFile(file) {
    try {
      if (file) {
        const fileName = uuid.v4() + ".jpg";
        const filePath = path.resolve("images", fileName);
        file.mv(filePath);
        return fileName;
      }
    } catch (e) {
      throw e;
    }
  }

  deleteFile(fileName) {
    try {
      if (fileName) {
        const filePath = path.resolve("images", fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (e) {
      throw e;
    }
  }
}

module.exports = new FileService();
