type DirectoryTableProps = { caption: string; }

export const DirectoryTable = ({ caption }: DirectoryTableProps) => {
    return (
        <table>
            <caption>{caption}</caption>
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Date</th>
                    <th scope="col">Click to open</th>
                </tr>
            </thead>
        </table>
    )
};