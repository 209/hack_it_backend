/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const Stream = require("./../../../unisharp/Stream");

const EpNerAddressPropertiesResources = require("./../properties/EpNerAddressPropertiesResources");

/**
 * Это для поддержки получения встроенных ресурсов
 */
class EpNerAddressInternalResourceHelper {
    
    /**
     * Получить встроенный ресурс
     * @param name имя, на который оканчивается ресурс
     * @return 
     */
    static get_bytes(name) {
        // ignored: let assembly = [typeof] not supported in JS.;
        let names = EpNerAddressPropertiesResources.getNames();
        for (const n of names) {
            if (Utils.endsWithString(n, name, true)) {
                try {
                    let inf = EpNerAddressPropertiesResources.getResourceInfo(n);
                    if (inf === null) 
                        continue;
                    let stream = EpNerAddressPropertiesResources.getStream(n); 
                    try {
                        let buf = new Uint8Array(stream.length);
                        stream.read(buf, 0, buf.length);
                        return buf;
                    }
                    finally {
                        stream.close();
                    }
                } catch (ex) {
                }
            }
        }
        return null;
    }
    
    static get_string(name) {
        let arr = EpNerAddressInternalResourceHelper.get_bytes(name);
        if (arr === null) 
            return null;
        if ((arr.length > 3 && arr[0] === (0xEF) && arr[1] === (0xBB)) && arr[2] === (0xBF)) 
            return Utils.decodeString("UTF-8", arr, 3, arr.length - 3);
        else 
            return Utils.decodeString("UTF-8", arr, 0, -1);
    }
}


module.exports = EpNerAddressInternalResourceHelper