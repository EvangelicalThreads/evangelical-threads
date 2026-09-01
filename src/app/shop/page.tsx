export const revalidate = 0
export const dynamic = 'force-dynamic'

import Link from "next/link";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import Newsletter from '../../components/Newsletter';
import { sanityClient } from '../../lib/sanity';

type Product = {
  id: string;
  name: string;
  price: number;
  soldOut: boolean;
  category: string;
  imageFront?: string;
  imageBack?: string;
  images?: { url: string }[];
};

export default async function ShopPage() {
  const rawProducts: Product[] = await sanityClient.fetch(`
    *[_type == "product" && available == true] {
      "id": id.current,
      name,
      price,
      soldOut,
      category,
      "imageFront": imageFront.asset->url,
      "imageBack": imageBack.asset->url,
      "images": images[]{ "url": image.asset->url },
    }
  `);

  // Apparel stores its shots in the imageFront/imageBack slots; everything
  // else (tote, accessories, etc.) uses the flexible images[] array — so
  // the grid needs to pick the right pair per product rather than assuming
  // every item is apparel.
  const products = rawProducts.map((product) => {
    const isApparel = product.category === 'apparel';
    const front = isApparel ? product.imageFront : product.images?.[0]?.url;
    const back = isApparel ? product.imageBack : product.images?.[1]?.url;
    return { ...product, front, back };
  });

  return (
    <main className="bg-[#F2F0EB] min-h-screen text-[#14161a]">
      <div className="max-w-[1180px] mx-auto px-6 md:px-10 pt-24 pb-20 md:pt-32 md:pb-28">

        <p className="rv-serif italic text-center text-[38px] md:text-[48px] leading-[1.1] text-[#14161a] mb-4">
          Shop
        </p>
        <p className="text-center text-[10px] uppercase tracking-[0.28em] text-[#14161a]/40 mb-20 md:mb-24">
          Drop 01
        </p>

        {products.length === 0 ? (
          <p className="text-center text-[13px] uppercase tracking-[0.22em] text-[#14161a]/45 py-20">
            Nothing available right now.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-x-3 gap-y-8 sm:gap-x-8 sm:gap-y-14 md:gap-x-14 md:gap-y-16">
            {products.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/shop/${product.id}`} className="block">
                  <div className="relative aspect-[4/5.2] overflow-hidden bg-[#EDEAE3] mb-2.5 sm:mb-4 md:mb-5">
                    {product.soldOut && (
                      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 text-[6px] sm:text-[9px] uppercase tracking-[0.1em] sm:tracking-[0.24em] text-[#14161a]/60 bg-[#F2F0EB]/90 px-1.5 py-0.5 sm:px-2.5 sm:py-1">
                        Sold Out
                      </div>
                    )}
                    {product.front ? (
                      // eslint-disable-next-line @next/next/no-img-element -- external Sanity CDN urls, simple cover crop
                      <img
                        src={product.front}
                        alt={product.name}
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:opacity-0"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#EDEAE3]">
                        <img
                          src="/brand/ryvol-emblem-line-ink.png"
                          alt=""
                          aria-hidden="true"
                          className="w-[22%] opacity-[0.12] select-none"
                        />
                      </div>
                    )}
                    {product.back && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.back}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 ease-out group-hover:opacity-100"
                      />
                    )}
                  </div>
                </Link>

                <p className="rv-serif italic text-[12px] leading-[1.25] sm:text-[16px] md:text-[19px] text-[#14161a]">
                  {product.name}
                </p>
                <p className="mt-1 text-[7px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em] text-[#14161a]/45">
                  ${product.price}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-24 md:mt-28">
          <Newsletter />
        </div>

        <div className="text-center mt-24 pb-4">
          <h3 className="text-[10px] uppercase tracking-[0.28em] text-[#14161a]/40 mb-5">
            Instagram — TikTok
          </h3>

          <div className="flex justify-center gap-6 text-[#14161a]/60 text-xl">
            <a
              href="https://www.instagram.com/shopryvol"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="hover:text-[#14161a] transition" />
            </a>

            <a
              href="https://www.tiktok.com/@shopryvol"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok className="hover:text-[#14161a] transition" />
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
