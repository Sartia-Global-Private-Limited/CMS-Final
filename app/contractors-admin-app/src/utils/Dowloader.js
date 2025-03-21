import {StyleSheet, Text, ToastAndroid, View} from 'react-native';
import React from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-toast-message';

const Dowloader = (remoteUri, addtionalData) => {
  /* function for getting the extension of file */
  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  /*function for getting starting name of file which is used to save in storage based on extension of file*/

  const getFileStartingName = ext => {
    switch (ext) {
      case '.jpg':
        return '/CMS_image_';
      case '.jpeg':
        return '/CMS_image_';
      case '.png':
        return '/CMS_image_';
      case '.pdf':
        return '/CMS_pdf_';
      case '.doc':
        return '/CMS_doc_';
      case '.docx':
        return '/CMS_doc_';
      case '.csv':
        return '/CMS_csv_';
      case '.jfif':
        return '/CMS_jfif_';

      default:
        break;
    }
  };
  {
    /*function for downloading image*/
  }
  const downloadImageRemote = remoteImageUrl => {
    // Main function to download the image

    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let final_download_URL = remoteImageUrl;
    // Getting the extention of the file
    let ext = getExtention(final_download_URL);

    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const {config, fs} = RNFetchBlob;
    let StorageDir = fs.dirs.DownloadDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path: addtionalData
          ? StorageDir + `${getFileStartingName(ext)}` + addtionalData + ext
          : StorageDir +
            `${getFileStartingName(ext)}` +
            Math.floor(date.getTime() + date.getSeconds() / 2) +
            ext,

        description: 'Cms',
      },
    };
    config(options)
      .fetch('GET', final_download_URL)
      .then(res => {
        // Showing alert after successful downloading

        Toast.show({
          type: 'info',
          text1: 'Download complete',
          position: 'bottom',
        });
      });
  };
  return downloadImageRemote(remoteUri);
};

export default Dowloader;

const styles = StyleSheet.create({});
