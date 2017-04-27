import { Router } from 'express';
import { requireSignin } from '../../services/passport';
import faqController from './faq';
import { signinController, signupController, signoutController } from './auth';

const router = new Router();

router.get('/faq', faqController);
router.post('/signin', requireSignin, signinController);
router.post('/signup', signupController);
router.post('/signout', signoutController);

export default router;
