'use client';

import { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Underline from '@tiptap/extension-underline';
import { useRouter } from 'next/navigation';
import './PostEditor.less';

interface PostEditorProps {
  initialData?: {
    id?: number;
    title?: string;
    slug?: string;
    excerpt?: string;
    body?: string;
    titleSk?: string | null;
    slugSk?: string | null;
    excerptSk?: string | null;
    bodySk?: string | null;
    published?: boolean;
  };
}

type Tab = 'en' | 'sk';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const PostEditor = ({ initialData }: PostEditorProps) => {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const [activeTab, setActiveTab] = useState<Tab>('en');
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '');
  const [titleSk, setTitleSk] = useState(initialData?.titleSk ?? '');
  const [slugSk, setSlugSk] = useState(initialData?.slugSk ?? '');
  const [excerptSk, setExcerptSk] = useState(initialData?.excerptSk ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const editorEn = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: 'Write the English version of your article…' }),
      CharacterCount,
    ],
    content: initialData?.body ?? '',
  });

  const editorSk = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: 'Napíšte slovenský preklad článku…' }),
      CharacterCount,
    ],
    content: initialData?.bodySk ?? '',
  });

  const activeEditor = activeTab === 'en' ? editorEn : editorSk;

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTitle(value);
      if (!isEdit) setSlug(slugify(value));
    },
    [isEdit],
  );

  const handleTitleSkChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTitleSk(value);
      if (!isEdit) setSlugSk(slugify(value));
    },
    [isEdit],
  );

  const handleSave = useCallback(
    async (publish: boolean) => {
      if (!editorEn || !editorSk) return;
      setSaving(true);
      setError('');

      const payload = {
        title,
        slug,
        excerpt,
        body: editorEn.getHTML(),
        titleSk: titleSk || null,
        slugSk: slugSk || null,
        excerptSk: excerptSk || null,
        bodySk: editorSk.getHTML() === '<p></p>' ? null : editorSk.getHTML(),
        published: publish,
        publishedAt: publish ? new Date().toISOString() : undefined,
      };

      const url = isEdit ? `/api/posts/${initialData!.id}` : '/api/posts';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setSaving(false);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      router.push('/admin/posts');
      router.refresh();
    },
    [
      editorEn,
      editorSk,
      title,
      slug,
      excerpt,
      titleSk,
      slugSk,
      excerptSk,
      isEdit,
      initialData,
      router,
    ],
  );

  const addLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url && activeEditor) {
      activeEditor.chain().focus().setLink({ href: url }).run();
    }
  }, [activeEditor]);

  const renderToolbar = () => {
    if (!activeEditor) return null;
    return (
      <div className="post-editor__toolbar" role="toolbar" aria-label="Text formatting">
        <button
          type="button"
          onClick={() => activeEditor.chain().focus().toggleBold().run()}
          className={`post-editor__tool ${activeEditor.isActive('bold') ? 'post-editor__tool--active' : ''}`}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => activeEditor.chain().focus().toggleItalic().run()}
          className={`post-editor__tool ${activeEditor.isActive('italic') ? 'post-editor__tool--active' : ''}`}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => activeEditor.chain().focus().toggleUnderline().run()}
          className={`post-editor__tool ${activeEditor.isActive('underline') ? 'post-editor__tool--active' : ''}`}
          title="Underline"
        >
          <u>U</u>
        </button>
        <div className="post-editor__divider" />
        <button
          type="button"
          onClick={() => activeEditor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`post-editor__tool ${activeEditor.isActive('heading', { level: 2 }) ? 'post-editor__tool--active' : ''}`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => activeEditor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`post-editor__tool ${activeEditor.isActive('heading', { level: 3 }) ? 'post-editor__tool--active' : ''}`}
          title="Heading 3"
        >
          H3
        </button>
        <div className="post-editor__divider" />
        <button
          type="button"
          onClick={() => activeEditor.chain().focus().toggleBulletList().run()}
          className={`post-editor__tool ${activeEditor.isActive('bulletList') ? 'post-editor__tool--active' : ''}`}
          title="Bullet list"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => activeEditor.chain().focus().toggleOrderedList().run()}
          className={`post-editor__tool ${activeEditor.isActive('orderedList') ? 'post-editor__tool--active' : ''}`}
          title="Ordered list"
        >
          1. List
        </button>
        <div className="post-editor__divider" />
        <button
          type="button"
          onClick={() => activeEditor.chain().focus().toggleBlockquote().run()}
          className={`post-editor__tool ${activeEditor.isActive('blockquote') ? 'post-editor__tool--active' : ''}`}
          title="Blockquote"
        >
          &ldquo;&rdquo;
        </button>
        <button
          type="button"
          onClick={() => activeEditor.chain().focus().toggleCodeBlock().run()}
          className={`post-editor__tool ${activeEditor.isActive('codeBlock') ? 'post-editor__tool--active' : ''}`}
          title="Code block"
        >{`</>`}</button>
        <button
          type="button"
          onClick={addLink}
          className={`post-editor__tool ${activeEditor.isActive('link') ? 'post-editor__tool--active' : ''}`}
          title="Add link"
        >
          Link
        </button>
      </div>
    );
  };

  return (
    <div className="post-editor">
      <div className="post-editor__tabs">
        <button
          type="button"
          className={`post-editor__tab ${activeTab === 'en' ? 'post-editor__tab--active' : ''}`}
          onClick={() => setActiveTab('en')}
        >
          English
        </button>
        <button
          type="button"
          className={`post-editor__tab ${activeTab === 'sk' ? 'post-editor__tab--active' : ''}`}
          onClick={() => setActiveTab('sk')}
        >
          Slovensky
        </button>
      </div>

      {activeTab === 'en' ? (
        <div className="post-editor__fields">
          <div className="post-editor__field">
            <label className="post-editor__label" htmlFor="post-title">
              Title (English)
            </label>
            <input
              id="post-title"
              type="text"
              className="post-editor__input post-editor__input--title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Your article title"
            />
          </div>
          <div className="post-editor__field">
            <label className="post-editor__label" htmlFor="post-slug">
              URL slug
            </label>
            <div className="post-editor__slug-wrap">
              <span className="post-editor__slug-prefix">/en/blog/</span>
              <input
                id="post-slug"
                type="text"
                className="post-editor__input post-editor__slug-input"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="article-url-slug"
              />
            </div>
          </div>
          <div className="post-editor__field">
            <label className="post-editor__label" htmlFor="post-excerpt">
              Excerpt (English)
            </label>
            <textarea
              id="post-excerpt"
              className="post-editor__textarea"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="A concise summary (150–200 characters recommended)"
            />
            <span className="post-editor__char-count">{excerpt.length}/200</span>
          </div>
        </div>
      ) : (
        <div className="post-editor__fields">
          <div className="post-editor__field">
            <label className="post-editor__label" htmlFor="post-title-sk">
              Titulok (Slovensky)
            </label>
            <input
              id="post-title-sk"
              type="text"
              className="post-editor__input post-editor__input--title"
              value={titleSk}
              onChange={handleTitleSkChange}
              placeholder="Titulok článku po slovensky"
            />
          </div>
          <div className="post-editor__field">
            <label className="post-editor__label" htmlFor="post-slug-sk">
              URL slug (SK)
            </label>
            <div className="post-editor__slug-wrap">
              <span className="post-editor__slug-prefix">/blog/</span>
              <input
                id="post-slug-sk"
                type="text"
                className="post-editor__input post-editor__slug-input"
                value={slugSk}
                onChange={(e) => setSlugSk(e.target.value)}
                placeholder="url-clanku-po-slovensky"
              />
            </div>
          </div>
          <div className="post-editor__field">
            <label className="post-editor__label" htmlFor="post-excerpt-sk">
              Perex (Slovensky)
            </label>
            <textarea
              id="post-excerpt-sk"
              className="post-editor__textarea"
              value={excerptSk}
              onChange={(e) => setExcerptSk(e.target.value)}
              rows={3}
              placeholder="Krátky opis článku (150–200 znakov)"
            />
            <span className="post-editor__char-count">{excerptSk.length}/200</span>
          </div>
          <p className="post-editor__hint">
            Leave blank to fall back to the English version for Slovak readers.
          </p>
        </div>
      )}

      {renderToolbar()}

      <div className="post-editor__body">
        <div style={{ display: activeTab === 'en' ? 'block' : 'none' }}>
          <EditorContent editor={editorEn} className="post-editor__content" />
        </div>
        <div style={{ display: activeTab === 'sk' ? 'block' : 'none' }}>
          <EditorContent editor={editorSk} className="post-editor__content" />
        </div>
        {activeEditor && (
          <span className="post-editor__word-count">
            {activeEditor.storage.characterCount.words()} words
          </span>
        )}
      </div>

      {error && (
        <p className="post-editor__error" role="alert">
          {error}
        </p>
      )}

      <div className="post-editor__actions">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => handleSave(false)}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save Draft'}
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => handleSave(true)}
          disabled={saving}
        >
          {saving ? 'Publishing…' : isEdit ? 'Update & Publish' : 'Publish Post'}
        </button>
      </div>
    </div>
  );
};
