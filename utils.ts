// utils.ts
export const staticFile = (src: string) => {
    const sourcePrefix = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOST : '';
    return `${sourcePrefix}${src}`;
  };  