"use client"

import { useState, useCallback, useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Bold, 
  Italic, 
  Code, 
  Link, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3, 
  Quote,
  Undo,
  Redo,
  Type
} from "lucide-react"

interface BlogEditorProps {
  initialContent?: string
  onChange?: (content: string) => void
  onSave?: (content: string) => void
  placeholder?: string
  className?: string
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  const addLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  return (
    <div className="flex flex-wrap items-center gap-1 p-3 border-b bg-gray-50">
      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <Button
          variant={editor.isActive('bold') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive('italic') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive('code') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          title="Code"
        >
          <Code className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Headings */}
      <div className="flex items-center gap-1">
        <Button
          variant={editor.isActive('paragraph') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().setParagraph().run()}
          title="Paragraph"
        >
          <Type className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists and Quote */}
      <div className="flex items-center gap-1">
        <Button
          variant={editor.isActive('bulletList') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive('orderedList') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive('blockquote') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Link */}
      <Button
        variant={editor.isActive('link') ? 'default' : 'outline'}
        size="sm"
        onClick={addLink}
        title="Add Link"
      >
        <Link className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export function BlogEditor({ 
  initialContent = "", 
  onChange, 
  onSave, 
  placeholder = "Start writing your blog post...",
  className = ""
}: BlogEditorProps) {
  const [content, setContent] = useState(initialContent)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "What's the title?"
          }
          return placeholder
        },
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setContent(html)
      onChange?.(html)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
  })

  useEffect(() => {
    if (editor && initialContent !== content) {
      editor.commands.setContent(initialContent)
    }
  }, [editor, initialContent])

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(content)
    } else {
      console.log('Blog content:', content)
    }
  }, [content, onSave])

  return (
    <div className={`border rounded-lg overflow-hidden bg-white ${className}`}>
      <MenuBar editor={editor} />
      <div className="min-h-[400px]">
        <EditorContent 
          editor={editor} 
          className="focus-within:outline-none"
        />
      </div>
      {onSave && (
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <Button onClick={handleSave} className="px-6">
            Save Content
          </Button>
        </div>
      )}
    </div>
  )
}

export default BlogEditor