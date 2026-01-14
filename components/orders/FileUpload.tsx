"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, File } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  acceptedFormats?: string[]
  maxSizeMB?: number
}

export function FileUpload({
  onFileSelect,
  acceptedFormats = [".stl", ".obj", ".3mf"],
  maxSizeMB = 50,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Check file extension
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
    if (!acceptedFormats.includes(fileExtension)) {
      setError(`File format not supported. Accepted formats: ${acceptedFormats.join(", ")}`)
      return
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      setError(`File size exceeds ${maxSizeMB}MB limit`)
      return
    }

    setSelectedFile(file)
    onFileSelect(file)
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setError(null)
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">3D Model File *</Label>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors",
          error
            ? "border-destructive bg-destructive/5"
            : selectedFile
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
      >
        {selectedFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                {acceptedFormats.join(", ").toUpperCase()} (max {maxSizeMB}MB)
              </p>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept={acceptedFormats.join(",")}
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => fileInputRef.current?.click()}
            >
              Select File
            </Button>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

