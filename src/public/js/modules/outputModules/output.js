import { Module } from "../index.js";
import { GM } from '../../main.js';
import chartThemes from '../../dataComponents/charts/echarts/theme/echartsThemes.js';
import { ChartDataStorage } from "./components/chartDataStorage.js";

export class Output extends Module {
    constructor(category, color, shape, command, name, image, inports, outports, key) {
        super(category, color, shape, command, name, image, inports, outports, key);
    }

    buildEchartThemeDropdown = () => {
        return GM.HF.createNewSelect(`plot_${this.key}`, `plot_${this.key}`, ['plot-dd'], [], chartThemes, chartThemes);
    };

    setEchartThemeDropdownEventListener = dropDownElement => {
        dropDownElement.addEventListener('change', event => {
            GM.MM.handleEchartThemeChange(this.getData('key'), event.target.value);
        });
    }
}

export class Chart extends Output {
    constructor() { };
}

export class ScatterPlot extends Output {
    constructor(category, color, shape, key) {
        super(category, color, shape, 'output', 'Scatter Plot', 'images/icons/scatter-graph-black.png', [{ name: 'IN', leftSide: true }], [], key);
        this.setPopupContent();
        this.createInspectorCardData();
        this.chartData = new ChartDataStorage('scatter');
    }

    setPopupContent = () => {
        const popupContent = GM.HF.createNewDiv('', '', [], []);
        const themeDD = this.buildEchartThemeDropdown();
        this.setEchartThemeDropdownEventListener(themeDD);
        const plotDiv = GM.HF.createNewDiv(`plot_${this.key}`, `plot_${this.key}`, ['plot1'], ['chartDiv']);
        popupContent.appendChild(themeDD);
        popupContent.appendChild(plotDiv);
        this.addData('popupContent', popupContent, false, '', false);
        this.addData('themeDD', themeDD, false, '', false);
        this.addData('plotDiv', plotDiv, false, '', false);
    }

    createInspectorCardData() {
        this.addInspectorCardIDField();
        this.addInspectorCardDataConnectedField();
    }

    updateInspectorCardWithNewData(dataModule, data) {
        this.addInspectorCardLinkedNodeField(dataModule.getData('key'));
        //this.createInspectorCardAxisCard()
        const xAxis = this.addInspectorCardChartXAxisCard(data.data.getHeaders());
        const yAxis = this.addInspectorCardChartYAxisCard(data.data.getHeaders());
                this.chartData.storeHeaders(data.data.getHeaders());
        this.chartData.listenToXAxisDataChanges(xAxis.dropdown);
        this.chartData.listenToYAxisDataChanges(yAxis.dropdown);
        this.chartData.listenToXAxisLabelChanges(xAxis.labelInput);
        this.chartData.listenToYAxisLabelChanges(yAxis.labelInput);
        this.chartData.listenToXAxisTickChanges(xAxis.tickCheckbox.checkbox);
        this.chartData.listenToYAxisTickChanges(yAxis.tickCheckbox.checkbox);
        this.chartData.listenToXAxisGridChanges(xAxis.gridCheckbox.checkbox);
        this.chartData.listenToYAxisGridChanges(yAxis.gridCheckbox.checkbox);
        this.chartData.setInitialValues(xAxis.dropdown.value,
            yAxis.dropdown.value,
            xAxis.labelInput.value,
            yAxis.labelInput.value,
            xAxis.gridCheckbox.checkbox.checked,
            yAxis.gridCheckbox.checkbox.checked,
            xAxis.tickCheckbox.checkbox.checked,
            yAxis.tickCheckbox.checkbox.checked);
        this.chartData.listenToAddTraceButton(xAxis.addTraceButton);
        this.chartData.listenToAddTraceButton(yAxis.addTraceButton);
        this.addBuildChartEventListener(this.addInspectorCardGenerateChartButton());
    }


    addBuildChartEventListener(button) { button.addEventListener('click', this.createNewChartFromButtonClick.bind(this)); }

    createNewChartFromButtonClick() {
        GM.MM.emitLocalChartEvent(
            this.getData('linkedDataKey'),
            this.getData('key'),
            this.chartData.getChartData(),
            this.getData('plotDiv'),
            'scatter');
    }
}

export class BarChart extends Output {
    constructor(category, color, shape, key) {
        super(category, color, shape, 'output', 'Bar Chart', 'images/icons/bar-chart.png', [{ name: 'IN', leftSide: true }], [], key);
        this.setPopupContent();
        this.createInspectorCardData();
        this.chartData = new ChartDataStorage('bar');
    }

    setPopupContent = () => {
        const popupContent = GM.HF.createNewDiv('', '', [], []);
        const themeDD = this.buildEchartThemeDropdown();
        this.setEchartThemeDropdownEventListener(themeDD);
        const plotDiv = GM.HF.createNewDiv(`plot_${this.key}`, `plot_${this.key}`, ['plot1'], ['chartDiv']);
        popupContent.appendChild(themeDD);
        popupContent.appendChild(plotDiv);
        this.addData('popupContent', popupContent, false, '', false);
        this.addData('themeDD', themeDD, false, '', false);
        this.addData('plotDiv', plotDiv, false, '', false);
    }

