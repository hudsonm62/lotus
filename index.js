const lotus = require("./lotus");

const template = `
html:
  head:
    title: A template engine for writing human-friendly HTML
  body:
    div:
      @class: container
      p: Make HTML more enjoyable and reduce stress!
      img:
        @src: /path/to/logo.avif
        @alt: Lotus logo
`;

console.log(lotus(template));
