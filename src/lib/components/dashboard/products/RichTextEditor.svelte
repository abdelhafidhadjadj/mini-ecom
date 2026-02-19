<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Image from '@tiptap/extension-image';
  import Link from '@tiptap/extension-link';
  import Placeholder from '@tiptap/extension-placeholder';
  import {
    Bold, Italic, List, ListOrdered, Heading2,
    Link as LinkIcon, ImageIcon, Undo, Redo
  } from 'lucide-svelte';

  let { value = '', name, placeholder = 'Write something...' } = $props<{
    value?: string;
    name: string;
    placeholder?: string;
  }>();

  let editor: Editor;
  let element: HTMLDivElement;
  let hiddenInput: HTMLInputElement;
  let fileInput: HTMLInputElement;
  let linkUrlInput = $state('');
  let showLinkModal = $state(false);

  // Convertir fichier en base64
  async function uploadToServer(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('produit_id', 'temp'); // toujours temp pour l'éditeur

    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) return null;

    const { url } = await res.json();
    return url;
  }

  onMount(() => {
    editor = new Editor({
      element,
      extensions: [
        StarterKit.configure({
          heading: { levels: [2, 3] },
        }),
        Image.configure({
          inline: true,
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-primary underline',
          },
        }),
        Placeholder.configure({
          placeholder,
        }),
      ],
      content: value,
      editorProps: {
        attributes: {
          class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3',
        },
        // Handle paste d'images
        handlePaste(view, event) {
          const items = event.clipboardData?.items;
          if (!items) return false;

          for (const item of Array.from(items)) {
            if (item.type.startsWith('image/')) {
              event.preventDefault();
              const file = item.getAsFile();
              if (file) {
                uploadToServer(file).then((url) => {
                  if (url) editor.chain().focus().setImage({ src: url }).run();
                });
              }
              return true;
            }
          }
          return false;
        },
        // Handle drag & drop d'images
        handleDrop(view, event, _slice, moved) {
          if (!moved && event.dataTransfer?.files?.length) {
            event.preventDefault();
            const files = Array.from(event.dataTransfer.files).filter(f => f.type.startsWith('image/'));
          
            if (files.length > 0) {
              files.forEach(async (file) => {
                const url = await uploadToServer(file);
                if (url) editor.chain().focus().setImage({ src: url }).run();
              });
              return true;
            }
          }
          return false;
        },
      },
      onTransaction: () => {
        editor = editor;
        if (hiddenInput) {
          hiddenInput.value = editor.getHTML();
        }
      },
    });
  });

  onDestroy(() => {
    editor?.destroy();
  });

  function toggleBold() {
    editor.chain().focus().toggleBold().run();
  }

  function toggleItalic() {
    editor.chain().focus().toggleItalic().run();
  }

  function toggleBulletList() {
    editor.chain().focus().toggleBulletList().run();
  }

  function toggleOrderedList() {
    editor.chain().focus().toggleOrderedList().run();
  }

  function toggleHeading() {
    editor.chain().focus().toggleHeading({ level: 2 }).run();
  }

  function openLinkModal() {
    const previousUrl = editor.getAttributes('link').href;
    linkUrlInput = previousUrl || '';
    showLinkModal = true;
  }

  function setLink() {
    if (!linkUrlInput) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: linkUrlInput }).run();
    }
    showLinkModal = false;
    linkUrlInput = '';
  }

  function openImageUpload() {
    fileInput.click();
  }

  async function onFileSelected(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        const url = await uploadToServer(file);
        if (url) editor.chain().focus().setImage({ src: url }).run();
      }
    }

    fileInput.value = '';
  }

  function undo() {
    editor.chain().focus().undo().run();
  }

  function redo() {
    editor.chain().focus().redo().run();
  }

  let isBoldActive = $derived(editor?.isActive('bold') ?? false);
  let isItalicActive = $derived(editor?.isActive('italic') ?? false);
  let isBulletListActive = $derived(editor?.isActive('bulletList') ?? false);
  let isOrderedListActive = $derived(editor?.isActive('orderedList') ?? false);
  let isHeadingActive = $derived(editor?.isActive('heading', { level: 2 }) ?? false);
  let isLinkActive = $derived(editor?.isActive('link') ?? false);
</script>

