const cds = require('@sap/cds');
const config = require('../package.json');
const moment = require('moment');
const { createOrUpdateBusinessPartner } = require('./helper.js');

module.exports = cds.service.impl(async function () {
    /***
    * Initial BOOTSTRAP for this CAP service
    ***/
    // Fetch entities
    const { BusinessPartners } = this.entities;

    // Connect to S/4HANA Cloud OData Service according to configured destination and path
    let dest;
    if (process.env.VCAP_APPLICATION) {
        dest = (JSON.parse(process.env.VCAP_APPLICATION).destinations[0].name) ?
            JSON.parse(process.env.VCAP_APPLICATION).destinations[0].name :
            config.cds.requires.API_BUSINESS_PARTNER.credentials.destination;
    } else {
        dest = config.cds.requires.API_BUSINESS_PARTNER.credentials.destination;
    }
    const path = config.cds.requires.API_BUSINESS_PARTNER.credentials.path;
    const bpService = await cds.connect.to('API_BUSINESS_PARTNER', { credentials: { destination: dest, path: path } });

    // Prepare OData query to fetch Business Partners of category "Person") from S/4HANA Cloud with no $top (full table)
    const queryBP = SELECT.from('A_BusinessPartner').columns(['BusinessPartner', 'FirstName', 'LastName', 'BusinessPartnerFullName', 'BirthDate', 'BusinessPartnerCategory']).where({ BusinessPartnerCategory: '1' });

    // First data read operation control flag 
    var firstRead = true;

    /***
    * READ handler for 'BusinessPartners' entity
    ***/
    this.before('READ', BusinessPartners, async (req) => {
        // This handler has been implemented to populate the SQLite in-memory DB at first read operation 
        try {
            try {
                // Whenever a READ attempt is done in the current request context,
                // we check whether the table exists in the SQLite in-memory DB 
                const checkQuery = SELECT.one().from('business.partners.srv.AdminService.BusinessPartners').columns(['BusinessPartner']);
                await cds.tx(req).run(checkQuery);
            } catch (err) {
                // Read failed, so the table does not exist in the SQLite in-memory DB,
                // then we explicitly deploy de DB structure and reset the first read control flag
                const csn = await cds.compile('file:./srv/csn.json');
                const ddl = cds.compile(csn).to.sql({ dialect: 'sqlite' });
                await cds.tx(req).run(ddl);

                firstRead = true;
            }

            if (firstRead) {
                // Fetch Business Partners from S/4HANA Cloud
                const bpDataset = await bpService.run(queryBP);

                // Fix S/4HANA dates
                bpDataset.forEach(bp => {
                    if (bp.BirthDate && bp.BirthDate.toString().substr(0, 1) === '/') {
                        const ticks = bp.BirthDate.toString().substr(6, 12);
                        const mmt = moment(new Date(parseInt(ticks)));
                        bp.BirthDate = mmt.format('YYYY-MM-DD').toString();
                    }
                });

                // Insert Business Partners into SQLite in-memory DB
                const insertQuery = INSERT.into('business.partners.srv.AdminService.BusinessPartners').entries(bpDataset);
                await cds.tx(req).run(insertQuery);

                // Reset control flag
                firstRead = false;
            }
            return req;
        } catch (err) {
            req.error(err.code, err.message);
        }
    });

    /***
    * CREATE handlers for 'BusinessPartners' entity
    ***/
    this.before('CREATE', BusinessPartners, async (req) => {
        try {
            // Fill the "calculated" BusinessPartnerFullName
            req.query.INSERT.entries.forEach(entry => {
                entry.BusinessPartnerFullName = entry.FirstName + ' ' + entry.LastName;
            });
            return req;
        } catch (err) {
            req.error(err.code, err.message);
        }
    });

    this.after('CREATE', BusinessPartners, async (data, req) => {
        try {
            // Create BP in S4
            const res = await createOrUpdateBusinessPartner(req);
            return res;
        } catch (err) {
            // On error (BP not created in S/4HANA) we need to rollback the transaction
            // in the in-memory db
            cds.tx(req).rollback();
            req.error(err.code, err.message);
        }
    });

    /***
    * UPDATE handlers for 'BusinessPartners' entity
    ***/
    this.before('UPDATE', BusinessPartners, async (req) => {
        try {
            // Update the "calculated" BusinessPartnerFullName
            req.query.UPDATE.data.BusinessPartnerFullName = req.query.UPDATE.data.FirstName + ' ' + req.query.UPDATE.data.LastName;
            return req;
        } catch (err) {
            req.error(err.code, err.message);
        }
    });

    this.after('UPDATE', BusinessPartners, async (data, req) => {
        try {
            // Update BP in S4
            if (!req.data.BusinessPartner) {
                req.data["BusinessPartner"] = req.params[0].BusinessPartner;
            }
            const res = await createOrUpdateBusinessPartner(req);
            return res;
        } catch (err) {
            // On error (BP not updated in S/4HANA) we need to rollback the transaction
            // in the in-memory db
            cds.tx(req).rollback();
            req.error(err.code, err.message);
        }
    });
});
