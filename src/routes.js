const { Router } = require('express');
const multer = require('multer');
const multerConfig = require('./config/multer');


// Importação de controllers
const UserController = require('./app/controller/UserController');
const SessionController = require('./app/controller/SessionController');
const FileController = require('./app/controller/FileController');
const ProviderController = require('./app/controller/ProviderController');
const AddressController = require('./app/controller/AddressController');
const LikeController = require('./app/controller/LikeController');
const DislikeController = require('./app/controller/DislikeController');


// importando middlewares
const authMiddleware = require('./app/middlewares/auth');


const routes = new Router();
const upload = multer(multerConfig);



routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

// este middleware somente irá valer o que tiver abaixo dele.(Esta forma é global)
// pode tbm declarar estes meddlewares localmente.
// Middleware de autenticaçao que retorna o id do usuario logado
routes.use(authMiddleware);

/**GETs */
routes.get('/providers', ProviderController.index);
routes.get('/users', UserController.index);



/**POSTs */
routes.post('/address', AddressController.store);
routes.post('/files', upload.single('file'), FileController.store);/* este upload, é a variavel que recebe as configurações do multer. É um middleware*/
routes.post('/users/:likeIdUser/likes', LikeController.store);
routes.post('/users/:likeIdUser/dislikes', DislikeController.store);



/**PUTs */
routes.put('/users', UserController.update);
routes.put('/address', AddressController.update);
routes.put('/files/:id', upload.single('file'), FileController.update);



/**DELETEs */
routes.delete('/files/:id', FileController.delete);

// routes.get('/providers/:providerId/available', AvailableController.index);


// routes.get('/appointments', AppointmentController.index);
// routes.post('/appointments', AppointmentController.store);
// routes.delete('/appointments/:_id', AppointmentController.delete);


// routes.get('/schedule', ScheduleController.index);


// routes.get('/notifications', NotificationController.index);
// routes.put('/notifications/:_id', NotificationController.update);





module.exports = routes;