<div class="border border-base-300 rounded-lg overflow-hidden bg-base-100">

  <!-- Toolbar -->
  <div class="flex flex-wrap items-center gap-1 p-2 border-b border-base-300 bg-base-200/50">

    <!-- Text formatting -->
    <button
      type="button"
      class="btn btn-xs btn-ghost"
      class:btn-active={isBoldActive}
      onclick={toggleBold}
      title="Bold (Ctrl+B)"
    >
      <Bold size={14} />
    </button>

    <button
      type="button"
      class="btn btn-xs btn-ghost"
      class:btn-active={isItalicActive}
      onclick={toggleItalic}
      title="Italic (Ctrl+I)"
    >
      <Italic size={14} />
    </button>

    <button
      type="button"
      class="btn btn-xs btn-ghost"
      class:btn-active={isHeadingActive}
      onclick={toggleHeading}
      title="Heading"
    >
      <Heading2 size={14} />
    </button>

    <div class="divider divider-horizontal mx-0"></div>

    <!-- Lists -->
    <button
      type="button"
      class="btn btn-xs btn-ghost"
      class:btn-active={isBulletListActive}
      onclick={toggleBulletList}
      title="Bullet list"
    >
      <List size={14} />
    </button>

    <button
      type="button"
      class="btn btn-xs btn-ghost"
      class:btn-active={isOrderedListActive}
      onclick={toggleOrderedList}
      title="Numbered list"
    >
      <ListOrdered size={14} />
    </button>

    <div class="divider divider-horizontal mx-0"></div>

    <!-- Link & Image -->
    <button
      type="button"
      class="btn btn-xs btn-ghost"
      class:btn-active={isLinkActive}
      onclick={openLinkModal}
      title="Add link (Ctrl+K)"
    >
      <LinkIcon size={14} />
    </button>

    <button
      type="button"
      class="btn btn-xs btn-ghost"
      onclick={openImageUpload}
      title="Insert image (or paste/drag)"
    >
      <ImageIcon size={14} />
    </button>

    <div class="divider divider-horizontal mx-0"></div>

    <!-- Undo/Redo -->
    <button
      type="button"
      class="btn btn-xs btn-ghost"
      onclick={undo}
      title="Undo (Ctrl+Z)"
    >
      <Undo size={14} />
    </button>

    <button
      type="button"
      class="btn btn-xs btn-ghost"
      onclick={redo}
      title="Redo (Ctrl+Shift+Z)"
    >
      <Redo size={14} />
    </button>

  </div>

  <!-- Editor -->
  <div bind:this={element}></div>

  <!-- Hint -->
  <div class="px-4 py-2 text-xs text-base-content/40 border-t border-base-300 bg-base-200/30">
    💡 Tip: You can paste images directly (Ctrl+V) or drag & drop them into the editor
  </div>

  <!-- Hidden inputs -->
  <input
    bind:this={hiddenInput}
    type="hidden"
    {name}
    value={value}
  />

  <input
    bind:this={fileInput}
    type="file"
    accept="image/*"
    multiple
    class="hidden"
    onchange={onFileSelected}
  />

</div>

<!-- Modal Link -->
{#if showLinkModal}
  <div class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">Insert Link</h3>
      <div class="form-control gap-2">
        <input
          type="url"
          class="input input-bordered w-full"
          placeholder="https://example.com"
          bind:value={linkUrlInput}
          onkeydown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              setLink();
            }
          }}
        />
      </div>
      <div class="modal-action">
        <button type="button" class="btn btn-ghost" onclick={() => showLinkModal = false}>
          Cancel
        </button>
        <button type="button" class="btn btn-primary" onclick={setLink}>
          Insert
        </button>
      </div>
    </div>
    <div class="modal-backdrop" onclick={() => showLinkModal = false}></div>
  </div>
{/if}

<style>
  :global(.ProseMirror) {
    outline: none !important;
  }

  :global(.ProseMirror p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    float: left;
    color: hsl(var(--bc) / 0.3);
    pointer-events: none;
    height: 0;
  }

  :global(.ProseMirror img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 1rem 0;
    cursor: pointer;
  }

  :global(.ProseMirror ul, .ProseMirror ol) {
    padding-left: 1.5rem;
    margin: 0.5rem 0;
  }

  :global(.ProseMirror h2) {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 1rem 0 0.5rem;
  }

  :global(.ProseMirror h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0.75rem 0 0.5rem;
  }
</style>