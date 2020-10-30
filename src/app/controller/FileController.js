// codigo rocketseat:  https://github.com/rocketseat-content/youtube-upload-nodejs-reactjs-backend
// youtube:  https://www.youtube.com/watch?v=MkkbUfcZUZM&t=1661s&ab_channel=Rocketseat
const fileModel = require('../model/File');
const userModel = require('../model/User');

class FileController {
  async store(req, res) {

    if (!req.file) return res.json(null);

    const { originalname: name, size, key, location: url = '' } = req.file;
    const file = await fileModel({ name, size, key, url }).save();

    return res.json(file);
  };

  async update(req, res) {

    if (!req.file) return res.json(null);

    const { originalname: name, key, size, location: url = '' } = req.file;
    const file = await fileModel.findByIdAndUpdate(req.params.id, { name, key,size, url }, { new: true });

    return res.json(file);
  };

  async delete(req, res) {

    if (!req.file) return res.json(null);

    const file = await fileModel.findById(req.params.id);

    await file.remove();

    return res.send();
  }
}

module.exports = new FileController();