"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => async (req, res, next) => {
    try {
        const parsed = await schema.parseAsync({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        // ✅ Don't overwrite req.query/req.params directly
        // Attach validated data to a custom property
        req.validated = parsed;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.validate = validate;
