export class LCS {
  /**
   * 
   * @param key es la clave del localStorage
   * @description Guarda un array en el localStorage
   * @description Si el array ya existe, lo actualiza
   * @param arr es el array a guardar
   * @description Convierte el array en un string y lo guarda en el localStorage
   */
  static setData(arr: any[], key: string): void {
    localStorage.setItem(key, JSON.stringify(arr));
  }

  /**
   * 
   * @param key es la clave del localStorage
   * @description Obtiene el array del localStorage y lo convierte en un array de objetos
   * @description Si no existe el array, devuelve un array vacío
   * @returns un array de objetos
   */
  static getData(key: string): any[] {
    const data = localStorage.getItem(key);
    let updateData: any[] = data ? JSON.parse(data) : [];
    return updateData
  }

  /**
   * 
   * @param arr es el array principal que contiene el array donde se va a eliminar el elemento
   * @param key es la clave del localStorage
   * @param index es el índice del elemento a eliminar
   * @description Elimina un elemento de un array y actualiza el localStorage
   */
  static remDataItem(arr: any[], key: string, index: number) {
    arr.splice(index, 1);
    this.setData(arr, key);
  };

  /**
   * 
   * @param arr es el array principal que contiene el array donde se va a eliminar el elemento
   * @param arr2 es el array que contiene el elemento a eliminar
   * @param key es la clave del localStorage
   * @param index es el índice del elemento a eliminar
   * @description Elimina un elemento de un array dentro de otro array y actualiza el localStorage
   */
  static remDataItemLv2(arr: any[], arr2: any[], key: string, index: number) {
    arr2.splice(index, 1);
    this.setData(arr, key);
  };

  /**
   * 
   * @param arr es el array principal que contiene el array donde se va a agregar el elemento
   * @param key es la clave del localStorage
   * @param xData es el elemento a agregar
   * @param isInitial es un booleano que indica si el elemento se agrega al principio o al final del array
   * @description Agrega un elemento a un array y actualiza el localStorage
   */
  static addDataItem(arr: any[], key: string, xData: any, isInitial: boolean = false) {
    if (isInitial) {
      arr.unshift(xData)
    } else {
      arr.push(xData)
    }

    this.setData(arr, key);

  };

  /**
   * 
   * @param arr es el array principal que contiene el array donde se va a agregar el elemento
   * @param arr2 es el array donde se va a agregar el elemento 
   * @param key es la clave del localStorage
   * @param xData es el elemento a agregar
   * @param isInitial es un booleano que indica si el elemento se agrega al principio o al final del array
   * @description Agrega un elemento a un array dentro de otro array y actualiza el localStorage
   */
  static addDataItemLv2(arr: any[], arr2: any[], key: string, xData: any, isInitial: boolean = false) {
    if (isInitial) {
      arr2.unshift(xData)
    } else {
      arr2.push(xData)
    }

    this.setData(arr, key);

  };

  /**
   * 
   * @param key es la clave del localStorage
   * @description Elimina por completo el localStorage de la clave
   * @description Elimina el localStorage de la clave
   */
  static delData(key: string): void {
    localStorage.removeItem(key);
  }
}