    createInspectorCardData() {
        this.addInspectorCardIDField();
        this.addInspectorCardDataConnectedField();
    }

    updateInspectorCardWithNewData(dataModule, data) {
        this.addInspectorCardLinkedNodeField(dataModule.getData('key'));
        //this.createInspectorCardAxisCard()
        const xAxis = this.addInspectorCardChartXAxisCard(data.data.getHeaders());
        const yAxis = this.addInspectorCardChartYAxisCard(data.data.getHeaders());
        this.chartData.storeHeaders(data.data.getHeaders());
        this.chartData.listenToXAxisDataChanges(xAxis.dropdown);
        this.chartData.listenToYAxisDataChanges(yAxis.dropdown);
        this.chartData.listenToXAxisLabelChanges(xAxis.labelInput);
        this.chartData.listenToYAxisLabelChanges(yAxis.labelInput);
        this.chartData.listenToXAxisTickChanges(xAxis.tickCheckbox.checkbox);
        this.chartData.listenToYAxisTickChanges(yAxis.tickCheckbox.checkbox);
        this.chartData.listenToXAxisGridChanges(xAxis.gridCheckbox.checkbox);
        this.chartData.listenToYAxisGridChanges(yAxis.gridCheckbox.checkbox);
        this.chartData.setInitialValues(xAxis.dropdown.value,
            yAxis.dropdown.value,
            xAxis.labelInput.value,
            yAxis.labelInput.value,
            xAxis.gridCheckbox.checkbox.checked,
            yAxis.gridCheckbox.checkbox.checked,
            xAxis.tickCheckbox.checkbox.checked,
            yAxis.tickCheckbox.checkbox.checked);
        this.addBuildChartEventListener(this.addInspectorCardGenerateChartButton());
    }


    addBuildChartEventListener(button) { button.addEventListener('click', this.createNewChartFromButtonClick.bind(this)); }

    createNewChartFromButtonClick() {
        GM.MM.emitLocalChartEvent(
            this.getData('linkedDataKey'),
            this.getData('key'),
            this.chartData.getChartData(),
            this.getData('plotDiv'),
            'bar');
    }
}

export class LineChart extends Output {
    constructor(category, color, shape, key) {
        super(category, color, shape, 'output', 'Line Chart', 'images/icons/line-chart.png', [{ name: 'IN', leftSide: true }], [], key,);
        this.setPopupContent();
        this.createInspectorCardData();
        this.chartData = new ChartDataStorage('line');
    }

    setPopupContent = () => {
        const popupContent = GM.HF.createNewDiv('', '', [], []);
        const themeDD = this.buildEchartThemeDropdown();
        this.setEchartThemeDropdownEventListener(themeDD);
        const plotDiv = GM.HF.createNewDiv(`plot_${this.key}`, `plot_${this.key}`, ['plot1'], ['chartDiv']);
        popupContent.appendChild(themeDD);
        popupContent.appendChild(plotDiv);
        this.addData('popupContent', popupContent, false, '', false);
        this.addData('themeDD', themeDD, false, '', false);
        this.addData('plotDiv', plotDiv, false, '', false);
    }

    createInspectorCardData() {
        this.addInspectorCardIDField();
        this.addInspectorCardDataConnectedField();
    }

    updateInspectorCardWithNewData(dataModule, data) {
        this.addInspectorCardLinkedNodeField(dataModule.getData('key'));
        const xAxis = this.addInspectorCardChartXAxisCard(data.data.getHeaders());
        const yAxis = this.addInspectorCardChartYAxisCard(data.data.getHeaders());
        yAxis.dropdown.id = `${this.chartData.getNumberOfTraces()}-x-axis-dropdown`;
        this.chartData.storeHeaders(data.data.getHeaders());
        this.chartData.listenToXAxisDataChanges(xAxis.dropdown);
        this.chartData.listenToYAxisDataChanges(yAxis.dropdown);
        this.chartData.listenToXAxisLabelChanges(xAxis.labelInput);
        this.chartData.listenToYAxisLabelChanges(yAxis.labelInput);
        this.chartData.listenToXAxisTickChanges(xAxis.tickCheckbox.checkbox);
        this.chartData.listenToYAxisTickChanges(yAxis.tickCheckbox.checkbox);
        this.chartData.listenToXAxisGridChanges(xAxis.gridCheckbox.checkbox);
        this.chartData.listenToYAxisGridChanges(yAxis.gridCheckbox.checkbox);
        this.chartData.setInitialValues(xAxis.dropdown.value,
            yAxis.dropdown.value,
            xAxis.labelInput.value,
            yAxis.labelInput.value,
            xAxis.gridCheckbox.checkbox.checked,
            yAxis.gridCheckbox.checkbox.checked,
            xAxis.tickCheckbox.checkbox.checked,
            yAxis.tickCheckbox.checkbox.checked);
        this.addNewTraceButtonListener(xAxis.addTraceButton);
        this.addNewTraceButtonListener(yAxis.addTraceButton);
        this.addBuildChartEventListener(this.addInspectorCardGenerateChartButton());
    }

