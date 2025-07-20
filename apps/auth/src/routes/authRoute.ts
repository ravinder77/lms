import { Router } from 'express';
import { registerHandler , loginHandler} from '../controllers/authController.js';
import { validate } from 'src/utils/validate.js';
import { loginSchema, registerSchema } from 'src/schema/authSchema.js';


const router = Router();


router.post("/register", validate(registerSchema), registerHandler);
router.post("/login", validate(loginSchema), loginHandler);

export default router;