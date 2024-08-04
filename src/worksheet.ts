

type Options = {
    id: string | number;
}

class WorkSheet {
    id: string | number;
    name: string;

    constructor(options: Options) {
        this.id = options.id;
        this.name = '';
    }

    getRow(){
        // this.id  用这个找当前的sheet
        console.log('xxxx')
    }

    getCell(){
      console.log('xxxx')
    }
}

export default WorkSheet;