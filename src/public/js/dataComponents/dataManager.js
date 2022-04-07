import { Publisher, Message } from "../communication/index.js";
import { invalidVariables, varTest, printErrorMessage } from '../errorHandling/errorHandlers.js';
import { DataTable } from "./tables/dataTable.js";

export class DataManager {

    publisher;
    #dataTable;                // Map that stores the data. Keys are the unique keys of the nodes.
    #conversionTable;

    constructor() {
        this.publisher = new Publisher();
        this.#dataTable = new Map();
        this.#conversionTable = new Map();
        this.#conversionTable.set('datenumber', this.convertFromDateToNumber);
        this.#conversionTable.set('numberdate', this.convertFromNumberToDate);
        this.#conversionTable.set('category', this.convertToCategory);
    };

    /**
     * Sends a message to all subscribers. (should only be hub).
     * @param {Message} msg the Message 
     */
    #sendMessage = msg => {
        if (invalidVariables([varTest(msg, 'msg', 'object')], 'DataManager', '#sendMessage')) return false;
        else this.publisher.publishMessage(msg);
    }

    /**
     * Gets data associated with a key from the hash table if it exists.
     * @param {number} key the key to the data associated with a module
     * @returns the data associated with the key if found.
     */
    getData = key => {
        if (invalidVariables([varTest(key, 'key', 'number')], 'DataManager', 'getData')) return undefined;
        if (this.#dataTable.has(key)) {
            const data = this.#dataTable.get(key).data;
            if (data.filtered) data.data.setFilteredData(this.applyDataFilter(data));
            return data;
        }
        else console.log(`ERROR: No data found for key: ${key}. -- Data Manager -> getData`);
        return undefined;
    }

    applyDataFilter(data) {
        const filteredData = [];
        const filterArray = this.buildFilterArray(data.getFilterDetails(), data.data.getHeaders());
        data.data.getCleanData().forEach((row, index) => {
            if (index > 0) {
                let match = true;
                for (let i = 0; i < row.length; i++) {
                    const filter = filterArray.find(value => value.columnIndex === i);
                    let value = row[i];
                    if (filter) {
                        if (filter.dataType !== 'string') {
                            if (filter.dataType === 'date') value = this.convertDateStringToMilliseconds(value);
                            if (Number(value) < Number(filter.min) || Number(value) > Number(filter.max)) {
                                match = false;
                                break;
                            }
                        }
                    }
                }
                if (match) filteredData.push(row);
            } else filteredData.push(row);
        });
        return filteredData;
    }

    buildFilterArray(details, headers) {
        const array = [];
        details.forEach(columnFilter => {
            let min = columnFilter.get('lastValidLeft');
            let max = columnFilter.get('lastValidRight');
            const columnIndex = headers.indexOf(columnFilter.get('label'));
            const dataType = columnFilter.get('dataType');
            if (dataType === 'date') {
                min = this.convertDateStringToMilliseconds(min);
                max = this.convertDateStringToMilliseconds(max);
            }
            array.push({ min: min, max: max, columnIndex: columnIndex, dataType: dataType });
        });
        return array;
    }

    convertDateStringToMilliseconds = string => (new Date(string).getTime());

    convertMillisecondsToString(milliseconds) {
        const conversion = new Date(milliseconds);
        return `${conversion.getMonth() + 1}/${conversion.getDate()}/${conversion.getFullYear()}`;
    }

    /**
     * Adds to the data table. If the specified key is in the table, it will be overwritten.
     * @param {number} key key into the data table. It is also the key to the module associated with this data.
     * @param {object} val the value linked to the key. This is the "data".
     * @param {boolean} local true if the data was generated locally (creates metadata)
     */
    addData = (key, val, local) => {
        if (invalidVariables([varTest(key, 'key', 'number'), varTest(val, 'val', 'object'), varTest(local, 'local', 'boolean')], 'DataManager', 'addData')) return false;
        if (this.#dataTable.has(key)) console.log(`Data Table already has key: ${key} in it. Will Overwrite. -- DataManager -> addData.`);
        this.#dataTable.set(key, { data: val });
        let metadata = undefined;
        if (local) metadata = val.data.setMetadata();
        return true;
    }

    addFilterToDataTable(getFilterFunction, dataKey) {
        if (this.getData(dataKey).filtered) {
            console.log(`Data at key: ${dataKey} is already filtered.`);
            return;
        }
        this.getData(dataKey).getFilterDetails = getFilterFunction;
        this.getData(dataKey).filtered = true;
    }

    removeFilter(dataKey) {
        const data = this.getData(dataKey);
        if (data?.filtered) {
            data.filtered = false;
        }
    }

    /**
     * Checks to see if any data exists for a specific module key.
     * @param {number} key 
     * @returns true if data exists, false if not.
     */
    hasData = key => {
        if (invalidVariables([varTest(key, 'key', 'number')], 'DataManager', 'hasData')) return false;
        else return this.#dataTable.has(key);
    }
    /**
     * Deletes data from the datatable.
     * @param {number} key identifying  
     * @returns true if successful, false if not.
     */
    deleteData = key => {
        if (invalidVariables([varTest(key, 'key', 'number')], 'DataManager', 'deleteData')) return false;
        return this.#dataTable.delete(key);
    }

    /**
     * Data requests come with a key and a callback. All Data is returned as a parameter to this callback function.
     * @param {number} key the key to find the data.
     * @param {function} callbackFunction the function to call and pass data as a parameter.
     */
    processDataRequest = (key, callbackFunction) => {
        if (invalidVariables([varTest(key, 'key', 'number'), varTest(callbackFunction, 'callbackFunction', 'function')], 'DataManager', 'processDataRequest')) return;
        else callbackFunction(key, this.getData(key));
    }

    /**
     * When data is first loaded, its is stored with the key that loaded it. When a new data module is created, the key
     * for this new module replaces the original key.
     * @param {number} oldKey previous key associated with data
     * @param {number} newKey new key to associate with specific data
     * @returns true if successful, false if there was no data.
     */
    swapDataKeys(oldKey, newKey) {
        const data = this.getData(oldKey);
        if (data) {
            this.deleteData(oldKey);
            this.addData(newKey, data, true);
            return true;
        } else printErrorMessage(`Undefined Varaible`, `No Data found for key: ${oldKey}--> Data Manager - swapDataKeys`);
        return false;
    }

    /**
     * Reduces a data object, getting only the data for specified columns. This is used to ploy specific 
     * columns in the data where there are more than 2.
     * @param {number} key The key for the data hash table.
     * @param {object {xAxisField: string, yAxisField: string}} fields 
     * @returns reduced data.
     */
    getXYDataWithFields(key, fields) {
        console.log(fields);
        /* this.getData(key) returns and object with fields like type: 'table', data: DataTable 
        Then, the DataTable object has keys type: 'table' and data: ....
        To access the data, use getData() because the actual data is a private field. */
        const data = this.getData(key).data.getData();

        const indicies = {};  // indicies will copy the keys from fields and replace the values with the proper index in the data table.
        Object.entries(fields).forEach(entry => {
            if (entry[0] === 'yAxisField') {
                indicies[entry[0].toString()] = [];
                entry[1].forEach(field => {
                    indicies[entry[0].toString()].push(data[0].indexOf(field));
                });
            } else if (entry[0] === 'yAxisErrorField') {
                indicies[entry[0].toString()] = [];
                entry[1].forEach(field => {
                    indicies[entry[0].toString()].push(data[0].indexOf(field));
                });
            } else indicies[entry[0].toString()] = data[0].indexOf(entry[1]);  // Get Indices of the headers
        });

        const chartData = { type: data.type, data: { x: [], y: [], e: [] } }; // Build the arrays to plot.
        for (let i = 0; i < indicies.yAxisField.length; i++) {
            chartData.data.y.push([]);
        }

        for (let i = 0; i < indicies.yAxisErrorField.length; i++) {
            chartData.data.e.push([]);
        }
        for (let i = 1; i < data.length; i++) {
            chartData.data.x.push(data[i][indicies.xAxisField]);
            for (let j = 0; j < indicies.yAxisField.length; j++) {
                chartData.data.y[j].push(data[i][indicies.yAxisField[j]]);
            }
            for (let j = 0; j < indicies.yAxisErrorField.length; j++) {
                if (indicies.yAxisErrorField[j] >= 0) chartData.data.e[j].push(data[i][indicies.yAxisErrorField[j]]);
            }
        }
        return chartData;
    }

    /**
     * Reduces a data object, getting only the data for specified columns. Users can select a subset of the possible columns
     * when displaying a table or downloading a csv file.
     * @param {number} key The key for the data hash table.
     * @param {object {xAxisField: string, yAxisField: string}} fields 
     * @returns reduced data.
     */
    getTableDataWithFields(key, fields) {
        console.log(fields);
        /* this.getData(key) returns and object with fields like type: 'table', data: DataTable 
        Then, the DataTable object has keys type: 'table' and data: ....
        To access the data, use getData() because the actual data is a private field. */
        const data = this.getData(key).data.getData();

        const indicies = {};  // indicies will copy the keys from fields and replace the values with the proper index in the data table.
        const chartData = { type: 'table', data: {} }; // Build the arrays to plot.

        fields.forEach(field => {
            if (field.include) {
                indicies[field.label.toString()] = data[0].indexOf(field.label);
                chartData.data[field.label] = [];
            }
        });

        for (let i = 1; i < data.length; i++) {
            Object.entries(indicies).forEach(entry => {
                chartData.data[entry[0]].push(data[i][entry[1]])
            });
        }
        return chartData;
    }

    convertData(input, output, fn, key, moduleKey) {
        const data = JSON.parse(JSON.stringify(this.getData(key).data.getData()));
        const conversionIndex = data[0].indexOf(input);
        if (conversionIndex > 0) {
            const preConvertedData = [];
            for (let i = 1; i < data.length; i++) {
                preConvertedData.push(data[i][conversionIndex]);
            }
            const convertedData = fn(preConvertedData);
            data.forEach((row, index) => {
                const val = index === 0 ? output : convertedData[index - 1];
                row.push(val);
            })
            const table = new DataTable(data);
            const wrapper = {};
            wrapper.data = table;
            return wrapper;
        } else return undefined;
    }

    changeDataType(metadata, oldType, newType, dataField, datakey, callbackFN, updateMetadataFN) {
        console.log(oldType, newType);
        let row = null;
        metadata.columnHeaders.forEach(element => {
            if (element.name === dataField) row = element
        });
        let success = false;
        try {
            success = this.#conversionTable.get(oldType.toLowerCase() + newType.toLowerCase())(row);
        } catch (e) {
            console.log(e);
        }
        if (success) {
            row.dataType = newType;
            this.getData(datakey).data.replaceMetadata(metadata);
        }
        callbackFN({ success: success, row: row });
        updateMetadataFN(metadata, success);
    }


    convertFromNumberToDate(row) {
        if (!row) return false;
        const conversion = new Date(row.min);
        if (!conversion) return false;
        return true;
    }

    convertFromDateToNumber(row) {
        if (!row) return false;
        if (Number(row.min)) return true;
        return false;
    }

    convertToCategory(row) {
        return false;
    }
}