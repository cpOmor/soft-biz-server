import { Router } from 'express';
import auth from '../../middlewares/auth';
import { TaskControllers } from './task.controller';
const router = Router();
router.get('/',     auth('user','admin'), TaskControllers.getTasks);
router.post('/',    auth('user','admin'), TaskControllers.createTask);
router.patch('/:id',auth('user','admin'), TaskControllers.updateTask);
router.delete('/:id',auth('user','admin'),TaskControllers.deleteTask);
export const TaskRoutes = router;
