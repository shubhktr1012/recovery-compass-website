type JsonSchema = Record<string, unknown>;

const stringSchema = { type: "string" } as const;
const booleanSchema = { type: "boolean" } as const;

function stringArraySchema(minItems = 0): JsonSchema {
    return {
        type: "array",
        minItems,
        items: stringSchema,
    };
}

function objectSchema(
    properties: Record<string, JsonSchema>,
    required: string[],
    description?: string
): JsonSchema {
    return {
        type: "object",
        ...(description ? { description } : {}),
        properties,
        required,
        additionalProperties: false,
    };
}

const trackSchema = objectSchema(
    {
        items: stringArraySchema(3),
        note: stringSchema,
    },
    ["items", "note"],
    "Meal track with concrete food items and a condition-specific note."
);

const nullableTrackSchema = {
    type: ["object", "null"],
    properties: trackSchema.properties,
    required: trackSchema.required,
    additionalProperties: false,
} satisfies JsonSchema;

const mealOptionSchema = objectSchema(
    {
        title: stringSchema,
        veg: trackSchema,
        nonveg: nullableTrackSchema,
    },
    ["title", "veg", "nonveg"]
);

const mealSchema = objectSchema(
    {
        timing: stringSchema,
        intro: stringSchema,
        options: {
            type: "array",
            minItems: 3,
            items: mealOptionSchema,
        },
    },
    ["timing", "intro", "options"]
);

const snackSchema = objectSchema(
    {
        timing: stringSchema,
        intro: stringSchema,
        veg: stringArraySchema(2),
        nonveg: stringArraySchema(0),
    },
    ["timing", "intro", "veg", "nonveg"]
);

const bedtimeSchema = objectSchema(
    {
        timing: stringSchema,
        items: stringArraySchema(3),
    },
    ["timing", "items"]
);

const venueSchema = objectSchema(
    {
        name: stringSchema,
        veg: stringArraySchema(1),
        nonveg: stringArraySchema(0),
        skip: stringArraySchema(1),
    },
    ["name", "veg", "nonveg", "skip"]
);

const plannerDaySchema = objectSchema(
    {
        day: stringSchema,
        breakfast: stringSchema,
        lunch: stringSchema,
        dinner: stringSchema,
    },
    ["day", "breakfast", "lunch", "dinner"]
);

export const DIET_PLAN_RESPONSE_SCHEMA = objectSchema(
    {
        meta: objectSchema(
            {
                clientLabel: stringSchema,
                goal: stringSchema,
                programs: stringArraySchema(0),
                isDualTrack: booleanSchema,
            },
            ["clientLabel", "goal", "programs", "isDualTrack"]
        ),
        about: stringArraySchema(1),
        dos: stringArraySchema(4),
        donts: stringArraySchema(4),
        meals: objectSchema(
            {
                breakfast: mealSchema,
                midMorning: snackSchema,
                lunch: mealSchema,
                afternoon: snackSchema,
                dinner: mealSchema,
                bedtime: bedtimeSchema,
            },
            ["breakfast", "midMorning", "lunch", "afternoon", "dinner", "bedtime"]
        ),
        diningOut: objectSchema(
            {
                venues: {
                    type: "array",
                    minItems: 2,
                    items: venueSchema,
                },
                travelTips: stringArraySchema(3),
            },
            ["venues", "travelTips"]
        ),
        weeklyPlanner: objectSchema(
            {
                veg: {
                    type: "array",
                    minItems: 7,
                    items: plannerDaySchema,
                },
                nonveg: {
                    type: "array",
                    minItems: 0,
                    items: plannerDaySchema,
                },
            },
            ["veg"]
        ),
        keyFoods: stringArraySchema(4),
        familyMealRules: stringArraySchema(0),
        programNotes: stringArraySchema(0),
    },
    [
        "meta",
        "about",
        "dos",
        "donts",
        "meals",
        "diningOut",
        "weeklyPlanner",
        "keyFoods",
        "familyMealRules",
        "programNotes",
    ],
    "Complete Recovery Compass personalised diet plan."
);

export type DietPlanValidationResult =
    | { success: true; data: Record<string, unknown> }
    | { success: false; errors: string[] };

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isStringArray(value: unknown) {
    return Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim().length > 0);
}

function pushIfMissing(errors: string[], condition: boolean, message: string) {
    if (!condition) {
        errors.push(message);
    }
}

function validateStringArray(
    errors: string[],
    value: unknown,
    path: string,
    minItems = 0
) {
    pushIfMissing(errors, isStringArray(value), `${path} must be an array of non-empty strings`);
    if (Array.isArray(value)) {
        pushIfMissing(errors, value.length >= minItems, `${path} must contain at least ${minItems} item(s)`);
    }
}

function validateTrack(errors: string[], value: unknown, path: string, nullable = false) {
    if (value === null && nullable) {
        return;
    }

    if (!isRecord(value)) {
        errors.push(`${path} must be an object${nullable ? " or null" : ""}`);
        return;
    }

    validateStringArray(errors, value.items, `${path}.items`, 3);
    pushIfMissing(errors, typeof value.note === "string" && value.note.trim().length > 0, `${path}.note is required`);
}

