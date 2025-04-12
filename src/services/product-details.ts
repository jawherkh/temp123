/**
 * Represents details for a sunscreen product.
 */
export interface ProductDetails {
  /**
   * The unique identifier for the product.
   */
  id: string;
  /**
   * The name of the product.
   */
  name: string;
  /**
   * A brief description of the product.
   */
  description: string;
  /**
   * The sun protection factor (SPF) of the sunscreen.
   */
  spf: number;
  /**
   * A URL to the product image.
   */
  imageUrl: string;
  /**
   * A URL to where the product can be purchased.
   */
  purchaseUrl: string;
}

/**
 * Asynchronously retrieves product details for a given product ID.
 *
 * @param productId The ID of the product to retrieve.
 * @returns A promise that resolves to a ProductDetails object.
 */
export async function getProductDetails(productId: string): Promise<ProductDetails> {
  // TODO: Implement this by calling an API.

  return {
    id: productId,
    name: 'Stub Sunscreen',
    description: 'A sunscreen product.',
    spf: 30,
    imageUrl: '/stub-sunscreen.jpg',
    purchaseUrl: 'https://example.com/stub-sunscreen',
  };
}
