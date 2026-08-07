const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '968a9856e584b3faabdcc8af78572351';

export async function uploadToImgBB(file: File | string): Promise<string> {
  const formData = new FormData();

  if (typeof file === 'string') {
    // If Base64 data string
    const cleanBase64 = file.replace(/^data:image\/\w+;base64,/, '');
    formData.append('image', cleanBase64);
  } else {
    formData.append('image', file);
  }

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData,
  });

  const json = await response.json();

  if (response.ok && json.success && json.data?.url) {
    return json.data.url; // Returns direct ImgBB CDN image URL (e.g. https://i.ibb.co/...)
  }

  throw new Error(json.error?.message || 'Failed to upload image to ImgBB');
}
