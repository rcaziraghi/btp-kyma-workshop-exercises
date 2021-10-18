namespace business.partners.srv;

service AdminService @(path : '/bp-adm', requires:'authenticated-user') {
    @Capabilities : {
        SearchRestrictions.Searchable : true,
        InsertRestrictions.Insertable : true,
        UpdateRestrictions.Updatable  : true,
        DeleteRestrictions.Deletable  : false,
    }

    @odata.draft.enabled
    entity BusinessPartners {
        key BusinessPartner         : String;
            FirstName               : String;
            LastName                : String;
            BusinessPartnerFullName : String;
            BirthDate               : Date;
            BusinessPartnerCategory : String default '1';
    }
}
