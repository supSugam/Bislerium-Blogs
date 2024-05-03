import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageInputDisplay from '../Reusables/ImageInput';
import './BlogEditor.css';
import MultiSelect, { ISelectOption } from '../Elements/MultiSelect';
import useTagsQuery from '../../hooks/react-query/useTagsQuery';
import StyledButton from '../Elements/StyledButton';
import useBlogsQuery from '../../hooks/react-query/useBlogsQuery';
import toast from 'react-hot-toast';
import { objectToFormData } from '../../utils/object';
import { MultiStepLoader } from '../Reusables/MultiStepLoader';

const BlogEditor = () => {
  const [blogBodyContent, setBlogBodyContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<ISelectOption[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  useEffect(() => {
    document.title = 'Bislerium | Publish a blog';
  }, []);

  // Tags

  const {
    getTags: {
      data: tags,
      isLoading: isTagsLoading,
      isRefetching: isTagsRefetching,
    },
    createTag: { mutate: createTagMutation },
  } = useTagsQuery({
    getAllTagsConfig: {
      params: {
        search: searchQuery,
      },
      queryOptions: {
        refetchOnWindowFocus: false,
      },
    },
  });

  useEffect(() => {
    console.log('tags', tags);
  }, [tags]);

  // Blog Publish

  const {
    publishBlog: {
      mutate: pubishBlogMutation,
      isPending: isBlogBeingPublished,
    },
  } = useBlogsQuery({});

  const onPublishBlog = () => {
    if (!title) {
      toast.error('Title is required');
      return;
    }
    if (!blogBodyContent) {
      toast.error('Content is required');
      return;
    }

    if (blogBodyContent.length < 100) {
      toast.error('Content should be atleast 100 characters');
      return;
    }

    if (!thumbnail) {
      toast.error('Thumbnail is required');
      return;
    }

    const payload = objectToFormData({
      title,
      body: blogBodyContent,
      tags: selectedTags.map((tag) => tag.id),
      thumbnail,
    });
    pubishBlogMutation(payload);
  };
  return (
    <main
      id="editor-container"
      className="mx-auto flex flex-col items-center justify-center w-[90%] xl:w-[65%]"
    >
      <MultiStepLoader
        loadingStates={[
          {
            text: 'Gathering your content',
          },
          {
            text: 'Uploading blog thumbnail',
          },
          {
            text: 'Publishing your blog',
          },
          {
            text: 'Creating a link for your blog',
          },
          {
            text: 'Done, Redirecting to your blog now.. 🚀',
          },
        ]}
        loading={isBlogBeingPublished}
        duration={isBlogBeingPublished ? 2000 : 0}
      />
      <div className="flex justify-between items-center mb-6 w-full">
        <h1 className="text-4xl font-bold">Publish a blog</h1>
        <StyledButton
          onClick={onPublishBlog}
          text="Publish"
          variant="primary"
          isLoading={isBlogBeingPublished}
        />
      </div>
      <div
        id="editor-wrapper"
        className="w-full h-full bg-white border-1 border-gray-200"
      >
        <div className="w-full relative">
          <textarea
            placeholder="Title"
            value={title}
            maxLength={100}
            onChange={(e) => setTitle(e.target.value.replace(/\n/g, ''))}
            required
            className="w-full font-serif text-[42px] leading-[52.5px] outline-none resize-none p-4 border-neutral-200 border"
          />
          <div className="absolute bottom-0 left-0 w-full">
            <MultiSelect
              options={(tags?.data?.result ?? [])?.map((tag) => ({
                id: tag.tagId,
                label: tag.tagName,
              }))}
              selected={selectedTags}
              onSelect={(option) => {
                setSelectedTags([...selectedTags, option]);
              }}
              onRemove={(option) => {
                setSelectedTags(
                  selectedTags.filter((tag) => tag.id !== option.id)
                );
              }}
              placeholder="Select tags (Max 3)"
              minSelection={0}
              maxSelection={3}
              onSearchChange={setSearchQuery}
              onCreate={() => {
                createTagMutation({ name: searchQuery });
              }}
              isLoading={isTagsLoading || isTagsRefetching}
            />
          </div>
        </div>

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
          value={blogBodyContent}
          onChange={setBlogBodyContent}
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
