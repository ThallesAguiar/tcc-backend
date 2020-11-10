const addressModel = require('../model/Address');
const userModel = require('../model/User');

class CoordinatesController {
    async update(req, res) {
        const { lat, lng } = req.body;

        if (!lat || !lng) return res.status(400).json({ error: 'Coordinates fails' });
        if (!req.params.id) return res.status(400).json({ error: 'User not exists' });

        const { id_address } = await userModel.findById(req.params.id);

        if (!id_address) {
            const address = await addressModel({ lat, lng }).save();
            await userModel.findByIdAndUpdate(req.params.id, { id_address: address._id }, { new: true });
            return res.json({ lat, lng });
        }

        await addressModel.findByIdAndUpdate(id_address, { lat, lng }, { new: true });

        return res.json({ lat, lng });

    }
}

module.exports = new CoordinatesController();