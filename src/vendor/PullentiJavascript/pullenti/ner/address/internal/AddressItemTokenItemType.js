/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../../unisharp/Hashtable");

class AddressItemTokenItemType {

    constructor(val, str) {
        this.m_val = val;
        this.m_str = str;
    }
    toString() {
        return this.m_str;
    }
    value() {
        return this.m_val;
    }
    static of(val) {
        if(val instanceof AddressItemTokenItemType) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(AddressItemTokenItemType.mapStringToEnum.containsKey(val))
                return AddressItemTokenItemType.mapStringToEnum.get(val);
            return null;
        }
        if(AddressItemTokenItemType.mapIntToEnum.containsKey(val))
            return AddressItemTokenItemType.mapIntToEnum.get(val);
        let it = new AddressItemTokenItemType(val, val.toString());
        AddressItemTokenItemType.mapIntToEnum.put(val, it);
        AddressItemTokenItemType.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return AddressItemTokenItemType.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return AddressItemTokenItemType.m_Values;
    }
    static static_constructor() {
        AddressItemTokenItemType.mapIntToEnum = new Hashtable();
        AddressItemTokenItemType.mapStringToEnum = new Hashtable();
        AddressItemTokenItemType.PREFIX = new AddressItemTokenItemType(0, "PREFIX");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.PREFIX.value(), AddressItemTokenItemType.PREFIX); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.PREFIX.m_str.toUpperCase(), AddressItemTokenItemType.PREFIX); 
        AddressItemTokenItemType.STREET = new AddressItemTokenItemType(1, "STREET");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.STREET.value(), AddressItemTokenItemType.STREET); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.STREET.m_str.toUpperCase(), AddressItemTokenItemType.STREET); 
        AddressItemTokenItemType.HOUSE = new AddressItemTokenItemType(2, "HOUSE");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.HOUSE.value(), AddressItemTokenItemType.HOUSE); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.HOUSE.m_str.toUpperCase(), AddressItemTokenItemType.HOUSE); 
        AddressItemTokenItemType.BUILDING = new AddressItemTokenItemType(3, "BUILDING");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.BUILDING.value(), AddressItemTokenItemType.BUILDING); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.BUILDING.m_str.toUpperCase(), AddressItemTokenItemType.BUILDING); 
        AddressItemTokenItemType.CORPUS = new AddressItemTokenItemType(4, "CORPUS");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.CORPUS.value(), AddressItemTokenItemType.CORPUS); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.CORPUS.m_str.toUpperCase(), AddressItemTokenItemType.CORPUS); 
        AddressItemTokenItemType.POTCH = new AddressItemTokenItemType(5, "POTCH");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.POTCH.value(), AddressItemTokenItemType.POTCH); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.POTCH.m_str.toUpperCase(), AddressItemTokenItemType.POTCH); 
        AddressItemTokenItemType.FLOOR = new AddressItemTokenItemType(6, "FLOOR");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.FLOOR.value(), AddressItemTokenItemType.FLOOR); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.FLOOR.m_str.toUpperCase(), AddressItemTokenItemType.FLOOR); 
        AddressItemTokenItemType.FLAT = new AddressItemTokenItemType(7, "FLAT");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.FLAT.value(), AddressItemTokenItemType.FLAT); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.FLAT.m_str.toUpperCase(), AddressItemTokenItemType.FLAT); 
        AddressItemTokenItemType.CORPUSORFLAT = new AddressItemTokenItemType(8, "CORPUSORFLAT");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.CORPUSORFLAT.value(), AddressItemTokenItemType.CORPUSORFLAT); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.CORPUSORFLAT.m_str.toUpperCase(), AddressItemTokenItemType.CORPUSORFLAT); 
        AddressItemTokenItemType.OFFICE = new AddressItemTokenItemType(9, "OFFICE");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.OFFICE.value(), AddressItemTokenItemType.OFFICE); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.OFFICE.m_str.toUpperCase(), AddressItemTokenItemType.OFFICE); 
        AddressItemTokenItemType.PLOT = new AddressItemTokenItemType(10, "PLOT");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.PLOT.value(), AddressItemTokenItemType.PLOT); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.PLOT.m_str.toUpperCase(), AddressItemTokenItemType.PLOT); 
        AddressItemTokenItemType.BLOCK = new AddressItemTokenItemType(11, "BLOCK");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.BLOCK.value(), AddressItemTokenItemType.BLOCK); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.BLOCK.m_str.toUpperCase(), AddressItemTokenItemType.BLOCK); 
        AddressItemTokenItemType.BOX = new AddressItemTokenItemType(12, "BOX");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.BOX.value(), AddressItemTokenItemType.BOX); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.BOX.m_str.toUpperCase(), AddressItemTokenItemType.BOX); 
        AddressItemTokenItemType.CITY = new AddressItemTokenItemType(13, "CITY");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.CITY.value(), AddressItemTokenItemType.CITY); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.CITY.m_str.toUpperCase(), AddressItemTokenItemType.CITY); 
        AddressItemTokenItemType.REGION = new AddressItemTokenItemType(14, "REGION");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.REGION.value(), AddressItemTokenItemType.REGION); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.REGION.m_str.toUpperCase(), AddressItemTokenItemType.REGION); 
        AddressItemTokenItemType.COUNTRY = new AddressItemTokenItemType(15, "COUNTRY");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.COUNTRY.value(), AddressItemTokenItemType.COUNTRY); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.COUNTRY.m_str.toUpperCase(), AddressItemTokenItemType.COUNTRY); 
        AddressItemTokenItemType.NUMBER = new AddressItemTokenItemType(16, "NUMBER");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.NUMBER.value(), AddressItemTokenItemType.NUMBER); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.NUMBER.m_str.toUpperCase(), AddressItemTokenItemType.NUMBER); 
        AddressItemTokenItemType.NONUMBER = new AddressItemTokenItemType(17, "NONUMBER");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.NONUMBER.value(), AddressItemTokenItemType.NONUMBER); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.NONUMBER.m_str.toUpperCase(), AddressItemTokenItemType.NONUMBER); 
        AddressItemTokenItemType.KILOMETER = new AddressItemTokenItemType(18, "KILOMETER");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.KILOMETER.value(), AddressItemTokenItemType.KILOMETER); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.KILOMETER.m_str.toUpperCase(), AddressItemTokenItemType.KILOMETER); 
        AddressItemTokenItemType.ZIP = new AddressItemTokenItemType(19, "ZIP");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.ZIP.value(), AddressItemTokenItemType.ZIP); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.ZIP.m_str.toUpperCase(), AddressItemTokenItemType.ZIP); 
        AddressItemTokenItemType.POSTOFFICEBOX = new AddressItemTokenItemType(20, "POSTOFFICEBOX");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.POSTOFFICEBOX.value(), AddressItemTokenItemType.POSTOFFICEBOX); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.POSTOFFICEBOX.m_str.toUpperCase(), AddressItemTokenItemType.POSTOFFICEBOX); 
        AddressItemTokenItemType.CSP = new AddressItemTokenItemType(21, "CSP");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.CSP.value(), AddressItemTokenItemType.CSP); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.CSP.m_str.toUpperCase(), AddressItemTokenItemType.CSP); 
        AddressItemTokenItemType.DETAIL = new AddressItemTokenItemType(22, "DETAIL");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.DETAIL.value(), AddressItemTokenItemType.DETAIL); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.DETAIL.m_str.toUpperCase(), AddressItemTokenItemType.DETAIL); 
        AddressItemTokenItemType.BUSINESSCENTER = new AddressItemTokenItemType(23, "BUSINESSCENTER");
        AddressItemTokenItemType.mapIntToEnum.put(AddressItemTokenItemType.BUSINESSCENTER.value(), AddressItemTokenItemType.BUSINESSCENTER); 
        AddressItemTokenItemType.mapStringToEnum.put(AddressItemTokenItemType.BUSINESSCENTER.m_str.toUpperCase(), AddressItemTokenItemType.BUSINESSCENTER); 
        AddressItemTokenItemType.m_Values = Array.from(AddressItemTokenItemType.mapIntToEnum.values);
        AddressItemTokenItemType.m_Keys = Array.from(AddressItemTokenItemType.mapIntToEnum.keys);
    }
}


AddressItemTokenItemType.static_constructor();

module.exports = AddressItemTokenItemType