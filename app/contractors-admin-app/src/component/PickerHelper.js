import DocumentPicker from 'react-native-document-picker';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import ImageCropPicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import {getSystemVersion} from 'react-native-device-info';
import {Image} from 'react-native-compressor';
import {PermissionsAndroid} from 'react-native';

const FILE_MAX_SIZE = 50024122; //this is the for limit of file

const requestDocumentWithPermission = async documentOption => {
  try {
    if (Platform.OS === 'android') {
      // In android 13 no permission is needed

      const deviceVersion = getSystemVersion();
      let granted = PermissionsAndroid.RESULTS.DENIED;
      if (deviceVersion >= 13) {
        granted = PermissionsAndroid.RESULTS.GRANTED;
      } else {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      }
      if (granted) {
        return pickDocument(documentOption);
      }
    } else {
      // Handle iOS permissions if needed
      return pickDocument(documentOption);
    }
  } catch (error) {
    console.log('Error checking/requesting permissions:', error);
    return null;
  }
};

const pickDocument = async documentOption => {
  if (documentOption?.fileType) {
    getFileType = documentOption.fileType
      .map(itm => {
        switch (itm) {
          case 'pdf':
            return DocumentPicker.types.pdf;
          case 'doc':
            return DocumentPicker.types.doc;
          case 'docx':
            return DocumentPicker.types.docx;
          case 'csv':
            return [DocumentPicker.types.csv, 'text/comma-separated-values']; // Include both types for CSV
          case 'audio':
            return DocumentPicker.types.audio;
          case 'images':
            return DocumentPicker.types.images;
          case 'plainText':
            return DocumentPicker.types.plainText;
          case 'ppt':
            return DocumentPicker.types.ppt;
          case 'pptx':
            return DocumentPicker.types.pptx;
          case 'video':
            return DocumentPicker.types.video;
          case 'xls':
            return DocumentPicker.types.xls;
          case 'xlsx':
            return DocumentPicker.types.xlsx;
          case 'zip':
            return DocumentPicker.types.zip;
          case 'allFiles':
            return DocumentPicker.types.allFiles;
          default:
            return null;
        }
      })
      .flat(); // Flatten the array in case there are nested arrays
  }

  try {
    const result = await DocumentPicker.pick({
      allowMultiSelection: documentOption?.multiselet ? true : false,
      type: getFileType,

      // type: documentOption?.fileType
      //   ? [
      //       DocumentPicker.types.pdf,
      //       DocumentPicker.types.doc,
      //       DocumentPicker.types.docx,
      //       ...getFileType,
      //     ]
      //   : [
      //       DocumentPicker.types.pdf,
      //       DocumentPicker.types.doc,
      //       DocumentPicker.types.docx,
      //     ],
    });
    if (result) {
      if (documentOption?.multiselet) {
        // If there are any async operations inside map, it should be handled accordingly
        const promises = result.map(async (itm, index) => {
          const {name, size, type, uri} = itm;
          const base64 = await RNFS.readFile(itm?.uri, 'base64');

          if (size > FILE_MAX_SIZE) {
            Alert.alert(
              'File Size Limit Exceeded',
              'Please select a file up to 2 MB.',
            );
            return null; // Skip files that exceed the size limit
          } else {
            return {
              name,
              type,
              uri,
              size,
              base64,
            };
          }
        });

        try {
          const documents = await Promise.all(promises);
          const validDocuments = documents.filter(doc => doc !== null);
          return validDocuments;
        } catch (error) {
          console.error('Error processing documents:', error);
          return [];
        }
      } else {
        const {name, size, type, uri} = result[0];

        if (size > FILE_MAX_SIZE) {
          Alert.alert(
            'File Size Limit Exceeded',
            'Please select a file up to 2 MB.',
          );
        } else {
          return {
            name,
            type,
            uri,
            size,
          };
        }
      }
    }
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the document picker
      console.log('Document picker cancelled by user');
    } else {
      // Handle other errors
      console.log('Error picking document:', err);
    }
    return null;
  }
};

const requestCameraWithPermission = async cameraOption => {
  try {
    const cameraPermission = await check(PERMISSIONS.ANDROID.CAMERA);

    if (cameraPermission === RESULTS.GRANTED) {
      console.log('Camera permission already granted');
      return pickImageFromCamera(cameraOption);
    }
    const cameraPermissionResult = await request(PERMISSIONS.ANDROID.CAMERA);

    if (cameraPermissionResult === RESULTS.GRANTED) {
      console.log('Camera permission granted');
      return pickImageFromCamera(cameraOption);
    }
    console.log('Camera permission denied');
  } catch (error) {
    console.log('Error checking/requesting camera permission:', error);
    return null;
  }
};

