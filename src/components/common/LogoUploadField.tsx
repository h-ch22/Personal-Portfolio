import { useRef } from 'react'
import { ImagePlusIcon, XIcon } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Field, FieldLabel } from '#/components/ui/field'

export function LogoUploadField({
  logoFile,
  setLogoFile,
  existingLogoUrl,
  setExistingLogoUrl,
}: {
  logoFile: File | null
  setLogoFile: (f: File | null) => void
  existingLogoUrl?: string
  setExistingLogoUrl: (url: string | undefined) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const logoPreview = logoFile ? URL.createObjectURL(logoFile) : existingLogoUrl

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setLogoFile(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <Field>
      <FieldLabel>Logo / Icon</FieldLabel>
      <div className="flex items-center gap-3">
        {logoPreview ? (
          <div className="relative w-16 h-16 rounded-lg border overflow-hidden bg-muted flex items-center justify-center shrink-0">
            <img src={logoPreview} alt="logo preview" className="w-full h-full object-contain" />
            <button
              type="button"
              className="absolute top-0.5 right-0.5 bg-background/80 rounded-full p-0.5 hover:bg-background transition-colors"
              onClick={() => { setLogoFile(null); setExistingLogoUrl(undefined) }}
            >
              <XIcon className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg border border-dashed bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
            <ImagePlusIcon className="w-6 h-6" />
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          {logoPreview ? 'Change' : 'Select Image'}
        </Button>
      </div>
    </Field>
  )
}
