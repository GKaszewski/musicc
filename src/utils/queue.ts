/**
 * @param size Size of the queue.
 */
export interface Queue<T> {
    size: number;
    /**
   * Pushes element to the queue.
   * @param val Element to push to the queue.
   * @returns Returns queue size.
   */
    push(val: T): number;
    /**
    * Pops last element.
    * @returns Returns last element.
    */
    pop(): T;
}

export class Queue<T> implements Queue<T> {
    private content: T[];

    constructor() {
        this.content = [];
        this.size = 0;
    }

    push(val: T) {
        this.content.push(val);
        return this.size = this.content.length;
    }

    pop() {
        return this.content.pop();
    }
}