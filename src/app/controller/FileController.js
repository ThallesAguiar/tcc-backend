const fileModel = require('../model/File');
const userModel = require('../model/User');

class FileController {
    async store(req, res) {

        if(!req.file) return res.json(null);

        const { originalname: name, filename: path } = req.file;
        
        const file = await fileModel({ name, path }).save();

        return res.json(file);
    };

    async update(req, res) {

        if(!req.file) return res.json(null);
        
        const { originalname: name, filename: path } = req.file;
        
        const {id_avatar} = await userModel.findById(req.userId);

        const file = await fileModel.findByIdAndUpdate(id_avatar, {name,path},{ new: true });

        return res.json(file);
    }
}

module.exports = new FileController();