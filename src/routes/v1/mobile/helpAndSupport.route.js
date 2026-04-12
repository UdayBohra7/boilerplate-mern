const express = require('express');
const validate = require('../../../middlewares/validate');
const helpAndSupportValidation = require('../../../validations/helpAndSupport.validation');
const helpAndSupportController = require('../../../controllers/mobile/helpAndSupport.controller');
const auth = require('../../../middlewares/auth');

const router = express.Router();

router
    .route('/')
    .post(auth(), validate(helpAndSupportValidation.createHelpAndSupport), helpAndSupportController.createHelpAndSupport);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: HelpAndSupport
 *   description: Help and Support management
 */

/**
 * @swagger
 * /mobile/help-support:
 *   post:
 *     summary: Create a help and support inquiry
 *     description: Submit a new help and support inquiry.
 *     tags: [HelpAndSupport]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HelpAndSupport'
 */
