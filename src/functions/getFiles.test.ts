import { cleanup } from '@testing-library/react';
import { getFiles } from "./getFiles";

const mockData = [
    { type: "csv", name: "Cost centres", added: "2016-08-12" },
    { type: "folder", name: "Misc", files: [
        { type: "doc", name: "Christmas party", added: "2017-12-02" },
        { type: "mov", name: "Welcome to the company!", added: "2015-04-24" },
        { type: "folder", name: "Empty", files: [] }
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
            Promise.resolve({ json: () => Promise.resolve(JSON.stringify(mockData)) })
        );

        const data = await getFiles();
        expect(data).toStrictEqual(mockData);
    });

    it.todo('throws an error if the response is not correctly handled');

    it.todo('removes any directory that does not have a name or correctly-formatted files property');

    it.todo('removes any directory that does not have a name');
});