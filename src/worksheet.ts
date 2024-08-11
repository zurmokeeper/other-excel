

type Options = {
    name: string | number;
}

class WorkSheet {
    index: number;
    name: string | number;
    labelSst: Array<Record<string, any>>;
    dimensions: Array<Record<string, any>>;
    rks: Array<Record<string, any>>;

    constructor(options: Options) {
        this.index = 0;
        this.name = options.name;
        this.labelSst = [];
        this.dimensions = [];
        this.rks = [];
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
    }

    // parse(value: any) {
    //     this.labelSst.push(value); // 使用当前实例的 labelSst
    // }
}

export default WorkSheet;