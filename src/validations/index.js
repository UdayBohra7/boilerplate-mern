const authValidation = require('./auth.validation');
const userValidation = require('./user.validation');
const adminValidation = require('./admin.validation');
const categoryValidation = require('./category.validation');
const mealValidation = require('./meal.validation');
const dailyMealValidation = require('./dailyMeal.validation');
const journalValidation = require('./journal.validation');
const dailyStepsValidation = require('./dailySteps.validation');
const appSettingsValidation = require('./appSettings.validation');


module.exports = {
    authValidation,
    userValidation,
    adminValidation,
    categoryValidation,
    mealValidation,
    dailyMealValidation,
    journalValidation,
    dailyStepsValidation,
    appSettingsValidation,
};