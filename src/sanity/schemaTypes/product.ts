export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'id',
      title: 'Product ID (no spaces, e.g. gods-world)',
      type: 'slug',
      options: { source: 'name' },
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Apparel', value: 'apparel' },
          { title: 'Candles', value: 'candles' },
          { title: 'Accessories', value: 'accessories' },
          { title: 'Other', value: 'other' },
        ],
      },
    },
    {
      name: 'price',
      title: 'Price ($)',
      type: 'number',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'available',
      title: 'Available for purchase?',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'soldOut',
      title: 'Sold Out?',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'stock',
      title: 'Stock',
      type: 'object',
      fields: [
        { name: 'XS', type: 'number', title: 'XS' },
        { name: 'S', type: 'number', title: 'S' },
        { name: 'M', type: 'number', title: 'M' },
        { name: 'L', type: 'number', title: 'L' },
        { name: 'XL', type: 'number', title: 'XL' },
        { name: 'XXL', type: 'number', title: '2XL' },
        { name: 'oneSize', type: 'number', title: 'One Size (for non-apparel)' },
      ],
    },
    // Apparel fixed image slots
    {
      name: 'imageFront',
      title: '📸 Front',
      type: 'image',
      hidden: ({ document }: { document: { category?: string } }) => document?.category !== 'apparel',
    },
    {
      name: 'imageBack',
      title: '📸 Back',
      type: 'image',
      hidden: ({ document }: { document: { category?: string } }) => document?.category !== 'apparel',
    },
    {
      name: 'modelFront',
      title: '📸 Model Front',
      type: 'image',
      hidden: ({ document }: { document: { category?: string } }) => document?.category !== 'apparel',
    },
    {
      name: 'modelBack',
      title: '📸 Model Back',
      type: 'image',
      hidden: ({ document }: { document: { category?: string } }) => document?.category !== 'apparel',
    },
    {
      name: 'flatLayFront',
      title: '📸 Flat Lay Front',
      type: 'image',
      hidden: ({ document }: { document: { category?: string } }) => document?.category !== 'apparel',
    },
    {
      name: 'flatLayBack',
      title: '📸 Flat Lay Back',
      type: 'image',
      hidden: ({ document }: { document: { category?: string } }) => document?.category !== 'apparel',
    },
    // Non-apparel flexible images
    {
      name: 'images',
      title: 'Product Images',
      type: 'array',
      hidden: ({ document }: { document: { category?: string } }) => document?.category === 'apparel',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
            },
            {
              name: 'label',
              title: 'Label (e.g. Candle Lit, Unlit, Close-up)',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      name: 'sizeChart',
      title: 'Size Chart (leave empty for non-apparel)',
      type: 'array',
      hidden: ({ document }: { document: { category?: string } }) => document?.category !== 'apparel',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'size', type: 'string', title: 'Size' },
            { name: 'width', type: 'string', title: 'Width (in)' },
            { name: 'length', type: 'string', title: 'Length (in)' },
          ],
        },
      ],
    },
  ],
}