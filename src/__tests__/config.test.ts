import { describe, expect, it } from "vitest";
import { flattenRoutes } from "../config";

describe("flattenRoutes(...)", () => {
  it("generates mapping from user provided route translations", () => {
    const routeTranslations = {
      fr: {
        about: "a-propos",
        "contact-us": "contactez-nous",
        products: {
          index: "produits",
          merchants: "marchands",
          categories: {
            index: "categories",
            fruits: "fruits",
          },
          "[id]": {
            details: "details",
            edit: "modifier",
          },
        },
        blog: {
          index: "blogos",
        },
      },
      es: {
        about: "a-proposito",
        "contact-us": "contactenos",
        products: {
          index: "productos",
          merchants: "comerciantes",
          categories: {
            index: "categorias",
            fruits: "frutas",
          },
          "[id]": {
            details: "detalles",
            edit: "editar",
          },
        },
        blog: {
          index: "blogos",
        },
      },
    };

    expect(flattenRoutes(routeTranslations)).toStrictEqual({
      "/fr/about": "/fr/a-propos",
      "/fr/contact-us": "/fr/contactez-nous",
      "/fr/products": "/fr/produits",
      "/fr/products/index": "/fr/produits/index",
      "/fr/products/merchants": "/fr/produits/marchands",
      "/fr/products/categories": "/fr/produits/categories",
      "/fr/products/categories/index": "/fr/produits/categories/index",
      "/fr/products/categories/fruits": "/fr/produits/categories/fruits",
      "/fr/products/[id]/details": "/fr/produits/[id]/details",
      "/fr/products/[id]/edit": "/fr/produits/[id]/modifier",
      "/fr/blog": "/fr/blogos",
      "/fr/blog/index": "/fr/blogos/index",
      "/es/about": "/es/a-proposito",
      "/es/contact-us": "/es/contactenos",
      "/es/products": "/es/productos",
      "/es/products/index": "/es/productos/index",
      "/es/products/merchants": "/es/productos/comerciantes",
      "/es/products/categories": "/es/productos/categorias",
      "/es/products/categories/index": "/es/productos/categorias/index",
      "/es/products/categories/fruits": "/es/productos/categorias/frutas",
      "/es/products/[id]/details": "/es/productos/[id]/detalles",
      "/es/products/[id]/edit": "/es/productos/[id]/editar",
      "/es/blog": "/es/blogos",
      "/es/blog/index": "/es/blogos/index",
    });
  });
});
