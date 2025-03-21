const express = require('express');
const { verifyEnergyCompanyToken } = require('./helpers/verifyToken');
const { adminLogin } = require('./controllers/adminController');
const { getAllModule } = require('./controllers/moduleController');
const { getProfileDetails, updateProfile, changePassword } = require('./controllers/superAdminController');

const energyCompanyRouter = express.Router();

energyCompanyRouter.post('/energy-company/login-admin', adminLogin);
energyCompanyRouter.post('/energy-company/profile-update', verifyEnergyCompanyToken, updateProfile);
energyCompanyRouter.get('/energy-company/profile', verifyEnergyCompanyToken, getProfileDetails);
energyCompanyRouter.post('/energy-company/change-password', verifyEnergyCompanyToken, changePassword);
energyCompanyRouter.get('/energy-company/get-energy-company-sidebar/:role_id', verifyEnergyCompanyToken, getAllModule);

module.exports = energyCompanyRouter;