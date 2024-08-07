requiere('dotenv').config();

module.exports = {
    dbUri: ProcessingInstruction.env.DB_URI,
    port: ProcessingInstruction.env.PORT || 3000
};