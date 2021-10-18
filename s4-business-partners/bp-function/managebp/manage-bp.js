const { BusinessPartner } = require("@sap/cloud-sdk-vdm-business-partner-service");
const moment = require("moment");

function convert2CDSFormat(businessPartner) {
    return {
        BusinessPartner: businessPartner.businessPartner,
        FirstName: businessPartner.firstName,
        LastName: businessPartner.lastName,
        BirthDate: businessPartner.birthDate.format('YYYY-MM-DD').toString(),
        BusinessPartnerCategory: businessPartner.businessPartnerCategory
    };
}

async function executeOperation(msg) {
    const destName = (process.env.destination) ? JSON.parse(process.env.destination).name : "S4HC";
    const req = BusinessPartner.requestBuilder();

    const businessPartner = BusinessPartner
        .builder()
        .businessPartner(msg.entity.BusinessPartner)
        .firstName(msg.entity.FirstName)
        .lastName(msg.entity.LastName)
        .birthDate(moment(msg.entity.BirthDate))
        .businessPartnerCategory("1")
        .build();

    let operation;

    switch (msg.method.toUpperCase()) {
        case "POST": operation = req.create(businessPartner); break;
        case "PATCH": operation = req.update(businessPartner); break;
        default: operation = req.create(businessPartner);
    }

    const bp = await operation.execute({ destinationName: destName });
    return convert2CDSFormat(bp);
}

module.exports = {
    executeOperation
}