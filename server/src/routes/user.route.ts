import express from 'express';
import {
    activateUser,
    deleteUser,
    getAllUsers,
    getUserInfo,
    loginUser,
    logoutUser,
    registrationUser,
    socialAuth,
    updateAccessToken,
    updatePassword,
    updateProfilePicture,
    updateUserInfo,
    updateUserRole,
    forgotPasswordUser,
    resetCodeVerify,
    resetPassword
} from '@/controllers/user.controller';
import { isAuthenticated } from '@/middlewares/auth/isAuthenticated';
import { authorizeRoles } from '@/middlewares/auth/authorizeRoles';

const router = express.Router();

router.post('/register', registrationUser);

router.post('/activate-user', activateUser);

router.post('/login', loginUser);

router.post('/forgot-password', forgotPasswordUser);

router.post('/resetcode-verify', resetCodeVerify);

router.put('/reset-password', resetPassword);

router.get('/logout', isAuthenticated, authorizeRoles('user'), logoutUser);

router.get('/refresh', updateAccessToken);

router.get('/me', isAuthenticated, getUserInfo);

router.post('/social-auth', socialAuth);

router.put('/update-user', isAuthenticated, updateUserInfo);

router.put('/update-password', isAuthenticated, updatePassword);

router.put('/update-avatar', isAuthenticated, updateProfilePicture);

router.get('/get-users', isAuthenticated, authorizeRoles('admin'), getAllUsers);

router.put('/update-role', isAuthenticated, authorizeRoles('admin'), updateUserRole);

router.delete('/delete-user:id', isAuthenticated, authorizeRoles('admin'), deleteUser);

export = router;
