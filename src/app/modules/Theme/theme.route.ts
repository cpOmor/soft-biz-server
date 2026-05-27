import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.utils';
import { ThemeControllers } from './theme.controller';

const router = Router();

router.get('/', auth(USER_ROLE.shop_owner, USER_ROLE.super_admin), ThemeControllers.getThemes);
router.post('/', auth(USER_ROLE.super_admin), ThemeControllers.createTheme);
router.patch('/my-theme', auth(USER_ROLE.shop_owner, USER_ROLE.super_admin), ThemeControllers.setMyShopTheme);
router.patch('/:id', auth(USER_ROLE.super_admin), ThemeControllers.updateTheme);
router.delete('/:id', auth(USER_ROLE.super_admin), ThemeControllers.deleteTheme);

export const ThemeRoutes = router;
