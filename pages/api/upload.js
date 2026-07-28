const { S3Client } = require("@aws-sdk/client-s3");
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");

const client = new S3Client({
  region: "default",
  endpoint: process.env.NEXT_PUBLIC_LIARA_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_LIARA_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_LIARA_SECRET_KEY,
  },
});

export default async function uploadHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");

  try {
    const post = await createPresignedPost(client, {
      Bucket: process.env.NEXT_PUBLIC_LIARA_BUCKET_NAME,
      Key: req.query.file,
      Fields: {
        acl: "public-read",
      },
      Expires: 60,
    });

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create presigned post" });
  }
}
