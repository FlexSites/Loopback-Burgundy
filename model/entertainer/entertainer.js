export default {
  identity: 'entertainer',
  base: 'persisted',
  public: true,
  attributes: {
    identity: {
      type: 'string',
      required: true
    },
    credits: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string',
      required: true
    },
    facebook: {
      type: 'string'
    },
    website: {
      type: 'string'
    },
    media: {
      type: 'array'
    }
  }
};
