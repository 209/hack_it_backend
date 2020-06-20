/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../unisharp/Hashtable");

/**
 * Тип дома
 */
class AddressHouseType {

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
        if(val instanceof AddressHouseType) 
            return val;
        if(typeof val === 'string' || val instanceof String) {
            val = val.toUpperCase();
            if(AddressHouseType.mapStringToEnum.containsKey(val))
                return AddressHouseType.mapStringToEnum.get(val);
            return null;
        }
        if(AddressHouseType.mapIntToEnum.containsKey(val))
            return AddressHouseType.mapIntToEnum.get(val);
        let it = new AddressHouseType(val, val.toString());
        AddressHouseType.mapIntToEnum.put(val, it);
        AddressHouseType.mapStringToEnum.put(val.toString(), it);
        return it;
    }
    static isDefined(val) {
        return AddressHouseType.m_Keys.indexOf(val) >= 0;
    }
    static getValues() {
        return AddressHouseType.m_Values;
    }
    static static_constructor() {
        AddressHouseType.mapIntToEnum = new Hashtable();
        AddressHouseType.mapStringToEnum = new Hashtable();
        AddressHouseType.UNDEFINED = new AddressHouseType(0, "UNDEFINED");
        AddressHouseType.mapIntToEnum.put(AddressHouseType.UNDEFINED.value(), AddressHouseType.UNDEFINED); 
        AddressHouseType.mapStringToEnum.put(AddressHouseType.UNDEFINED.m_str.toUpperCase(), AddressHouseType.UNDEFINED); 
        AddressHouseType.ESTATE = new AddressHouseType(1, "ESTATE");
        AddressHouseType.mapIntToEnum.put(AddressHouseType.ESTATE.value(), AddressHouseType.ESTATE); 
        AddressHouseType.mapStringToEnum.put(AddressHouseType.ESTATE.m_str.toUpperCase(), AddressHouseType.ESTATE); 
        AddressHouseType.HOUSE = new AddressHouseType(2, "HOUSE");
        AddressHouseType.mapIntToEnum.put(AddressHouseType.HOUSE.value(), AddressHouseType.HOUSE); 
        AddressHouseType.mapStringToEnum.put(AddressHouseType.HOUSE.m_str.toUpperCase(), AddressHouseType.HOUSE); 
        AddressHouseType.HOUSEESTATE = new AddressHouseType(3, "HOUSEESTATE");
        AddressHouseType.mapIntToEnum.put(AddressHouseType.HOUSEESTATE.value(), AddressHouseType.HOUSEESTATE); 
        AddressHouseType.mapStringToEnum.put(AddressHouseType.HOUSEESTATE.m_str.toUpperCase(), AddressHouseType.HOUSEESTATE); 
        AddressHouseType.m_Values = Array.from(AddressHouseType.mapIntToEnum.values);
        AddressHouseType.m_Keys = Array.from(AddressHouseType.mapIntToEnum.keys);
    }
}


AddressHouseType.static_constructor();

module.exports = AddressHouseType