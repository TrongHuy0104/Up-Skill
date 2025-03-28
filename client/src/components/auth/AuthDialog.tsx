'use client';

import React, { useState } from 'react';
import { Cardo } from 'next/font/google';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { signIn } from 'next-auth/react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { cn } from '@/lib/utils';
import { DialogType } from '@/types/commons';
import { Button } from '@/components/ui/Button';
import LoginForm from '@/components/auth/LoginForm';
import SignUpForm from '@/components/auth/SignUpForm';
import Verification from '@/components/auth/Verification';
import VerifyResetCode from '@/components/auth/VerifyResetCode';
import ResetPassword from '@/components/auth/ResetPassword';
import { Providers } from '@/app/Provider';
import ForgotPassword from '@/components/auth/ForgotPassword';

const cardo = Cardo({
    subsets: ['latin'],
    weight: ['400', '700']
});

export default function AuthDialog() {
    const [dialogType, setDialogType] = useState<DialogType>('login');
    const [isOpen, setIsOpen] = useState(false);

    const handleDialogChange = (type: DialogType) => {
        setDialogType(type);
    };

    return (
        <Providers>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => handleDialogChange('login')}>
                        Log In
                    </Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                    <Button variant="default" size="sm" onClick={() => handleDialogChange('signup')}>
                        Sign Up
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-[100%] rounded-r-lg justify-start px-[30px] pt-[40px] pb-[40px] bg-primary-50 flex flex-col">
                    <DialogHeader>
                        <DialogTitle
                            className={cn(
                                cardo.className,
                                `font-bold text-[36px] leading-[44px] text-primary-800 ${dialogType === 'verify' && 'text-center'}`
                            )}
                        >
                            {dialogType === 'login'
                                ? 'Sign In To Your Account'
                                : dialogType === 'signup'
                                  ? 'Create A New Account'
                                  : dialogType === 'forgot'
                                    ? 'Forgot Your Password'
                                    : dialogType === 'verify-reset-code'
                                      ? 'Verify Your Reset Code'
                                      : dialogType === 'reset-password'
                                        ? 'Reset Your Password'
                                        : 'Verify Your Account'}
                        </DialogTitle>
                        {dialogType !== 'verify' && (
                            <div className="pb-2 flex gap-[5px]">
                                <p className="font-medium leading-7">
                                    {dialogType === 'forgot' ||
                                    dialogType === 'verify-reset-code' ||
                                    dialogType === 'reset-password'
                                        ? ''
                                        : dialogType === 'login'
                                          ? 'Don’t have an account?'
                                          : 'Already have an account?'}
                                </p>
                                <span
                                    className="font-medium leading-7 text-accent-900 cursor-pointer"
                                    onClick={() =>
                                        dialogType === 'login'
                                            ? handleDialogChange('signup')
                                            : handleDialogChange('login')
                                    }
                                >
                                    {dialogType === 'forgot' ||
                                    dialogType === 'verify-reset-code' ||
                                    dialogType === 'reset-password'
                                        ? ''
                                        : dialogType === 'login'
                                          ? 'Join here'
                                          : 'Sign in'}
                                </span>
                            </div>
                        )}
                    </DialogHeader>
                    {dialogType === 'login' && (
                        <LoginForm handleOpenDialog={setIsOpen} handleDialogChange={handleDialogChange} />
                    )}
                    {dialogType === 'forgot' && <ForgotPassword handleDialogChange={handleDialogChange} />}
                    {dialogType === 'signup' && <SignUpForm handleDialogChange={handleDialogChange} />}
                    {dialogType === 'verify' && <Verification handleDialogChange={handleDialogChange} />}
                    {dialogType === 'verify-reset-code' && <VerifyResetCode handleDialogChange={handleDialogChange} />}
                    {dialogType === 'reset-password' && <ResetPassword handleDialogChange={handleDialogChange} />}
                    {dialogType !== 'verify' &&
                        dialogType !== 'forgot' &&
                        dialogType !== 'verify-reset-code' &&
                        dialogType !== 'reset-password' && (
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <Button variant="outline" className="mt-1 w-[215px]" onClick={() => signIn('google')}>
                                    <FcGoogle />
                                    Google
                                </Button>
                                <Button variant="outline" className="mt-1 w-[215px]" onClick={() => signIn('github')}>
                                    <FaGithub />
                                    Github
                                </Button>
                            </div>
                        )}
                </DialogContent>
            </Dialog>
        </Providers>
    );
}
