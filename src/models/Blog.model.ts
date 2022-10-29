import { v4 as uuid } from 'uuid';

export class Blog {
    public readonly id: string;

    constructor(
        public readonly title: string,
        public readonly content: string,
        public readonly image: string
    ) {
        this.id = uuid();
    }
}
