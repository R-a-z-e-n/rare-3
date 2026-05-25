DEFAULT_PRODUCTS = [
    {
        "product_id": "rare-001",
        "name": "Calm Balance Niacinamide Serum",
        "company": "RARE Reflection",
        "ingredients": ["niacinamide", "zinc_pca", "panthenol"],
        "price": 699,
        "category": "serum",
        "concerns_addressed": ["acne", "oiliness_shine", "dark_spots_pigmentation"],
        "is_sponsored": True,
    },
    {
        "product_id": "rare-002",
        "name": "Bright Barrier Vitamin C Gel",
        "company": "RARE Reflection",
        "ingredients": ["vitamin_c", "ferulic_acid", "hyaluronic_acid"],
        "price": 1299,
        "category": "serum",
        "concerns_addressed": ["dark_spots_pigmentation", "dullness_glow"],
        "is_sponsored": True,
    },
    {
        "product_id": "rare-003",
        "name": "Daily Dew SPF 50 PA++++",
        "company": "RARE Reflection",
        "ingredients": ["zinc_oxide", "uv_filters", "niacinamide"],
        "price": 549,
        "category": "sunscreen",
        "concerns_addressed": ["dark_spots_pigmentation", "anti_ageing_fine_lines"],
    },
    {
        "product_id": "rare-004",
        "name": "Soft Reset Salicylic Cleanser",
        "company": "RARE Reflection",
        "ingredients": ["salicylic_acid", "green_tea", "glycerin"],
        "price": 449,
        "category": "cleanser",
        "concerns_addressed": ["acne", "oiliness_shine", "texture"],
    },
    {
        "product_id": "rare-005",
        "name": "Cloud Cream Ceramide Moisturiser",
        "company": "RARE Reflection",
        "ingredients": ["ceramides", "cholesterol", "panthenol", "glycerin"],
        "price": 799,
        "category": "moisturiser",
        "concerns_addressed": ["dryness_dehydration", "sensitive_reactive"],
    },
    {
        "product_id": "rare-006",
        "name": "Even Tone Azelaic Emulsion",
        "company": "RARE Reflection",
        "ingredients": ["azelaic_acid", "licorice_extract", "allantoin"],
        "price": 1199,
        "category": "treatment",
        "concerns_addressed": ["dark_spots_pigmentation", "acne", "sensitive_reactive"],
    },
    {
        "product_id": "rare-007",
        "name": "Hydra Plump Hyaluronic Gel",
        "company": "RARE Reflection",
        "ingredients": ["hyaluronic_acid", "glycerin", "betaine"],
        "price": 399,
        "category": "moisturiser",
        "concerns_addressed": ["dryness_dehydration", "dullness_glow"],
    },
    {
        "product_id": "rare-008",
        "name": "Gentle Renew Retinol Cream",
        "company": "RARE Reflection",
        "ingredients": ["retinol", "peptides", "ceramides"],
        "price": 1499,
        "category": "night_cream",
        "concerns_addressed": ["anti_ageing_fine_lines", "texture"],
    },
]


def build_extra_products() -> list[dict]:
    companies = [
        "RARE Reflection",
        "DermaKind",
        "GlowLabs",
        "Aarya Skin",
        "Noor Botanics",
        "Urban Derm",
        "CicaCraft",
        "SunVeil",
        "Barrier Co",
        "ClearRoot",
    ]
    formulas = [
        ("Niacinamide Balance Serum", ["niacinamide", "zinc_pca", "glycerin"], "serum", ["oiliness_shine", "acne"], 499),
        ("Azelaic Spot Corrector", ["azelaic_acid", "licorice_extract", "allantoin"], "treatment", ["dark_spots_pigmentation", "acne"], 799),
        ("Vitamin C Glow Serum", ["vitamin_c", "ferulic_acid", "hyaluronic_acid"], "serum", ["dark_spots_pigmentation", "dullness_glow"], 899),
        ("Ceramide Barrier Cream", ["ceramides", "panthenol", "glycerin"], "moisturiser", ["dryness_dehydration", "sensitive_reactive"], 549),
        ("Salicylic Gel Cleanser", ["salicylic_acid", "green_tea", "glycerin"], "cleanser", ["acne", "oiliness_shine"], 349),
        ("Hyaluronic Water Gel", ["hyaluronic_acid", "betaine", "glycerin"], "moisturiser", ["dryness_dehydration", "dullness_glow"], 399),
        ("Zinc Mineral SPF 50", ["zinc_oxide", "uv_filters", "niacinamide"], "sunscreen", ["dark_spots_pigmentation", "anti_ageing_fine_lines"], 599),
        ("Retinol Night Repair", ["retinol", "peptides", "ceramides"], "night_cream", ["anti_ageing_fine_lines", "texture"], 999),
        ("Cica Calm Gel", ["centella_asiatica", "panthenol", "allantoin"], "moisturiser", ["sensitive_reactive", "redness"], 449),
        ("Peptide Firming Lotion", ["peptides", "ceramides", "hyaluronic_acid"], "treatment", ["anti_ageing_fine_lines", "dryness_dehydration"], 1199),
    ]

    products: list[dict] = []
    for index in range(50):
        formula_name, ingredients, category, concerns, base_price = formulas[index % len(formulas)]
        company = companies[index % len(companies)]
        variant = (index // len(formulas)) + 1
        price = base_price + (variant - 1) * 120 + (index % 5) * 30
        products.append(
            {
                "product_id": f"seed-{index + 1:03d}",
                "name": f"{company} {formula_name} {variant}",
                "company": company,
                "ingredients": ingredients,
                "price": price,
                "category": category,
                "concerns_addressed": concerns,
                "is_sponsored": company == "RARE Reflection",
            }
        )
    return products


EXTRA_PRODUCTS = build_extra_products()
ALL_SEED_PRODUCTS = DEFAULT_PRODUCTS + EXTRA_PRODUCTS
