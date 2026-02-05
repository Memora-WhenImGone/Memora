import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
const region = process.env.AWS_REGION!;  // In Typescript ! means it will be there dont worry try removing ! Typescript will complain 
const bucket = process.env.AWS_S3_BUCKET!; 

export const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,  
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});  

// huge benefit of creating a client outside the utility function. reduce cost and better performance 
// aws developer associate test question :))

type UploadToS3Args = {
  key: string;                 
  body: Buffer | Uint8Array;  
  contentType?: string;       
  accessControl?: "private" | "public-read";
};

export async function uploadToS3({
  key,
  body,
  contentType,
  accessControl = "private",
}: UploadToS3Args) 

{
  const uploader = new Upload({
    client: s3,
    params: {
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: accessControl,
    },
  });


  // One more thing to add upload will happen When we will call uploader.done 
  // Upload is just something that mmaange uploads 

  const upload = await uploader.done();

  return {
    bucket,
    key,
    etag: upload.ETag!,
  };
}
