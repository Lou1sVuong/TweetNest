import { Upload } from '@aws-sdk/lib-storage'
import { S3 } from '@aws-sdk/client-s3'
import fs from 'fs'
import { config } from 'dotenv'
import { Response } from 'express'

config()
const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  }
})
// kiem tra xem co ket noi duoc voi s3 khong
// s3.listBuckets({}).then((data) => console.log(data))

// upload file to s3
export const uploadFileToS3 = ({
  fileName,
  filePath,
  contentType
}: {
  fileName: string
  filePath: string
  contentType: string
}) => {
  const parallelUploads3 = new Upload({
    client: s3,
    params: {
      Bucket: process.env.BUCKET_NAME as string,
      Key: fileName,
      Body: fs.readFileSync(filePath),
      ContentType: contentType
    },

    tags: [
      /*...*/
    ], // optional tags
    queueSize: 4,
    partSize: 1024 * 1024 * 5,
    leavePartsOnError: false
  })
  return parallelUploads3.done()
}

export const sendFileFromS3 = async (res: Response, filePath: string) => {
  try {
    const data = await s3.getObject({
      Bucket: process.env.BUCKET_NAME as string,
      Key: filePath
    })
    ;(data.Body as any).pipe(res)
  } catch (error) {
    res.status(404).send('File not found')
  }
}

// parallelUploads3.on('httpUploadProgress', (progress) => {
//   console.log(progress)
// })

// parallelUploads3.done().then((res) => {
//   console.log(res)
// })
