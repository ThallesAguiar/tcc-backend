const userModel = require('../model/User');
const bcrypt = require('bcryptjs');
const Yup = require('yup');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

class UserController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6)
        })
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const userExists = await userModel.findOne({ email: req.body.email });

        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }

        //criptografa a senha 
        req.body.password = await bcrypt.hash(req.body.password, 10);

        const { _id, name, email, provider } = await userModel(req.body).save();

        return res.json({
            user: {
                _id,
                name,
                email,
                provider
            },
            token: jwt.sign(
                // 1º, é o payload
                { _id },
                // 2º, segredo para essa assinatura (uma string)
                process.env.AUTH_SECRET,
                // 3º, não obrigatório, a configuração para o jwt
                { expiresIn: authConfig.expiresIn }
            )
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string().min(6).when('oldPassword', (oldPassword, field) => oldPassword ? field.required() : field),
            // com o WHEN consigo ter acesso a todos os campos do Yup(schema). É uma função condicional
            // No 1º parametro é qual variavel eu quero acessar,
            // No 2º ele recebe uma função, que recebe o valor da variavel oldPassword, e o field que seria a continuação da validação do password do schema
            confirmPassword: Yup.string().when('password', (password, field) => password ? field.required().oneOf([Yup.ref('password')]) : field)
            // confirma se as senhas são iguais. ref faz referencia a variavel password
        })
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { email, oldPassword } = req.body

        // const user = await userModel.findById("5f5b801e13e7390f64b8c39b")
        const user = await userModel.findById(req.userId)

        if (email !== user.email) {
            const userExists = await userModel.findOne({ email: req.body.email });

            if (userExists) {
                return res.status(400).json({ error: "User already exists" });
            }
        }

        // Se ele informar a senha antiga
        if (oldPassword) {
            const valid = await bcrypt.compare(oldPassword, user.password)

            if (!valid)
                return res.status(401).json({ error: 'Password does not match' });

            //criptografa a NOVA senha 
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const { _id, name, provider, birthday, gender, phone, status, id_address, id_avatar } = await userModel.findByIdAndUpdate(user._id, req.body, { new: true })
            .populate({
                path: 'id_address',
                model: 'Address',
                select: ['_id', 'country', 'state', 'city']
            })
            .populate({
                path: 'id_avatar',
                model: 'File',
                select: ['_id', 'url']
            });

        return res.json({
            _id,
            name,
            email,
            provider,
            status,
            birthday,
            gender,
            phone,
            id_avatar,
            id_address
        });
    };

    async index(req, res) {

        const { likes, dislikes, s_likes } = await userModel.findById(req.userId);

        // filtra os usuarios que não estam em like/dislike/s_like e o proprio usuario logado.
        const users = await userModel.find({
            $and: [
                { _id: { $ne: req.userId } },
                { _id: { $nin: likes } },
                { _id: { $nin: dislikes } },
                { _id: { $nin: s_likes } },
            ],
        }).populate({
            path: 'id_address',
            model: 'Address',
            select: ['_id', 'country', 'state', 'city']
        })
            .populate({
                path: 'id_avatar',
                model: 'File',
                select: ['_id', 'url']
            });

        return res.json(users);
    }
}


module.exports = new UserController()