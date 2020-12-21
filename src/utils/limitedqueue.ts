/**
 * Limited queue behaves like normal queue execpt this one has limited length.
 * When limit is reached the last element is freed.
 * @param size Current size of the queue.
 * @param limit Max size of the queue.
 */
export interface LimitedQueue<T> {
    size: number;
    limit: number;
    /**
    * Pushes element to the queue, if reaches limit last element is ejected.
    * @param val Element to push to the queue.
    * @returns Returns stack size.
    */
    push(val: T): number;
    /**
    * Pops last element.
    * @returns Returns last element.
    */
    pop(): T;
}

export class LimitedQueue<T> implements LimitedQueue<T> {
    private content: T[];

    constructor(limit: number = 50) {
        this.size = 0;
        this.limit = limit;
        this.content = [];
    }

    push(val: T) {
        if (this.size >= this.limit) {
            this.content.shift();
            this.content.push(val);
            return this.size = this.content.length;
        }

        this.content.push(val);
        this.size = this.content.length;
        return this.size;
    }

    pop() {
        return this.content.pop();
    }
}