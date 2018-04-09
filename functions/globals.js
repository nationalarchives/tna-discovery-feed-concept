module.exports.ensure_authenticated = function (req, res, next) {

    if(req.connection.remoteAddress != '::1' && req.connection.remoteAddress != '::ffff:127.0.0.1'){
        res.redirect("http://nationalarchives.gov.uk");
    }
    else {
        if(req.isAuthenticated()){
            return next();
        }
        else {
            req.flash('error_msg', 'You are not logged in');
            res.redirect('/users/login');
        }
    }

}

let taxonomies_array = ["Africa","Aid and development","Air Force","Air transport","Americas","Ancient Monuments and Historical Buildings","Archives and libraries","Armed Forces (General Administration)","Army","Art, architecture and design","Asia","Australia and Pacific","Badges and insignia","Banking","Canals and river transport","Caribbean","Census","Charities","Chartism","Children","Clothing","Coal","Common land","Communications","Communism","Computing","Conflict","Conscientious objection","Construction industries","Conveyancing","Crime","Crown lands and estates","Debt","Democracy","Devolution","Diaries","Disability","Disarmament","Disasters and emergencies","Disease","Education","Electoral reform","Electricity","Europe and Russia","Events and exhibitions","Farming","Fascism","Fishing","Food and drink","Forestry","Freemasons","Friendly societies","Government finances","Hospitals","Housing","Hunting","Indian Subcontinent","Inflation","Intelligence","International","Internment","Ireland","Iron, steel and metals","Labour","Landed estates","Legal","Literature","Litigation","Local Government","Manors","Manufacturing","Maps and plans","Marriage and divorce","Medals","Medicine","Mental illness","Merchant seaman","Middle East","Migration","Mining and quarrying","Museums and galleries","Mutual societies","National debt","National Health Service","Nationality","Navy","Nuclear energy","Nursing","Official publications","Oil and gas","Operations, battles and campaigns","Pardons","Pay and pensions","Performing arts","Personal and family papers","Photography and film","Piracy and privateering","Planning (Land and Property)","Polar","Policing","Population","Poverty","Prisons","Public disorder","Race relations","Radio and television","Railways","Rationing","Refugees","Religions","Religious discrimination and persecution","Renewable energies","Research","Resources","Road transport","Royal Parks","Royalty","Sewerage","Sex and gender","Shipping","Slavery","Sports","Taxation","Tithes","Trade and commerce","Transport management","Transportation","Travel and tourism","Treason and rebellion","Treaties and alliances","UFOs","Votes for women","Weapons","Welfare","Wills and probate","Witchcraft"]

exports.taxonomies_array = taxonomies_array;