    addNewTraceButtonListener(button) {
        button.addEventListener('click', this.addTrace.bind(this));
    }

    addBuildChartEventListener(button) { button.addEventListener('click', this.createNewChartFromButtonClick.bind(this)); }

    createNewChartFromButtonClick() {
        GM.MM.emitLocalChartEvent(
            this.getData('linkedDataKey'),
            this.getData('key'),
            this.chartData.getChartData(),
            this.getData('plotDiv'),
            'line');
    }

    addTrace() {
        const dropDown = GM.HF.createNewSelect(`${title}-${this.getData('key')}`, `${title}-${this.getData('key')}`, [], [], this.chartData.getHeaders(),this.chartData.getHeaders()); 
        this.addNewTraceToInspectorCard(dropDown);
        dropDown.id = `${this.chartData.getNumberOfTraces()}-x-axis-dropdown`;
        this.chartData.listenToYAxisDataChanges(dropDown);
        console.log(dropDown.id);
        this.chartData.addInitialValueForNewTrace(dropDown.value, dropDown.id.split('-')[0]);
    }
}

export class ImageOutput extends Output {
    constructor(category, color, shape, key) {
        super(category, color, shape, 'output', 'Image', 'images/icons/image.png', [{ name: 'IN', leftSide: true }], [], key);
        this.setPopupContent();
    }
}
export class Value extends Output {
    constructor(category, color, shape, key) {
        super(category, color, shape, 'output', 'Value', 'images/icons/equal.png', [{ name: 'IN', leftSide: true }], [], key);
        this.setPopupContent();
    }

    setPopupContent = () => {
        const popupContent = GM.HF.createNewDiv('', '', [], []);
        const setValueWrapper = GM.HF.createNewDiv('', '', ['setValueWrapper'], []);
        popupContent.appendChild(setValueWrapper);
        const dataArea = GM.HF.createNewDiv('', '', ['numberDataArea'], []);
        this.textArea = GM.HF.createNewParagraph('', '', ['popup-text-large'], [], this.data);
        dataArea.appendChild(this.textArea);
        popupContent.appendChild(dataArea);
        this.addData('popupContent', popupContent, false, '', false);
        this.addData('themeDD', themeDD, false, '', false);
        this.addData('plotDiv', plotDiv, false, '', false);
    };

    updatePopupText = val => {
        this.textArea.innerHTML = val;
    };


}

export class ToCSV extends Output {
    constructor(category, color, shape, key) {
        super(category, color, shape, 'output', 'To CSV', 'images/icons/csv-file-format-extension.png', [{ name: 'IN', leftSide: true }], [], key);
        this.setPopupContent();
        this.createInspectorCardData();
        this.chartData = new ChartDataStorage('table');
    }

    createInspectorCardData() {
        this.addInspectorCardIDField();
        this.addInspectorCardDataConnectedField();
    }

    updateInspectorCardWithNewData(dataModule, data) {
        this.addInspectorCardLinkedNodeField(dataModule.getData('key'));
        const columnCheckboxes = this.addInspectorCardIncludeColumnCard(data.data.getHeaders());
        this.chartData.listenToCheckboxChanges(columnCheckboxes);
        this.addGenerateTablePreviewEventListener(this.addInspectorCardGenerateTablePreviewButton());
        this.addCreateCSVFileEventListener(this.addInspectorCardGenerateCSVFileButton());
        console.log(data);
    }

    addGenerateTablePreviewEventListener(button) { button.addEventListener('click', this.createNewTableFromButtonClick.bind(this)); }
    addCreateCSVFileEventListener(button) { button.addEventListener('click', this.createCSVFile.bind(this)) };

    createCSVFile() {
        GM.MM.emitCreateCSVEvent(this.getData('linkedDataKey'), this.getData('key'), this.chartData.getTableData());
    }

    createNewTableFromButtonClick() {
        GM.MM.emitLocalTableEvent(
            this.getData('linkedDataKey'),
            this.getData('key'),
            this.chartData.getTableData(),
            this.getData('plotDiv'),
            'table');
    }

    setPopupContent = () => {
        const popupContent = GM.HF.createNewDiv('', '', [], []);
        const plotDiv = GM.HF.createNewDiv(`plot_${this.key}`, `plot_${this.key}`, ['plot1'], ['chartDiv']);
        popupContent.appendChild(plotDiv);
        this.addData('popupContent', popupContent, false, '', false);
        this.addData('plotDiv', plotDiv, false, '', false);
    };

    storeTableHeaders(headerRow) {
        console.log(headerRow);
        this.chartData.storeHeaders(headerRow);
    }
}
