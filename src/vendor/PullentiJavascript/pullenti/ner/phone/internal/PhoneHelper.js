/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const Hashtable = require("./../../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const EpNerBankInternalResourceHelper = require("./../../bank/internal/EpNerBankInternalResourceHelper");

class PhoneHelper {
    
    static initialize() {
        if (PhoneHelper.m_phone_root !== null) 
            return;
        PhoneHelper.m_phone_root = new PhoneHelper.PhoneNode();
        PhoneHelper.m_all_country_codes = new Hashtable();
        let str = EpNerBankInternalResourceHelper.get_string("CountryPhoneCodes.txt");
        if (str === null) 
            throw new Error(("Can't file resource file " + "CountryPhoneCodes.txt" + " in Organization analyzer"));
        for (const line0 of Utils.splitString(str, '\n', false)) {
            let line = line0.trim();
            if (Utils.isNullOrEmpty(line)) 
                continue;
            if (line.length < 2) 
                continue;
            let country = line.substring(0, 0 + 2);
            let cod = line.substring(2).trim();
            if (cod.length < 1) 
                continue;
            if (!PhoneHelper.m_all_country_codes.containsKey(country)) 
                PhoneHelper.m_all_country_codes.put(country, cod);
            let tn = PhoneHelper.m_phone_root;
            for (let i = 0; i < cod.length; i++) {
                let dig = cod[i];
                let nn = null;
                let wrapnn2609 = new RefOutArgWrapper();
                let inoutres2610 = tn.children.tryGetValue(dig, wrapnn2609);
                nn = wrapnn2609.value;
                if (!inoutres2610) {
                    nn = new PhoneHelper.PhoneNode();
                    nn.pref = cod.substring(0, 0 + i + 1);
                    tn.children.put(dig, nn);
                }
                tn = nn;
            }
            if (tn.countries === null) 
                tn.countries = new Array();
            tn.countries.push(country);
        }
    }
    
    static get_all_country_codes() {
        return PhoneHelper.m_all_country_codes;
    }
    
    /**
     * Выделить телефонный префикс из "полного" номера
     * @param full_number 
     * @return 
     */
    static get_country_prefix(full_number) {
        if (full_number === null) 
            return null;
        let nod = PhoneHelper.m_phone_root;
        let max_ind = -1;
        for (let i = 0; i < full_number.length; i++) {
            let dig = full_number[i];
            let nn = null;
            let wrapnn2611 = new RefOutArgWrapper();
            let inoutres2612 = nod.children.tryGetValue(dig, wrapnn2611);
            nn = wrapnn2611.value;
            if (!inoutres2612) 
                break;
            if (nn.countries !== null && nn.countries.length > 0) 
                max_ind = i;
            nod = nn;
        }
        if (max_ind < 0) 
            return null;
        else 
            return full_number.substring(0, 0 + max_ind + 1);
    }
    
    static static_constructor() {
        PhoneHelper.m_all_country_codes = null;
        PhoneHelper.m_phone_root = null;
    }
}


PhoneHelper.PhoneNode = class  {
    
    constructor() {
        this.pref = null;
        this.children = new Hashtable();
        this.countries = null;
    }
    
    toString() {
        if (this.countries === null) 
            return this.pref;
        let res = new StringBuilder(this.pref);
        for (const c of this.countries) {
            res.append(" ").append(c);
        }
        return res.toString();
    }
}


PhoneHelper.static_constructor();

module.exports = PhoneHelper