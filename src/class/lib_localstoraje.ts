export class LCS {

  static setData(key: string, arr: any[]): void {
    localStorage.setItem(key, JSON.stringify(arr));
  }

  static getData(key: string): any[] {
    const data = localStorage.getItem(key);
    let updateData: any[] = data ? JSON.parse(data) : [];
    return updateData
  }

  static remData(arr: any[], key: string, index: number) {
    arr.splice(index, 1);
    this.setData(key, arr);
  };

  static addData(key: string, arr: any[], xData: any, isInitial: boolean = false) {
    if (isInitial) {
      arr.unshift(xData)
    } else {
      arr.push(xData)
    }

    this.setData(key, arr);

  };

  static delData(key: string): void {
    localStorage.removeItem(key);
  }
}
