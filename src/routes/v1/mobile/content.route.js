const express = require('express');
const contentController = require('../../../controllers/mobile/content.controller');

const router = express.Router();

router
    .route('/privacy-policy')
    .get(contentController.getPrivacyPolicy);

router
    .route('/terms-and-conditions')
    .get(contentController.getTermsAndConditions);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Content
 *   description: Content retrieval (Privacy Policy, Terms, etc.)
 */

/**
 * @swagger
 * /mobile/content/privacy-policy:
 *   get:
 *     summary: Get Privacy Policy
 *     description: Retrieve the Privacy Policy content.
 *     tags: [Content]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /mobile/content/terms-and-conditions:
 *   get:
 *     summary: Get Terms and Conditions
 *     description: Retrieve the Terms and Conditions content.
 *     tags: [Content]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
