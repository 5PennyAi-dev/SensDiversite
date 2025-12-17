import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading2, 
  Heading3, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Columns,
  MessageSquareQuote,
  StickyNote,
  LayoutGrid
} from 'lucide-react'

interface MarkdownToolbarProps {
  onInsert: (text: string, cursorOffset?: number) => void
}

export function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
  
  const tools = [
    { icon: Heading2, label: 'H2', action: () => onInsert('## ', 0) },
    { icon: Heading3, label: 'H3', action: () => onInsert('### ', 0) },
    { icon: Bold, label: 'Gras', action: () => onInsert('**texte**', -7) },
    { icon: Italic, label: 'Italique', action: () => onInsert('*texte*', -6) },
    { type: 'separator' },
    { icon: List, label: 'Liste', action: () => onInsert('- ', 0) },
    { icon: ListOrdered, label: 'Numéroté', action: () => onInsert('1. ', 0) },
    { icon: Quote, label: 'Citation', action: () => onInsert('> ', 0) },
    { type: 'separator' },
    { icon: LinkIcon, label: 'Lien', action: () => onInsert('[texte](url)', -11) },
    { type: 'separator' },
    // Layout Layouts
    { 
        icon: Columns, 
        label: '2 Colonnes', 
        action: () => onInsert(
`<div class="layout-cols-2">
  <div>
    
### Colonne 1
Votre contenu ici...

  </div>
  <div>

### Colonne 2
Votre contenu ici...

  </div>
</div>
`, 0) 
    },
    { 
        icon: MessageSquareQuote, 
        label: 'Exergue', 
        action: () => onInsert(
`<div class="layout-exergue">
  "Une citation mise en avant qui capture l'essence de la réflexion."
</div>
`, 0) 
    },
    { 
        icon: StickyNote, 
        label: 'Note', 
        action: () => onInsert(
`<div class="layout-note">
  <strong>Note :</strong>
  Ceci est un bloc de note ou d'appel à l'action distinct du texte principal.
</div>
`, 0) 
    },
    { 
        icon: LayoutGrid, 
        label: 'Galerie Duo', 
        action: () => onInsert(
`<div class="layout-gallery-grid">
  <img src="URL_IMAGE_1" alt="Description 1" />
  <img src="URL_IMAGE_2" alt="Description 2" />
</div>
`, 0) 
    }
  ]

  return (
    <div className="flex items-center gap-1 p-2 bg-muted/30 border-b border-border overflow-x-auto sticky top-0 z-10 backdrop-blur-md rounded-t-lg">
      {tools.map((tool, idx) => {
        if (tool.type === 'separator') {
          return <div key={idx} className="w-px h-6 bg-border mx-1 flex-shrink-0" />
        }
        
        const Icon = tool.icon!
        return (
          <button
            key={idx}
            type="button"
            onClick={tool.action}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
            title={tool.label}
          >
            <Icon className="w-4 h-4" />
          </button>
        )
      })}
    </div>
  )
}