const requestGalleryWithPermission = async galleryOption => {
  try {
    if (Platform.OS === 'android') {
      const deviceVersion = getSystemVersion();
      let granted = PermissionsAndroid.RESULTS.DENIED;
      if (deviceVersion >= 13) {
        granted = PermissionsAndroid.RESULTS.GRANTED;
      } else {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      }
      if (granted) {
        return pickImageFromGallery(galleryOption);
      }
    } else {
      // On iOS, permissions are typically not required for accessing the photo library
      console.log(
        'iOS platform: No specific permissions required for media library',
      );
      return pickImageFromGallery(galleryOption);
    }
  } catch (error) {
    console.log('Error checking/requesting storage permission:', error);
    return null;
  }
};

function getFileExtension(uri) {
  const lastDotIndex = uri.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    return uri.slice(lastDotIndex + 1);
  }
  return null; // or an appropriate default value
}

const pickImageFromCamera = async cameraOption => {
  try {
    const image = await ImageCropPicker.openCamera({
      // width: 300,
      // height: 400,
      cropping: true,
      multiple: cameraOption?.multiselet ? true : false,
      includeBase64: cameraOption?.base64 ? true : false,
      mediaType: 'photo',
    });

    if (image) {
      const pathCompressed = await Image.compress(image?.path, {
        // compress image below 2mb
        maxWidth: 1500,
        maxHeight: 1000,
      });

      const imageCompressed = await RNFS.stat(pathCompressed);

      if (imageCompressed.size > FILE_MAX_SIZE) {
        Alert.alert(
          'File Size Limit Exceeded',
          'Please select a file up to 2 MB.',
        );
      } else {
        // The picked document is available in the 'result' object

        return {
          name:
            image?.filename ||
            `image_${Date.now()}.${getFileExtension(imageCompressed?.path)}`,
          type: image?.mime,
          uri: imageCompressed?.path,
          size: imageCompressed?.size,
          ...(cameraOption?.base64 ? {base64: image?.data} : ''),
        };
      }
    }
  } catch (error) {
    console.log('Error picking image from camera:', error);
    return null;
  }
};

const pickImageFromGallery = async galleryOption => {
  try {
    const image = await ImageCropPicker.openPicker({
      // width: 300,
      // height: 400,
      // cropping: true,
      includeBase64: galleryOption?.base64 ? true : false,
      multiple: galleryOption?.multiselet ? true : false,
      mediaType: 'photo',
    });

    if (image) {
      if (galleryOption?.multiselet) {
        try {
          const promises = image.map(async itm => {
            const pathCompressed = await Image.compress(itm?.path, {
              maxWidth: 1500,
              maxHeight: 1000,
            });
            const imageCompressed = await RNFS.stat(pathCompressed);

            console.log('Picked image from gallery:', imageCompressed);

            if (imageCompressed.size > FILE_MAX_SIZE) {
              Alert.alert(
                'File Size Limit Exceeded',
                'Please select a file up to 2 MB.',
              );
              return null; // Skip files that exceed the size limit
            } else {
              return {
                name:
                  itm?.filename ||
                  `image_${Date.now()}.${getFileExtension(
                    imageCompressed?.path,
                  )}`,
                type: itm?.mime,
                uri: imageCompressed?.path,
                size: imageCompressed?.size,
                ...(galleryOption?.base64 ? {base64: itm?.data} : {}),
              };
            }
          });

          const results = await Promise.all(promises);
          const validImages = results.filter(item => item !== null);
          return validImages;
        } catch (error) {
          console.error('Error processing images:', error);
        }
      } else {
        try {
          const pathCompressed = await Image.compress(image?.path, {
            maxWidth: 1500,
            maxHeight: 1000,
          });
          const imageCompressed = await RNFS.stat(pathCompressed);

          if (imageCompressed.size > FILE_MAX_SIZE) {
            Alert.alert(
              'File Size Limit Exceeded',
              'Please select a file up to 2 MB.',
            );
            return null;
          } else {
            return {
              name:
                image?.filename ||
                `image_${Date.now()}.${getFileExtension(
                  imageCompressed?.path,
                )}`,
              type: image?.mime,
              uri: imageCompressed?.path,
              size: imageCompressed?.size,
              ...(galleryOption?.base64 ? {base64: image?.data} : {}),
            };
          }
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
    }
  } catch (error) {
    console.log('Error picking image from gallery:', error);
    return null;
  }
};

const uploadFileImageOrPdf = async (fileBlob, isFromImagePicker = true) => {
  try {
    const formData = new FormData();
    if (isFromImagePicker) {
      formData.append('file', {
        uri: fileBlob?.path,
        type: fileBlob?.mime,
        name: fileBlob?.filename, // Adjust the filename as needed
      });
    } else {
      formData.append('file', {
        uri: fileBlob[0]?.uri,
        type: fileBlob[0]?.type,
        name: fileBlob[0]?.name, // Adjust the filename as needed
      });
    }

    const response = await fetch('YOUR_API_ENDPOINT', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        // You may need to include additional headers depending on your API requirements
      },
    });

    const responseData = await response.json();
    console.log('File upload response:', responseData);
  } catch (error) {
    console.log('File upload error:', error);
  }
};

export {
  requestDocumentWithPermission,
  requestCameraWithPermission,
  requestGalleryWithPermission,
};
