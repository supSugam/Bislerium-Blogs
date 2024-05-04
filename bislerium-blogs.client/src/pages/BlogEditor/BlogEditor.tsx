import { useCallback, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageInputDisplay from '../../Components/Reusables/ImageInput';
import './BlogEditor.css';
import MultiSelect, {
  ISelectOption,
} from '../../Components/Elements/MultiSelect';
import useTagsQuery from '../../hooks/react-query/useTagsQuery';
import StyledButton from '../../Components/Elements/StyledButton';
import useBlogsQuery from '../../hooks/react-query/useBlogsQuery';
import toast from 'react-hot-toast';
import { objectToFormData } from '../../utils/object';
import { MultiStepLoader } from '../../Components/Reusables/MultiStepLoader';
import { useParams } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import AlterModal from '../../Components/Modal/AlertModal';
import { Tooltip } from '../../Components/Reusables/Tooltip';

const BlogEditor = ({ mode = 'publish' }: { mode?: 'publish' | 'update' }) => {
  const [blogBodyContent, setBlogBodyContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<ISelectOption[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [currentThumbnail, setCurrentThumbnail] = useState<string | null>(null);
  const [resetWarningModalOpen, setResetWarningModalOpen] =
    useState<boolean>(false);
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

  // Blog Publish

  const { id } = useParams();
  const {
    publishBlog: {
      mutate: pubishBlogMutation,
      isPending: isBlogBeingPublished,
    },
    getBlogById: { data: blogData },
    updateBlog: { mutate: updateBlogMutation, isPending: isBlogBeingUpdated },
  } = useBlogsQuery({
    id,
    getAllBlogsConfig: {
      queryOptions: {
        enabled: false,
      },
    },
  });

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

    if (!thumbnail && (mode === 'publish' || !currentThumbnail)) {
      toast.error('Thumbnail is required');
      return;
    }

    if (mode === 'update' && blogData) {
      if (
        title === blogData.data.result.title &&
        blogBodyContent === blogData.data.result.body &&
        selectedTags.every((tag) =>
          blogData.data.result.tags.some((t) => t.tagId === tag.id)
        ) &&
        selectedTags.length === blogData.data.result.tags.length &&
        thumbnail === null
      ) {
        toast.error('No changes made to update');
        return;
      }
    }

    const payload = objectToFormData({
      title,
      body: blogBodyContent,
      tags: selectedTags.map((tag) => tag.id),
      ...(mode === 'update' ? { thumbnail: thumbnail } : {}),
    });
    if (mode === 'update' && id) {
      updateBlogMutation({ id, data: payload });
      return;
    }
    pubishBlogMutation(payload);
  };

  // Setting blog data based on mode

  const setInitialData = useCallback(() => {
    if (!blogData || mode === 'publish') return;
    const { title, body, tags, thumbnail } = blogData.data.result;
    setTitle(title);
    setBlogBodyContent(body);
    setSelectedTags(tags.map((tag) => ({ id: tag.tagId, label: tag.tagName })));
    setCurrentThumbnail(thumbnail);
    setResetWarningModalOpen(false);
  }, [blogData, mode]);

  useEffect(() => {
    if (mode === 'publish') {
      document.title = 'Bislerium | Publish a blog';
      return;
    }
    if (mode === 'update' && blogData) {
      document.title = 'Bislerium | Update a blog';
      setInitialData();
    }
  }, [mode, blogData, setInitialData]);

  return (
    <main
      id="editor-container"
      className="mx-auto flex flex-col items-center justify-center w-[90%] xl:w-[65%]"
    >
      <AlterModal
        title="Are you sure?"
        subtitle="This will reset the editor and you will lose all the changes you made."
        onConfirm={setInitialData}
        isOpen={resetWarningModalOpen}
        onCancel={() => setResetWarningModalOpen(false)}
        confirmText="Reset"
        cancelText="Cancel"
        type="warn"
      />
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
        loading={isBlogBeingPublished || isBlogBeingUpdated}
        duration={isBlogBeingPublished || isBlogBeingUpdated ? 2000 : 0}
        loop={false}
      />
      <div className="flex justify-between items-center mb-8 w-full">
        <h1 className="text-4xl font-bold">
          {mode === 'update' ? 'Update' : 'Publish'} a blog
        </h1>

        <div className="flex items-center gap-4">
          {mode === 'update' && (
            <Tooltip
              label="Reset All Changes"
              // subLabel="This will reset the editor and you will lose all the changes you made."
            >
              <button
                onClick={() => setResetWarningModalOpen(true)}
                className="flex items-center justify-center p-2 rounded-md border border-neutral-300 bg-white"
              >
                <RotateCcw size={24} />
              </button>
            </Tooltip>
          )}

          <StyledButton
            onClick={onPublishBlog}
            text={mode === 'update' ? 'Update' : 'Publish'}
            variant="dark"
            isLoading={isBlogBeingPublished}
          />
        </div>
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
          className="w-full font-serif text-[42px] leading-[52.5px] outline-none resize-none p-4 border-neutral-200 border"
        />
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
            setSelectedTags(selectedTags.filter((tag) => tag.id !== option.id));
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

        <ImageInputDisplay
          className="aspect-[1200/630]"
          src={thumbnail ? URL.createObjectURL(thumbnail) : currentThumbnail}
          allowDnd
          onChange={(file) => {
            if (file) setThumbnail(file);
          }}
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
