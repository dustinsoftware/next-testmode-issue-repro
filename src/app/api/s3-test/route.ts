import * as S3 from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

export async function GET() {
  // Generate a new random UUID
  const uuid = randomUUID();

  // Get the S3 bucket name from config
  const bucketName = process.env.BUCKET_NAME;

  // Initialize the S3 Client with OIDC credentials
  const s3client = new S3.S3Client({
    region: process.env.AWS_REGION,
  });

  // Create JSON document content
  const jsonContent = { id: uuid };
  const jsonString = JSON.stringify(jsonContent);

  // Define the S3 object key
  const objectKey = `some-folder/${uuid}.json`;

  // Upload the JSON document to S3
  await s3client.send(
    new S3.PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey, 
      Body: jsonString,
      ContentType: 'application/json',
    })
  );

  // Read the object back from S3
  const getResult = await s3client.send(
    new S3.GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    })
  );

  // Convert the response body to string and parse JSON
  const bodyString = await getResult.Body?.transformToString();
  const retrievedData = bodyString ? JSON.parse(bodyString) : null;

  // Return the retrieved data as 200 OK
  return Response.json(retrievedData, { status: 200 });
}
