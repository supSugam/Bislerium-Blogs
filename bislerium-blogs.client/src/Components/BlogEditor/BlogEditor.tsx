import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageInputDisplay from '../Reusables/ImageInput';
import './BlogEditor.css';
import MultiSelect, { ISelectOption } from '../Elements/MultiSelect';
import useTagsQuery from '../../hooks/react-query/useTagsQuery';
import { ITag } from '../../Interfaces/Models/ITag';

const BlogEditor = () => {
  const [value, setValue] = useState<string>('');
  const [title, setTitle] = useState<string>('');

  const [thumbnail, setThumbnail] = useState<File | null>(null);

  useEffect(() => {
    document.title = 'Bislerium | Publish a blog';
  }, []);

  useEffect(() => {
    console.log('value', JSON.stringify(value));
  }, [value]);

  // Tags

  const {
    getTags: { data: tags, isLoading: isTagsLoading },
    createTag: { mutate: createTagMutation },
  } = useTagsQuery({
    getAllTagsConfig: {
      queryOptions: {
        refetchOnWindowFocus: false,
      },
    },
  });

  const [selectedTags, setSelectedTags] = useState<ISelectOption[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    console.log('tags', tags);
  }, [tags]);
  return (
    <main
      id="editor-container"
      className="mx-auto flex flex-col items-center justify-center w-[90%] xl:w-[65%]"
    >
      <div className="flex justify-between items-center p-4 w-full">
        <button className="text-gray-600 font-semibold text-xl">Cancel</button>
        <button className="text-gray-600 font-semibold text-xl">Publish</button>
      </div>
      <div
        id="editor-wrapper"
        className="w-full h-full bg-white border-1 border-gray-200"
      >
        <textarea
          placeholder="Title"
          value={title}
          maxLength={100}
          onChange={(e) => setTitle(e.target.value.replace(/\n/g, ''))}
          required
          className="w-full font-serif text-[42px] leading-[52.5px] outline-none resize-none p-4"
        />
        <MultiSelect
          options={[
            {
              id: '1',
              label: 'React',
            },
            {
              id: '2',
              label: 'Node',
            },
            {
              id: '3',
              label: 'Express',
            },
            {
              id: '4',
              label: 'MongoDB',
            },
          ]}
          selected={selectedTags}
          onSelect={(option) => {
            setSelectedTags([...selectedTags, option]);
          }}
          onRemove={(option) => {
            setSelectedTags(selectedTags.filter((tag) => tag.id !== option.id));
          }}
          placeholder="Select tags (Max 3)"
          minSelection={1}
          maxSelection={3}
          onSearchChange={setSearchQuery}
          onCreate={() => {
            createTagMutation({ name: searchQuery });
          }}
          isLoading={isTagsLoading}
        />
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
          defaultValue={value}
        />
      </div>
    </main>
  );
};

export default BlogEditor;
