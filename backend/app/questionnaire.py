QUESTIONNAIRE = [
    {
        "screen": "Your Skin Rhythm",
        "questions": [
            {"id": "q4", "path": "skin_type.post_wash_feel", "text": "Post-wash feel", "type": "single", "options": {"Tight and dry": "tight_dry", "Comfortable and balanced": "balanced", "Dry on cheeks normal elsewhere": "dry_cheeks_normal_elsewhere", "Gets oily quickly all over": "oily_all_over", "Oily on forehead/nose dry on cheeks": "oily_tzone_dry_cheeks"}},
            {"id": "q5", "path": "skin_type.tzone_shine_speed", "text": "T-zone shine speed", "type": "single", "options": {"Within 30 mins": "within_30_mins", "After 1-2 hours": "after_1_2_hours", "By end of day": "end_of_day", "Rarely or never": "rarely_never"}},
            {"id": "q6", "path": "skin_type.ac_room_reaction", "text": "AC room reaction", "type": "single", "options": {"Gets flaky/very dry": "flaky_very_dry", "Feels tight but okay": "tight_but_okay", "No change": "no_change", "Gets itchy/irritated": "itchy_irritated"}},
            {"id": "q7", "path": "skin_type.moisturiser_tightness", "text": "Moisturiser tightness after 30 min", "type": "single", "options": {"Yes always": "yes_always", "Sometimes": "sometimes", "No feels fine": "no_feels_fine", "I don't use moisturiser": "no_moisturiser"}},
            {"id": "q8", "path": "skin_type.water_intake", "text": "Daily water intake", "type": "single", "options": {"<4 glasses": "lt_4", "4-6 glasses": "4_6", "6-8 glasses": "6_8", "8+ glasses": "8_plus"}},
        ],
    },
    {
        "screen": "Your Glow & Flow",
        "questions": [
            {"id": "q1", "path": "profile.gender", "text": "Gender", "type": "single", "options": {"Female": "female", "Male": "male", "Prefer not to say": "undisclosed"}},
            {"id": "q2", "path": "profile.age_range", "text": "Age range", "type": "single", "options": {"Under 18": "under_18", "18-24": "18_24", "25-34": "25_34", "35-44": "35_44", "45+": "45_plus"}},
            {"id": "q3", "path": "profile.skin_tone", "text": "Skin tone", "type": "single", "options": {"Fair/Light": "fair_light", "Medium/Wheatish": "medium_wheatish", "Olive/Tan": "olive_tan", "Deep/Dark": "deep_dark"}},
            {"id": "q13", "path": "pigmentation_texture.dark_spots", "text": "Dark spots", "type": "single", "options": {"Yes very noticeable": "very_noticeable", "A few spots": "a_few_spots", "Very faint": "very_faint", "No tone even": "even_tone"}},
            {"id": "q14", "path": "pigmentation_texture.dullness", "text": "Dullness", "type": "single", "options": {"Yes almost always": "almost_always", "Sometimes": "sometimes", "Rarely": "rarely", "No skin bright": "skin_bright"}},
            {"id": "q15", "path": "pigmentation_texture.rough_texture", "text": "Rough texture", "type": "single", "options": {"Yes rough and bumpy": "rough_bumpy", "Slightly uneven": "slightly_uneven", "Mostly smooth": "mostly_smooth", "Very smooth": "very_smooth"}},
            {"id": "q16", "path": "pigmentation_texture.sun_exposure", "text": "Sun exposure", "type": "single", "options": {"Mostly indoors": "mostly_indoors", "<=30 mins": "le_30_mins", "1-2 hours": "1_2_hours", "3+ hours outdoors": "3_plus_hours"}},
        ],
    },
    {
        "screen": "Skin Language",
        "questions": [
            {"id": "q9", "path": "acne.frequency", "text": "Pimple frequency", "type": "single", "options": {"Almost never": "almost_never", "Once a month or less": "monthly_or_less", "Few times a month": "few_times_a_month", "Every week": "every_week", "Almost always have some": "almost_always"}},
            {"id": "q10", "path": "acne.triggers", "text": "Breakout triggers", "type": "multi", "options": {"Stress/poor sleep": "stress", "Oily/junk food": "oily_food", "Before my period": "hormonal", "After new products": "new_products", "Random": "random", "I rarely break out": "rarely_breakout"}},
            {"id": "q11", "path": "acne.leaves_dark_marks", "text": "Dark mark persistence", "type": "single", "options": {"Yes stays months": "yes_stays_months", "Yes fade in weeks": "yes_fade_weeks", "Rarely": "rarely", "No fade quickly": "fade_quickly"}},
            {"id": "q12", "path": "acne.acne_type", "text": "Acne appearance", "type": "multi", "options": {"Blackheads": "blackheads", "Whiteheads": "whiteheads", "Red inflamed": "red_inflamed", "Deep cysts": "deep_cysts", "Tiny flesh-coloured bumps": "tiny_flesh_coloured_bumps", "I don't have acne": "no_acne"}},
            {"id": "q17", "path": "sensitivity.new_product_reaction", "text": "Reaction to new products", "type": "single", "options": {"Yes very easily": "very_easily", "Sometimes": "sometimes", "Rarely": "rarely", "Never": "never"}},
            {"id": "q18", "path": "sensitivity.diagnosed_conditions", "text": "Diagnosed conditions", "type": "multi", "options": {"Eczema": "eczema", "Rosacea": "rosacea", "Psoriasis": "psoriasis", "Seb. dermatitis": "seb_dermatitis", "Melasma": "melasma", "None": "none"}},
            {"id": "q19", "path": "sensitivity.known_triggers", "text": "Known triggers", "type": "multi_with_text", "options": {"Fragrance/Parfum": "fragrance", "Alcohol": "alcohol", "Retinol": "retinol", "AHAs/BHAs": "ahas_bhas", "Essential oils": "essential_oils", "Sulphates": "sulphates", "None": "none"}},
            {"id": "q20", "path": "sensitivity.switching_reaction", "text": "Switching reaction", "type": "single", "options": {"Fine adapts quickly": "adapts_quickly", "Needs few days": "needs_few_days", "Often breaks out": "often_breaks_out", "Rarely switches": "rarely_switches"}},
        ],
    },
    {
        "screen": "Your Routine, Your Way",
        "questions": [
            {"id": "q21", "path": "habits.skincare_frequency", "text": "Skincare frequency", "type": "single", "options": {"Morning & night": "morning_night", "Once a day": "once_daily", "Few times a week": "few_times_week", "Rarely": "rarely", "Just starting out": "starting_out"}},
            {"id": "q22", "path": "habits.sunscreen_usage", "text": "Sunscreen usage", "type": "single", "options": {"Every day": "every_day", "Only when outside": "outside_only", "Occasionally": "occasionally", "Never": "never"}},
            {"id": "q23", "path": "habits.monthly_budget_inr", "text": "Monthly budget", "type": "single", "options": {"Under Rs.500": "under_500", "Rs.500-1,500": "500_to_1500", "Rs.1,500-3,000": "1500_to_3000", "Rs.3,000+": "3000_plus"}},
            {"id": "q24", "path": "habits.primary_concern", "text": "Primary concern", "type": "single", "required": True, "options": {"Acne & breakouts": "acne_breakouts", "Dark spots & pigmentation": "dark_spots_pigmentation", "Dryness & dehydration": "dryness_dehydration", "Oiliness & shine": "oiliness_shine", "Dullness - more glow": "dullness_glow", "Anti-ageing & fine lines": "anti_ageing_fine_lines", "Sensitive/reactive skin": "sensitive_reactive"}},
            {"id": "q25", "path": "habits.decision_driver", "text": "Decision driver", "type": "single", "options": {"Ingredient list": "ingredient_list", "Customer reviews": "customer_reviews", "Dermatologist recommended": "dermatologist_recommended", "Brand name": "brand_name", "Price/value": "price_value"}},
        ],
    },
]
