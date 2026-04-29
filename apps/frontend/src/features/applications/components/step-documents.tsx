import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormFileUploadField,
  FormMultiFileUploadField,
  ImagePreviewDialog,
} from '@org/ui'
import type { UploadedFile } from '@org/ui'
import { axiosInstance } from '@/services/api-client'
import type { ApplicationFormApi } from '../data/types'

interface StepDocumentsProps {
  form: ApplicationFormApi
  stepErrors: Record<string, string>
}

const uploadFile = async (
  file: File,
  onProgress: (percent: number) => void
) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await axiosInstance.post('/api/files/upload', formData, {
    params: { folder: 'documents' },
    onUploadProgress: (event) => {
      if (event.total) {
        onProgress(Math.round((event.loaded * 100) / event.total))
      }
    },
  })
  return response.data
}

const deleteFile = async (url: string) => {
  const path = new URL(url).pathname.replace(/^\//, '')
  await axiosInstance.delete('/api/files', { params: { path } })
}

export function StepDocuments({ form, stepErrors }: StepDocumentsProps) {
  const { t } = useTranslation()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  const isImage = (url: string) =>
    IMAGE_EXTENSIONS.some((ext) => url.toLowerCase().split('?')[0].endsWith(ext))

  const handlePreview = (file: UploadedFile) => {
    if (file.mimeType?.startsWith('image/') || isImage(file.url)) {
      setPreviewUrl(file.url)
    } else {
      // Non-image files (PDF, DOCX) — open in new tab
      window.open(file.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <>
      {/* Vehicle Photos */}
      <Card>
        <CardHeader>
          <CardTitle>{t('vehiclePhotos')}</CardTitle>
          <CardDescription>
            {t('vehiclePhotosDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormMultiFileUploadField
            form={form}
            name="photoUrls"
            label={t('vehiclePhotos')}
            uploadFn={uploadFile}
            deleteFn={deleteFile}
            onPreview={handlePreview}
            accept="image/*"
            maxFiles={10}
          />
        </CardContent>
      </Card>

      {/* Title Deed & Driver's License */}
      <Card>
        <CardHeader>
          <CardTitle>{t('documents')}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormFileUploadField
            form={form}
            name="titleDeedUrl"
            label={t('titleDeed')}
            uploadFn={uploadFile}
            deleteFn={deleteFile}
            onPreview={handlePreview}
            accept="image/*,.pdf,.doc,.docx"
          />
          <FormFileUploadField
            form={form}
            name="driversLicenseUrl"
            label={t('driversLicense')}
            uploadFn={uploadFile}
            deleteFn={deleteFile}
            onPreview={handlePreview}
            accept="image/*,.pdf,.doc,.docx"
          />
        </CardContent>

        {Object.keys(stepErrors).length > 0 && (
          <CardContent className="pt-0">
            <p className="text-destructive text-sm">
              {Object.values(stepErrors)[0]}
            </p>
          </CardContent>
        )}
      </Card>

      {/* Reusable full-screen image preview */}
      <ImagePreviewDialog
        open={!!previewUrl}
        onOpenChange={(open) => {
          if (!open) setPreviewUrl(null)
        }}
        src={previewUrl ?? ''}
        alt={t('imagePreview')}
      />
    </>
  )
}
