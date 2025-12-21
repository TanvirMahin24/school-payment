export const PROD = false;

export let BASE_URL =
  PROD === true
    ? `https://primary.notunkurifoundation.com`
    : `http://localhost:5002`;

