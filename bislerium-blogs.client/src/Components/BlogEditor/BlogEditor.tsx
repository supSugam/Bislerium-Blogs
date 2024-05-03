import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageInputDisplay from '../Reusables/ImageInput';
import './BlogEditor.css';

const BlogEditor = () => {
  const [value, setValue] = useState<string>('');
  const [title, setTitle] = useState<string>('');

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  return (
    <main
      id="editor-container"
      className="w-full mx-auto flex flex-col items-center justify-center"
    >
      <div
        id="editor-wrapper"
        className="w-[90%] xl:w-[65%] h-full bg-white border-1 border-gray-200"
      >
        <ImageInputDisplay
          className="aspect-[1200/630]"
          src={thumbnail ? URL.createObjectURL(thumbnail) : undefined}
          onDelete={() => setThumbnail(null)}
          onChange={(file) => setThumbnail(file)}
          allowDnd
          placeholder={{
            text: 'Drag and drop or click to upload thumbnail',
            classNames: 'text-gray-600 font-semibold text-xl mt-2',
            iconSize: 60,
          }}
        />
        <textarea
          placeholder="Title"
          value={title}
          maxLength={100}
          onChange={(e) => setTitle(e.target.value.replace(/\n/g, ''))}
          required
          className="w-full font-serif text-[42px] leading-[52.5px] outline-none resize-none p-4"
        />
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          className="w-full border-1 border-gray-200 rounded-lg h-full"
          formats={[
            'header',
            'bold',
            'italic',
            'underline',
            'strike',
            'blockquote',
            'code-block',
            'list',
            'bullet',
            'indent',
            'link',
            'image',
            'size',
          ]}
          modules={{
            toolbar: [
              [{ header: '1' }, { header: '2' }],
              [
                {
                  size: ['small', false, 'large', 'huge'],
                },
              ],
              ['code-block'],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
              ],
              ['link', 'image'],
              ['clean'],
            ],
          }}
          placeholder="Start typing here..."
          style={{ height: 'calc(100vh - 300px)' }}
        />
      </div>
    </main>
  );
};

export default BlogEditor;
