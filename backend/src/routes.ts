import { Router } from 'express'
import { Joi, celebrate } from 'celebrate'
import multer from 'multer';

import multerConfig from './configs/multer'
import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'

const routes = Router();
const upload = multer(multerConfig)

routes.get('/items', ItemsController.index)

routes.get('/points', PointsController.index)
routes.get('/points/:id', PointsController.show)

routes.post(
  '/points', 
  upload.single('image'), 
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.string().required(),
      latitude: Joi.number().required(),
      longetude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string().required(),
    })
  }, {
    abortEarly: false
  }),
  PointsController.create
)

export default routes;