import { type AxiosRequestConfig } from 'axios';

import httpFn from './http';

const getFormData = (data: { [x: string]: any }) => {
  const formData = new FormData();
  Object.keys(data).forEach((name) => {
    formData.append(name, data[name]);
  });
  return formData;
};

const request = (
  config: AxiosRequestConfig = {},
  options: {
    hasFormData?: boolean;
    muteMessage?: boolean;
  } = {},
) => {
  let data = config.data;
  if (options.hasFormData) {
    // 转为formData
    data = getFormData(data);
  }
  return httpFn({
    ...config,
    data,
  })
    .then((response) => {
      if (response.data.code !== 0) {
        return [response.data.msg, response.data];
      }
      return [undefined, response.data];
    })
    .catch((err) => {
      return [err, undefined];
    });
};

export default request;
