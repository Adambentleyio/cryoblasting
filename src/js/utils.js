import { getImage } from "astro:assets";

export async function getOptimizedImage(image) {
  const optimizedImage = await getImage({
    src: image,
    format: "webp",
  });

  return optimizedImage
}

// Learn more agout the getImage() function here
// https://docs.astro.build/en/guides/images/#generating-images-with-


export async function getHeroImages(image) {
  // Define breakpoints and their optimal sizes
  const breakpoints = [
    { width: 800, media: '(max-width: 768px)', quality: 75 },
    { width: 1200, media: '(max-width: 1024px)', quality: 80 },
    { width: 1920, media: '(max-width: 1920px)', quality: 80 },
    { width: 2800, media: '(min-width: 1921px)', quality: 85 }
  ];

  // Generate WebP versions
  const webpImages = await Promise.all(
    breakpoints.map(async ({ width, media, quality }) => ({
      src: (await getImage({
        src: image,
        width,
        format: 'webp',
        quality
      })).src,
      media,
      type: 'image/webp'
    }))
  );

  // Generate JPEG fallbacks
  const jpegImages = await Promise.all(
    breakpoints.map(async ({ width, media, quality }) => ({
      src: (await getImage({
        src: image,
        width,
        format: 'jpeg',
        quality: quality + 5 // Slightly higher quality for JPEG
      })).src,
      media,
      type: 'image/jpeg'
    }))
  );

  // Get the largest image for the img fallback
  const fallbackImage = await getImage({
    src: image,
    width: 1920,
    format: 'jpeg',
    quality: 85
  });

  return {
    webp: webpImages,
    jpeg: jpegImages,
    fallback: fallbackImage
  };
}