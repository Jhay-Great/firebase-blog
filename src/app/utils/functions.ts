// return lowercase strings
export const toLowerCase = (string:string) => string.toLowerCase();

// search functionality
export const search = <T>(collection:T[], queryType: keyof T, word:string) => {
    return collection.filter(data => {
        const queryProperty = data[queryType];
        if (typeof queryProperty === 'string') {
            return toLowerCase(queryProperty).includes(toLowerCase(word))
        }
        return false;
    })
}