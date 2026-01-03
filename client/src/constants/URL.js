export const PROD = false;

export let BASE_URL =
  PROD === true
    ? `https://accounts.notunkurifoundation.com`
    : `http://localhost:5002`;
