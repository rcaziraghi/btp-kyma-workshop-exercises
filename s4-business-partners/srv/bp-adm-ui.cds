using business.partners.srv.AdminService as srv from './bp-adm-service';

////////////////////////////////////////////////////////////////////////////
//
// UI annotations for the BusinessPartners Entity
//
annotate srv.BusinessPartners with @(UI : {
    CreateHidden               : false,
    UpdateHidden               : false,
    DeleteHidden               : true,
    Identification             : [{Value : BusinessPartner}],
    HeaderInfo                 : {
        $Type          : 'UI.HeaderInfoType',
        TypeName       : 'Business Partner',
        TypeNamePlural : 'Business Partners',
        Title          : {
            $Type : 'UI.DataField',
            Value : BusinessPartner
        },
        Description    : {
            $Type : 'UI.DataField',
            Value : BusinessPartnerFullName
        }
    },
    SelectionFields            : [
        BusinessPartner,
        FirstName,
        LastName,
        BirthDate
    ],
    LineItem                   : [
        {
            $Type : 'UI.DataField',
            Value : BusinessPartner
        },
        {
            $Type : 'UI.DataField',
            Value : BusinessPartnerFullName
        },
        {
            $Type : 'UI.DataField',
            Value : BirthDate
        }
    ],
    HeaderFacets               : [
        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'HeaderBusinessPartner',
            Target : '@UI.DataPoint#BusinessPartner'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Target : '@UI.FieldGroup#Detail'
        }
    ],
    Facets                     : [{
        $Type  : 'UI.ReferenceFacet',
        ID     : 'BusinessPartnerDetails',
        Target : '@UI.FieldGroup#Details',
        Label  : 'Details'
    }],
    DataPoint #BusinessPartner : {
        Value : BusinessPartnerFullName,
        Title : 'Name'
    },
    FieldGroup #Detail         : {Data : [{
        $Type : 'UI.DataField',
        Value : BusinessPartner
    }]},
    FieldGroup #Details        : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            {
                $Type : 'UI.DataField',
                Value : FirstName,
                Label : 'First Name'
            },
            {
                $Type : 'UI.DataField',
                Value : LastName,
                Label : 'Last Name'
            },
            {
                $Type : 'UI.DataField',
                Value : BirthDate,
                Label : 'Birth Date'
            }
        ]
    },
});

annotate srv.BusinessPartners with {
    BusinessPartner         @(title : 'Business Partner ID');
    BusinessPartnerFullName @(title : 'Name')  @readonly;
    FirstName               @(title : 'First Name');
    LastName                @(title : 'Last Name');
    BirthDate               @(title : 'Birth Date');
    BusinessPartnerCategory @(
        title     : 'Category',
        UI.Hidden : true,
    ) @readonly;
}

annotate srv.BusinessPartners @(Capabilities : {
    FilterRestrictions : {
        $Type : 'Capabilities.FilterRestrictionsType',
        Filterable : false
    },
    SearchRestrictions : {
        $Type      : 'Capabilities.SearchRestrictionsType',
        Searchable : true
    },
    InsertRestrictions : {
        $Type      : 'Capabilities.InsertRestrictionsType',
        Insertable : true
    },
    UpdateRestrictions : {
        $Type     : 'Capabilities.UpdateRestrictionsType',
        Updatable : true
    },
    DeleteRestrictions : {
        $Type     : 'Capabilities.DeleteRestrictionsType',
        Deletable : false
    },
    Insertable         : true,
    Updatable          : true,
    Deletable          : false
});

