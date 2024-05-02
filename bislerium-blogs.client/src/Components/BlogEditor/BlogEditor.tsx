import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BlogEditor = () => {
  const [value, setValue] = useState<string>('');

  return (
    <>
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <ReactQuill theme="snow" value={value} onChange={setValue} />
    </>
  );
};

export default BlogEditor;
