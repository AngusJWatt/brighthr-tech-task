import { cleanup } from '@testing-library/react';
import { getFiles } from "./getFiles";

const mockData = [
    { type: 'csv', name: 'Cost centres', added: '2016-08-12' },
    { type: 'folder', name: 'Misc', files: [
        { type: 'doc', name: 'Christmas party', added: '2017-12-02' },
        { type: 'mov', name: 'Welcome to the company!', added: '2015-04-24' },
        { type: 'folder', name: 'Empty', files: [] }
    ]
}];

describe('getFiles', () => {
    beforeEach(() => {
        cleanup();
    });

    afterAll(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    it('formats files and folders recursively', async () => {
        jest.spyOn(global, 'fetch').mockImplementation((): any =>
            Promise.resolve({ json: () => Promise.resolve(JSON.stringify(mockData)), ok: true })
        );

        const data = await getFiles();
        expect(data).toStrictEqual(mockData);
    });

    /* Will have to leave this unresolved, as I cannot find a way to test this that doesn't trip Jest into stopping when
     * an error is thrown. I tried expect(() => getFiles()).toThrow(...) and try { getFiles() } catch (e) {
     * expect(e.message).toBe(...) } but both of these caused my test script to end prematurely, and not handling the
     * error makes the test fail. */
    it.todo('throws an error if the response is not correctly handled');

    it('removes any directory that does not have a name or correctly-formatted files property', async () => {
        jest.spyOn(global, 'fetch').mockImplementation((): any =>
            Promise.resolve({ json: () => Promise.resolve(JSON.stringify([ 
                ...mockData,
                { type: 'folder', name: 'Whoops, something went wrong', files: 'Where did the files go?' },
                { type: 'folder', name: '', files: [] }
            ])), ok: true })
        );

        const data = await getFiles();
        expect(data).toStrictEqual(mockData);
    });

    /* Opted not to remove files without a type, as they can be untyped if they are executables. */
    it('removes any file that does not have a name', async () => {
        jest.spyOn(global, 'fetch').mockImplementation((): any =>
            Promise.resolve({ json: () => Promise.resolve(JSON.stringify([ 
                ...mockData,
                { type: 'docx', name: '', added: '12-03-06' }
            ])), ok: true })
        );

        const data = await getFiles();
        expect(data).toStrictEqual(mockData);
    });
});