function validateMeal(errors: string[], value: unknown, path: string, minOptions: number) {
    if (!isRecord(value)) {
        errors.push(`${path} must be an object`);
        return;
    }

    pushIfMissing(errors, typeof value.timing === "string" && value.timing.trim().length > 0, `${path}.timing is required`);
    pushIfMissing(errors, typeof value.intro === "string" && value.intro.trim().length > 0, `${path}.intro is required`);

    if (!Array.isArray(value.options)) {
        errors.push(`${path}.options must be an array`);
        return;
    }

    pushIfMissing(errors, value.options.length >= minOptions, `${path}.options must contain at least ${minOptions} option(s)`);

    value.options.forEach((option, index) => {
        if (!isRecord(option)) {
            errors.push(`${path}.options[${index}] must be an object`);
            return;
        }

        pushIfMissing(errors, typeof option.title === "string" && option.title.trim().length > 0, `${path}.options[${index}].title is required`);
        validateTrack(errors, option.veg, `${path}.options[${index}].veg`);
        validateTrack(errors, option.nonveg, `${path}.options[${index}].nonveg`, true);
    });
}

function validateSnack(errors: string[], value: unknown, path: string) {
    if (!isRecord(value)) {
        errors.push(`${path} must be an object`);
        return;
    }

    pushIfMissing(errors, typeof value.timing === "string" && value.timing.trim().length > 0, `${path}.timing is required`);
    pushIfMissing(errors, typeof value.intro === "string" && value.intro.trim().length > 0, `${path}.intro is required`);
    validateStringArray(errors, value.veg, `${path}.veg`, 2);
    validateStringArray(errors, value.nonveg, `${path}.nonveg`, 0);
}

function validatePlannerDays(errors: string[], value: unknown, path: string, minItems: number) {
    if (!Array.isArray(value)) {
        errors.push(`${path} must be an array`);
        return;
    }

    pushIfMissing(errors, value.length >= minItems, `${path} must contain at least ${minItems} days`);
    value.forEach((day, index) => {
        if (!isRecord(day)) {
            errors.push(`${path}[${index}] must be an object`);
            return;
        }

        for (const key of ["day", "breakfast", "lunch", "dinner"]) {
            pushIfMissing(
                errors,
                typeof day[key] === "string" && day[key].trim().length > 0,
                `${path}[${index}].${key} is required`
            );
        }
    });
}

export function validateDietPlanJson(value: unknown): DietPlanValidationResult {
    const errors: string[] = [];

    if (!isRecord(value)) {
        return { success: false, errors: ["Diet plan must be a JSON object"] };
    }

    if (!isRecord(value.meta)) {
        errors.push("meta must be an object");
    } else {
        pushIfMissing(errors, typeof value.meta.clientLabel === "string", "meta.clientLabel is required");
        pushIfMissing(errors, typeof value.meta.goal === "string", "meta.goal is required");
        pushIfMissing(errors, typeof value.meta.isDualTrack === "boolean", "meta.isDualTrack must be boolean");
        validateStringArray(errors, value.meta.programs, "meta.programs", 0);
    }

    validateStringArray(errors, value.about, "about", 1);
    validateStringArray(errors, value.dos, "dos", 4);
    validateStringArray(errors, value.donts, "donts", 4);

    if (!isRecord(value.meals)) {
        errors.push("meals must be an object");
    } else {
        validateMeal(errors, value.meals.breakfast, "meals.breakfast", 4);
        validateSnack(errors, value.meals.midMorning, "meals.midMorning");
        validateMeal(errors, value.meals.lunch, "meals.lunch", 3);
        validateSnack(errors, value.meals.afternoon, "meals.afternoon");
        validateMeal(errors, value.meals.dinner, "meals.dinner", 4);

        if (!isRecord(value.meals.bedtime)) {
            errors.push("meals.bedtime must be an object");
        } else {
            pushIfMissing(errors, typeof value.meals.bedtime.timing === "string", "meals.bedtime.timing is required");
            validateStringArray(errors, value.meals.bedtime.items, "meals.bedtime.items", 3);
        }
    }

    if (!isRecord(value.diningOut)) {
        errors.push("diningOut must be an object");
    } else {
        if (!Array.isArray(value.diningOut.venues)) {
            errors.push("diningOut.venues must be an array");
        } else {
            pushIfMissing(errors, value.diningOut.venues.length >= 2, "diningOut.venues must contain at least 2 venues");
            value.diningOut.venues.forEach((venue, index) => {
                if (!isRecord(venue)) {
                    errors.push(`diningOut.venues[${index}] must be an object`);
                    return;
                }
                pushIfMissing(errors, typeof venue.name === "string" && venue.name.trim().length > 0, `diningOut.venues[${index}].name is required`);
                validateStringArray(errors, venue.veg, `diningOut.venues[${index}].veg`, 1);
                validateStringArray(errors, venue.nonveg, `diningOut.venues[${index}].nonveg`, 0);
                validateStringArray(errors, venue.skip, `diningOut.venues[${index}].skip`, 1);
            });
        }

        validateStringArray(errors, value.diningOut.travelTips, "diningOut.travelTips", 3);
    }

    if (!isRecord(value.weeklyPlanner)) {
        errors.push("weeklyPlanner must be an object");
    } else {
        validatePlannerDays(errors, value.weeklyPlanner.veg, "weeklyPlanner.veg", 7);
        if (value.meta && isRecord(value.meta) && value.meta.isDualTrack === true) {
            validatePlannerDays(errors, value.weeklyPlanner.nonveg, "weeklyPlanner.nonveg", 7);
        } else if (value.weeklyPlanner.nonveg !== undefined) {
            validatePlannerDays(errors, value.weeklyPlanner.nonveg, "weeklyPlanner.nonveg", 0);
        }
    }

    validateStringArray(errors, value.keyFoods, "keyFoods", 4);
    validateStringArray(errors, value.familyMealRules, "familyMealRules", 0);
    validateStringArray(errors, value.programNotes, "programNotes", 0);

    return errors.length
        ? { success: false, errors }
        : { success: true, data: value };
}
