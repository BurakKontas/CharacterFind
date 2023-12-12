const schemaConfig = {
  class: 'Characters',
  vectorizer: 'img2vec-neural',
  vectorIndexType: 'hnsw',
  moduleConfig: {
    'img2vec-neural': {
      imageFields: ['image'],
    },
  },
  properties: [
    {
      name: 'image',
      dataType: ['blob'],
    },
    {
      name: 'mal_id',
      dataType: ['string'],
    },
  ],
};
