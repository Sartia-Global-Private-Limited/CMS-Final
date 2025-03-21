export default function GetFileExtension(uri) {
  const lastDotIndex = uri?.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    return uri.slice(lastDotIndex + 1);
  }
  return null; // or an appropriate default value
}
