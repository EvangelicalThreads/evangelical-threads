import { sanityClient } from '../../../lib/sanity';
import ProductDetailsClient from './ProductDetailsClient';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await sanityClient.fetch(`
    *[_type == "product" && id.current == $id && available == true][0] {
      "id": id.current,
      name,
      price,
      description,
      soldOut,
      stock,
      category,
      "imageFront": imageFront.asset->url,
      "imageBack": imageBack.asset->url,
      "modelFront": modelFront.asset->url,
      "modelBack": modelBack.asset->url,
      "flatLayFront": flatLayFront.asset->url,
      "flatLayBack": flatLayBack.asset->url,
      "images": images[]{
        "url": image.asset->url,
        label
      },
      sizeChart,
    }
  `, { id });

  if (!product) return <div className="p-10 text-center text-red-500">Product not found</div>;

  return <ProductDetailsClient product={product} />;
}