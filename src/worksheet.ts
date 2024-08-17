

type Options = {
    name: string | number;
}

class WorkSheet {
    index: number;
    name: string | number;
    labelSst: Array<Record<string, any>>;
    dimensions: Array<Record<string, any>>;
    rks: Array<Record<string, any>>;
    defaultRowHeight: number;
    defaultColWidth: number;
    mergeCells: Array<Record<string, any>>;

    calcMode: number;
    calcCount: number;
    calcIter: boolean;
    calcDelta: number;
    calcSaveRecalc: boolean;
    calcRefMode: boolean;

    constructor(options: Options) {
        this.index = 0;
        this.name = options.name;
        this.labelSst = [];
        this.dimensions = [];
        this.rks = [];
        this.defaultRowHeight = 0;
        this.defaultColWidth = 0;
        this.mergeCells = [];

        this.calcMode = 1;
        this.calcCount = 100;
        this.calcIter = false;
        this.calcDelta = 0.001;
        this.calcSaveRecalc = true;
        this.calcRefMode = true;
    }

    getRow(){
        // this.id  用这个找当前的sheet
        console.log('xxxx')
    }

    getCell(){
      console.log('xxxx', this.name)
      console.log('xxxx', this.labelSst)
    //   console.log('xxxx', this.dimensions)
      console.log('rks', this.rks)
      console.log('mergeCells', JSON.stringify(this.mergeCells))
    }

    // parse(value: any) {
    //     this.labelSst.push(value); // 使用当前实例的 labelSst
    // }
}

export default WorkSheet;