'use client';

import { useId } from 'react';

interface FormControlProps {
    type?: string;
    error?: string | null;
    placeholder: string;
}

export default function FormControl({ type = 'text', error = null, placeholder }: FormControlProps) {
    const uniqueId = useId(); // Generate a unique ID for each instance

    return (
        <div className="flex items-center justify-center gap-y-[22px] gap-x-[30px] w-full">
            <fieldset className="w-full relative mb-8">
                <input
                    type={type}
                    id={uniqueId}
                    required
                    className={`w-full peer border-b-2 pt-5 pb-2 border-primary-100 text-primary-600 transition 
                    focus:border-primary-800 focus:outline-none placeholder-shown:border-primary-800`}
                />
                <label
                    htmlFor={uniqueId}
                    className={`absolute left-0 transform transition-all duration-100 ease-linear cursor-text leading-7 
                    top-1/2 -translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 
                    peer-focus:top-0 peer-focus:-translate-y-1/2 peer-valid:top-0 peer-valid:-translate-y-1/2`}
                >
                    {placeholder}
                </label>
                {error && <p className="absolute -bottom-8 text-red-600 text-sm">{error}</p>}
            </fieldset>
        </div>
    );
}
