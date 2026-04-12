const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const helpAndSupportValidation = require('../../../validations/helpAndSupport.validation');
const helpAndSupportController = require('../../../controllers/admin.controller/helpAndSupport.controller');
const adminAuth = require('../../../middlewares/adminAuth');

const router = express.Router();

router
    .route('/')
    .get(adminAuth(), validate(helpAndSupportValidation.getHelpAndSupports), helpAndSupportController.getHelpAndSupports);

router
    .route('/:helpSupportId')
    .get(adminAuth(), validate(helpAndSupportValidation.getHelpAndSupport), helpAndSupportController.getHelpAndSupport)
    .patch(adminAuth(), validate(helpAndSupportValidation.updateHelpAndSupport), helpAndSupportController.updateHelpAndSupport)
    .delete(adminAuth(), validate(helpAndSupportValidation.deleteHelpAndSupport), helpAndSupportController.deleteHelpAndSupport);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: HelpAndSupport
 *   description: Help and Support management
 */

/**
 * @swagger
 * /admin/help-support:
 *   get:
 *     summary: Get all help and support inquiries
 *     description: Retrieve all help and support inquiries with pagination and filtering.
 *     tags: [HelpAndSupport]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *       - in: query
 *         name: isResolved
 *         schema:
 *           type: boolean
 *         description: Filter by resolution status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. createdAt:desc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of results
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/HelpAndSupport'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /admin/help-support/{helpSupportId}:
 *   get:
 *     summary: Get a help and support inquiry
 *     description: Fetch a single help and support inquiry by ID.
 *     tags: [HelpAndSupport]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: helpSupportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Help and Support ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HelpAndSupport'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a help and support inquiry
 *     description: Update resolution status of a help and support inquiry.
 *     tags: [HelpAndSupport]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: helpSupportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Help and Support ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isResolved:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HelpAndSupport'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a help and support inquiry
 *     description: Delete a help and support inquiry by ID.
 *     tags: [HelpAndSupport]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: helpSupportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Help and Support ID
 *     responses:
 *       "204":
 *         description: No Content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
