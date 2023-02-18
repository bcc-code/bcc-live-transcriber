class Bible {
    version: string;
    cache: Record<string, any> = {}

    constructor(version: string) {
        this.version = version;
    }

    async verses(bookId: string, chapter: string, from: number, to?: number) {
        if (bookId && chapter && from) {
            const key = `${bookId}/${chapter}/${from}${to ? '/' + to : ''}`;
            if (this.cache[key]) {
                return this.cache[key];
            }

            const res = await fetch(`https://bibleapi.bcc.media/v1/${this.version}/${key}`)
            const {verses} = await res.json()
            if (verses) {
                return this.cache[key] = verses;
            }
        }

        return [];
    }
}

export default new Bible('nb-1930')