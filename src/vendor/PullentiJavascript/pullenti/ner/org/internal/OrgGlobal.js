/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const Hashtable = require("./../../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");
const Stream = require("./../../../unisharp/Stream");
const MemoryStream = require("./../../../unisharp/MemoryStream");
const XmlDocument = require("./../../../unisharp/XmlDocument");

const OrganizationReferent = require("./../OrganizationReferent");
const EpNerOrgInternalResourceHelper = require("./EpNerOrgInternalResourceHelper");
const SourceOfAnalysis = require("./../../SourceOfAnalysis");
const IntOntologyCollection = require("./../../core/IntOntologyCollection");
const GeoReferent = require("./../../geo/GeoReferent");
const Termin = require("./../../core/Termin");
const ProcessorService = require("./../../ProcessorService");
const Analyzer = require("./../../Analyzer");
const MorphLang = require("./../../../morph/MorphLang");
const GeoAnalyzer = require("./../../geo/GeoAnalyzer");
const OrgItemTypeToken = require("./OrgItemTypeToken");

class OrgGlobal {
    
    static initialize() {
        if (OrgGlobal.GLOBAL_ORGS !== null) 
            return;
        OrgGlobal.GLOBAL_ORGS = new IntOntologyCollection();
        let _org = null;
        let oi = null;
        let geo_proc = ProcessorService.create_empty_processor(); 
        try {
            geo_proc.add_analyzer(new GeoAnalyzer());
            let geos = new Hashtable();
            for (let k = 0; k < 3; k++) {
                let lang = (k === 0 ? MorphLang.RU : (k === 1 ? MorphLang.EN : MorphLang.UA));
                let name = (k === 0 ? "Orgs_ru.dat" : (k === 1 ? "Orgs_en.dat" : "Orgs_ua.dat"));
                let dat = EpNerOrgInternalResourceHelper.get_bytes(name);
                if (dat === null) 
                    throw new Error(("Can't file resource file " + name + " in Organization analyzer"));
                let tmp = new MemoryStream(OrgItemTypeToken.deflate(dat)); 
                try {
                    tmp.position = 0;
                    let xml = new XmlDocument();
                    xml.loadStream(tmp);
                    for (const x of xml.document_element.child_nodes) {
                        _org = new OrganizationReferent();
                        let abbr = null;
                        for (const xx of x.child_nodes) {
                            if (xx.local_name === "typ") 
                                _org.add_slot(OrganizationReferent.ATTR_TYPE, xx.inner_text, false, 0);
                            else if (xx.local_name === "nam") 
                                _org.add_slot(OrganizationReferent.ATTR_NAME, xx.inner_text, false, 0);
                            else if (xx.local_name === "epo") 
                                _org.add_slot(OrganizationReferent.ATTR_EPONYM, xx.inner_text, false, 0);
                            else if (xx.local_name === "prof") 
                                _org.add_slot(OrganizationReferent.ATTR_PROFILE, xx.inner_text, false, 0);
                            else if (xx.local_name === "abbr") 
                                abbr = xx.inner_text;
                            else if (xx.local_name === "geo") {
                                let _geo = null;
                                let wrapgeo1758 = new RefOutArgWrapper();
                                let inoutres1759 = geos.tryGetValue(xx.inner_text, wrapgeo1758);
                                _geo = wrapgeo1758.value;
                                if (!inoutres1759) {
                                    let ar = geo_proc.process(new SourceOfAnalysis(xx.inner_text), null, lang);
                                    if (ar !== null && ar.entities.length === 1 && (ar.entities[0] instanceof GeoReferent)) {
                                        _geo = Utils.as(ar.entities[0], GeoReferent);
                                        geos.put(xx.inner_text, _geo);
                                    }
                                    else {
                                    }
                                }
                                if (_geo !== null) 
                                    _org.add_slot(OrganizationReferent.ATTR_GEO, _geo, false, 0);
                            }
                        }
                        oi = _org.create_ontology_item_ex(2, true, true);
                        if (oi === null) 
                            continue;
                        if (abbr !== null) 
                            oi.termins.push(new Termin(abbr, null, true));
                        if (k === 2) 
                            OrgGlobal.GLOBAL_ORGS_UA.add_item(oi);
                        else 
                            OrgGlobal.GLOBAL_ORGS.add_item(oi);
                    }
                }
                finally {
                    tmp.close();
                }
            }
        }
        finally {
            geo_proc.close();
        }
        return;
    }
    
    static static_constructor() {
        OrgGlobal.GLOBAL_ORGS = null;
        OrgGlobal.GLOBAL_ORGS_UA = new IntOntologyCollection();
    }
}


OrgGlobal.static_constructor();

module.exports = OrgGlobal