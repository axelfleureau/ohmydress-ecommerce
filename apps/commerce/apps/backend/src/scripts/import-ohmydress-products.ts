import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  deleteProductsWorkflow,
} from "@medusajs/medusa/core-flows";
import products from "../data/ohmydress-products.json";

const demoProductHandles = ["t-shirt", "sweatshirt", "sweatpants", "shorts"];

type OhMyDressProduct = {
  title: string;
  handle: string;
  description: string;
  status: "published" | "draft";
  category: string;
  tags: string[];
  thumbnail: string | null;
  images: string[];
  metadata: Record<string, unknown>;
  options: Array<{
    title: string;
    values: string[];
  }>;
  variants: Array<{
    title: string;
    sku: string;
    manage_inventory: boolean;
    allow_backorder: boolean;
    options: Record<string, string>;
    prices: Array<{
      amount: number;
      currency_code: string;
    }>;
    metadata: Record<string, unknown>;
  }>;
};

export default async function importOhMyDressProducts({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const sourceProducts = products as OhMyDressProduct[];

  const { data: demoProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: {
      handle: demoProductHandles,
    },
  });

  if (demoProducts.length) {
    await deleteProductsWorkflow(container).run({
      input: {
        ids: demoProducts.map((product) => product.id),
      },
    });
    logger.info(`Removed ${demoProducts.length} Medusa demo products.`);
  }

  if (!sourceProducts.length) {
    logger.warn("No OhMyDress products found. Run npm run commerce:export-products first.");
    return;
  }

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: {
      handle: sourceProducts.map((product) => product.handle),
    },
  });

  const existingHandles = new Set(existingProducts.map((product) => product.handle));
  const missingProducts = sourceProducts.filter(
    (product) => !existingHandles.has(product.handle)
  );

  if (!missingProducts.length) {
    logger.info(`All ${sourceProducts.length} OhMyDress products already exist.`);
    return;
  }

  const categoryNames = [...new Set(missingProducts.map((product) => product.category))];
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
    filters: {
      name: categoryNames,
    },
  });

  const categoryByName = new Map(
    existingCategories.map((category) => [category.name, category.id])
  );
  const categoriesToCreate = categoryNames
    .filter((name) => !categoryByName.has(name))
    .map((name) => ({
      name,
      is_active: true,
      metadata: {
        source: "ohmydress-shopify-import",
      },
    }));

  if (categoriesToCreate.length) {
    const { result: createdCategories } = await createProductCategoriesWorkflow(
      container
    ).run({
      input: {
        product_categories: categoriesToCreate,
      },
    });

    for (const category of createdCategories) {
      categoryByName.set(category.name, category.id);
    }
  }

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  });
  const defaultSalesChannel = salesChannels[0];

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id", "name"],
  });
  const shippingProfile = shippingProfiles[0];

  if (!shippingProfile) {
    throw new Error("No shipping profile found. Run Medusa migrations/seed first.");
  }

  await createProductsWorkflow(container).run({
    input: {
      products: missingProducts.map((product) => ({
        title: product.title,
        handle: product.handle,
        description: product.description,
        status:
          product.status === "published"
            ? ProductStatus.PUBLISHED
            : ProductStatus.DRAFT,
        category_ids: [categoryByName.get(product.category)].filter(Boolean) as string[],
        shipping_profile_id: shippingProfile.id,
        thumbnail: product.thumbnail || undefined,
        images: product.images.map((url) => ({ url })),
        metadata: {
          ...product.metadata,
          shopify_tags: product.tags,
        },
        options: product.options,
        variants: product.variants,
        sales_channels: defaultSalesChannel ? [{ id: defaultSalesChannel.id }] : [],
      })),
    },
  });

  logger.info(`Imported ${missingProducts.length} OhMyDress products into Medusa.`);
}
