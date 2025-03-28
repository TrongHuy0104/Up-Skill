import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill/dist/quill.snow.css';

interface RichEditorProps {
    placeholder: string;
    value?: string;
    onChange: (value: string) => void;
}
function RichEditor({ placeholder, onChange, value }: RichEditorProps) {
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

    return <ReactQuill theme="snow" value={value} onChange={onChange} placeholder={placeholder} />;
}

export default RichEditor;
