// postApiV1ReviewUploadInit,
// postApiV1ReviewUploadUploadIdCancel,
// postApiV1ReviewUploadUploadIdChunk,
// postApiV1ReviewUploadUploadIdComplete,
// postApiV1ReviewUploadUploadIdComplete_define,

import request from '@/api/http';

export const postUploadInit = () =>
  request(
    {
      url: '/upload/init',
      method: 'post',
    },
    {
      muteMessage: true,
    },
  );

export const postUploadPart = (data: {
  uploadId: string;
  totalChunks: number;
  currentIndex: number;
  file: Blob;
}) =>
  request(
    {
      url: '/upload/part',
      method: 'post',
      data,
    },
    {
      hasFormData: true,
      muteMessage: true,
    },
  );

export const postUploadMerge = (data: {
  uploadId: string;
  totalChunks: number;
  filename: string;
}) =>
  request(
    {
      url: '/upload/merge',
      method: 'post',
      data,
    },
    {
      muteMessage: true,
    },
  );

export const postUploadCancel = (data: { uploadId: string }) =>
  request(
    {
      url: '/upload/cancel',
      method: 'post',
      data,
    },
    {
      muteMessage: true,
    },
  );
