export default {
  identity: 'blog-post',
  base: 'page-base',
  public: true,
  attributes: {
    publishedDate: {
      type: 'date'
    },
    content: {
      type: 'string',
      required: true
    },
    tags: {
      type: 'array'
    },
    previewImage: {
      type: 'string'
    },
    media: {
      type: 'array'
    }
  }
};

